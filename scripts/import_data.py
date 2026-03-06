#!/usr/bin/env python3
"""
WarScope — Data Import Pipeline
=================================
Imports military data, UCDP conflict history, and manual conflict JSON
into the WarScope PostgreSQL database.

Usage:
    python scripts/import_data.py

Requirements:
    pip install psycopg2-binary pandas requests pycountry python-dotenv
"""

import os
import sys
import json
import time
import logging
import re
from pathlib import Path
from typing import Optional

import pandas as pd
import requests
import pycountry
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("warscope")


# ---------------------------------------------------------------------------
# Paths  (resolve relative to this script's location)
# ---------------------------------------------------------------------------

SCRIPT_DIR   = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
ENV_FILE     = PROJECT_ROOT / "backend" / ".env"

MILITARY_CSV  = PROJECT_ROOT / "data" / "raw" / "military_data.csv"
CONFLICTS_CSV = PROJECT_ROOT / "data" / "raw" / "conflicts.csv"
CONFLICTS_JSON = PROJECT_ROOT / "data" / "conflicts.json"


# ---------------------------------------------------------------------------
# Nuclear arsenal overrides (source: FAS Nuclear Notebook 2024)
# ---------------------------------------------------------------------------

NUCLEAR_WEAPONS: dict[str, int] = {
    "USA": 5550,
    "RUS": 5580,
    "CHN": 600,
    "FRA": 290,
    "GBR": 225,
    "PAK": 170,
    "IND": 172,
    "PRK": 50,
    "ISR": 90,
}


# ---------------------------------------------------------------------------
# REST Countries API cache  (avoids repeated HTTP calls for the same name)
# ---------------------------------------------------------------------------

_geo_cache: dict[str, Optional[tuple[float, float]]] = {}

RESTCOUNTRIES_URL = "https://restcountries.com/v3.1/name/{name}?fields=latlng,name"


def fetch_lat_lng(country_name: str) -> Optional[tuple[float, float]]:
    """
    Fetch (latitude, longitude) from the REST Countries API.
    Results are cached in-process.  Returns None on any failure.
    """
    key = country_name.strip().lower()
    if key in _geo_cache:
        return _geo_cache[key]

    try:
        url = RESTCOUNTRIES_URL.format(name=requests.utils.quote(country_name))
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            if data and "latlng" in data[0] and len(data[0]["latlng"]) == 2:
                lat, lng = data[0]["latlng"]
                _geo_cache[key] = (float(lat), float(lng))
                return _geo_cache[key]
        log.debug("REST Countries: no latlng for '%s' (status %d)", country_name, resp.status_code)
    except Exception as exc:
        log.debug("REST Countries error for '%s': %s", country_name, exc)

    _geo_cache[key] = None
    time.sleep(0.15)   # gentle rate-limiting
    return None


# ---------------------------------------------------------------------------
# pycountry helpers
# ---------------------------------------------------------------------------

# Manual overrides for names that pycountry doesn't map cleanly
_NAME_OVERRIDES: dict[str, str] = {
    "russia":               "RUS",
    "iran":                 "IRN",
    "north korea":          "PRK",
    "south korea":          "KOR",
    "syria":                "SYR",
    "taiwan":               "TWN",
    "vietnam":              "VNM",
    "laos":                 "LAO",
    "bolivia":              "BOL",
    "moldova":              "MDA",
    "venezuela":            "VEN",
    "tanzania":             "TZA",
    "congo":                "COD",
    "dr congo":             "COD",
    "democratic republic of the congo": "COD",
    "republic of the congo": "COG",
    "ivory coast":          "CIV",
    "cape verde":           "CPV",
    "eswatini":             "SWZ",
    "swaziland":            "SWZ",
    "czech republic":       "CZE",
    "czechia":              "CZE",
    "united states":        "USA",
    "united states of america": "USA",
    "uk":                   "GBR",
    "united kingdom":       "GBR",
    "brunei":               "BRN",
    "palestine":            "PSE",
    "west bank":            "PSE",
    "gaza":                 "PSE",
    "south ossetia":        None,
    "somaliland":           None,
    "western sahara":       "ESH",
    "nagorno-karabakh":     None,
    "kosovo":               "XKX",
    "timor-leste":          "TLS",
    "east timor":           "TLS",
    "myanmar":              "MMR",
    "burma":                "MMR",
    "turkey":               "TUR",
    "turkiye":              "TUR",
}


def name_to_iso3(name: str) -> Optional[str]:
    """Convert a country name string to an ISO 3166-1 alpha-3 code."""
    if not name or not isinstance(name, str):
        return None

    clean = name.strip()

    # 1. Check manual overrides first (case-insensitive)
    override = _NAME_OVERRIDES.get(clean.lower())
    if override is not None:
        return override  # could be None explicitly (unrecognised territory)
    if override is None and clean.lower() in _NAME_OVERRIDES:
        return None      # explicitly unmappable

    # 2. pycountry fuzzy search
    try:
        result = pycountry.countries.search_fuzzy(clean)
        if result:
            return result[0].alpha_3
    except LookupError:
        pass

    # 3. Exact alpha-3 passthrough
    if re.fullmatch(r"[A-Z]{3}", clean.upper()):
        try:
            c = pycountry.countries.get(alpha_3=clean.upper())
            if c:
                return c.alpha_3
        except Exception:
            pass

    return None


def iso3_to_iso2(iso3: str) -> Optional[str]:
    """Convert ISO3 to ISO2, return None if not found."""
    try:
        c = pycountry.countries.get(alpha_3=iso3)
        return c.alpha_2 if c else None
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Numeric cleaning
# ---------------------------------------------------------------------------

def clean_numeric(value) -> int:
    """Strip $, commas, spaces and cast to int.  NaN / empty → 0."""
    if value is None:
        return 0
    if isinstance(value, (int, float)):
        return 0 if pd.isna(value) else int(value)
    s = str(value).strip().replace(",", "").replace("$", "").replace(" ", "")
    if not s:
        return 0
    # Remove trailing decimals like "1234.0"
    s = re.sub(r"\.0*$", "", s)
    try:
        return int(float(s))
    except (ValueError, OverflowError):
        return 0


# ---------------------------------------------------------------------------
# Database helpers
# ---------------------------------------------------------------------------

def get_connection() -> psycopg2.extensions.connection:
    """Open a psycopg2 connection using .env config."""
    load_dotenv(ENV_FILE)
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", 5432)),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", ""),
        dbname=os.getenv("DB_NAME", "warscope"),
    )


def country_id_by_iso3(cur, iso3: str) -> Optional[int]:
    """Return the countries.id for a given ISO3 code, or None."""
    cur.execute("SELECT id FROM countries WHERE iso3 = %s", (iso3,))
    row = cur.fetchone()
    return row[0] if row else None


def lat_lng_by_iso3(cur, iso3: str) -> tuple[Optional[float], Optional[float]]:
    """Return (lat, lng) from the countries table for a given ISO3 code."""
    cur.execute("SELECT latitude, longitude FROM countries WHERE iso3 = %s", (iso3,))
    row = cur.fetchone()
    return (row[0], row[1]) if row else (None, None)


# ---------------------------------------------------------------------------
# STEP 1 — Military data
# ---------------------------------------------------------------------------

# The CSV column names → countries table column names
COUNTRIES_COLS = {
    "rank":                  "rank",
    "total_population":      "total_population",
    "total_land_area_sq_km": "total_land_area_sq_km",
    "coastline_coverage_km": "coastline_coverage_km",
}

# The CSV column names → military_stats table column names
MILITARY_COLS = [
    "active_personnel",
    "reserve_personnel",
    "paramilitary",
    "total_military_manpower",
    "total_military_aircraft",
    "fighter_aircraft",
    "attack_aircraft",
    "transport_aircraft",
    "trainer_aircraft",
    "total_military_helicopters",
    "attack_helicopters",
    "tanks",
    "armored_fighting_vehicles",
    "self_propelled_artillery",
    "towed_artillery",
    "rocket_projectors",
    "total_naval_fleet",
    "aircraft_carriers",
    "submarines",
    "destroyers",
    "frigates",
    "corvettes",
    "defense_budget_usd",
]


def import_military_data(conn) -> tuple[int, int, list[str]]:
    """
    STEP 1: Import military_data.csv.
    Returns (countries_imported, military_stats_imported, failed_countries).
    """
    log.info("── STEP 1: Importing military_data.csv ──")

    if not MILITARY_CSV.exists():
        log.error("File not found: %s", MILITARY_CSV)
        return 0, 0, []

    df = pd.read_csv(MILITARY_CSV, dtype=str)
    df.fillna("", inplace=True)  # pandas 2.x: string columns cannot be filled with int 0

    # Normalise column names: lowercase, strip whitespace, spaces→underscores
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    log.info("Loaded %d rows from military_data.csv", len(df))

    countries_imported  = 0
    mil_stats_imported  = 0
    failed_countries: list[str] = []

    with conn.cursor() as cur:
        for _, row in df.iterrows():
            country_name: str = str(row.get("country", "")).strip()
            if not country_name:
                continue

            # ── Resolve ISO codes ──────────────────────────────────────────
            iso3 = name_to_iso3(country_name)
            if iso3 is None:
                log.warning("Could not resolve ISO3 for '%s' — skipping", country_name)
                failed_countries.append(country_name)
                continue

            iso2 = iso3_to_iso2(iso3)
            if iso2 is None:
                log.warning("Could not resolve ISO2 for '%s' (iso3=%s) — skipping", country_name, iso3)
                failed_countries.append(country_name)
                continue

            # ── Fetch lat/lng ──────────────────────────────────────────────
            geo = fetch_lat_lng(country_name)
            latitude  = geo[0] if geo else None
            longitude = geo[1] if geo else None

            # ── Insert into countries ──────────────────────────────────────
            region = str(row.get("region", "")).strip() or None

            try:
                cur.execute(
                    """
                    INSERT INTO countries
                        (name, iso2, iso3, region, latitude, longitude,
                         total_population, total_land_area_sq_km, coastline_coverage_km, rank)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (iso3) DO UPDATE SET
                        name                  = EXCLUDED.name,
                        region                = EXCLUDED.region,
                        latitude              = COALESCE(EXCLUDED.latitude,  countries.latitude),
                        longitude             = COALESCE(EXCLUDED.longitude, countries.longitude),
                        total_population      = EXCLUDED.total_population,
                        total_land_area_sq_km = EXCLUDED.total_land_area_sq_km,
                        coastline_coverage_km = EXCLUDED.coastline_coverage_km,
                        rank                  = EXCLUDED.rank,
                        updated_at            = NOW()
                    RETURNING id
                    """,
                    (
                        country_name,
                        iso2,
                        iso3,
                        region,
                        latitude,
                        longitude,
                        clean_numeric(row.get("total_population", 0)),
                        clean_numeric(row.get("total_land_area_sq_km", 0)),
                        clean_numeric(row.get("coastline_coverage_km", 0)),
                        clean_numeric(row.get("rank", 0)),
                    ),
                )
                country_db_id = cur.fetchone()[0]
                countries_imported += 1
                log.debug("  country upserted: %s (id=%d)", country_name, country_db_id)
            except Exception as exc:
                conn.rollback()
                log.error("Failed to upsert country '%s': %s", country_name, exc)
                failed_countries.append(country_name)
                continue

            # ── Insert into military_stats ─────────────────────────────────
            # Build dynamic column list from whichever MILITARY_COLS exist in the CSV
            available_cols = [c for c in MILITARY_COLS if c in df.columns]
            values = [clean_numeric(row.get(c, 0)) for c in available_cols]

            try:
                col_list = ", ".join(available_cols)
                placeholder_list = ", ".join(["%s"] * len(available_cols))
                update_list = ", ".join(
                    f"{c} = EXCLUDED.{c}" for c in available_cols
                )
                cur.execute(
                    f"""
                    INSERT INTO military_stats (country_id, {col_list})
                    VALUES (%s, {placeholder_list})
                    ON CONFLICT (country_id) DO UPDATE SET
                        {update_list},
                        updated_at = NOW()
                    """,
                    [country_db_id, *values],
                )
                mil_stats_imported += 1
                log.debug("  military_stats upserted for %s", country_name)
            except Exception as exc:
                conn.rollback()
                log.error("Failed to upsert military_stats for '%s': %s", country_name, exc)
                # Don't add to failed_countries — country itself was fine
                continue

        # ── Nuclear weapons overrides ─────────────────────────────────────
        log.info("Applying nuclear weapons overrides ...")
        for nuke_iso3, warheads in NUCLEAR_WEAPONS.items():
            cur.execute(
                """
                UPDATE military_stats
                SET nuclear_weapons = %s, updated_at = NOW()
                WHERE country_id = (SELECT id FROM countries WHERE iso3 = %s)
                """,
                (warheads, nuke_iso3),
            )
            if cur.rowcount:
                log.debug("  nuclear_weapons=%d set for %s", warheads, nuke_iso3)

        conn.commit()

    return countries_imported, mil_stats_imported, failed_countries


# ---------------------------------------------------------------------------
# STEP 2 — UCDP conflict history CSV
# ---------------------------------------------------------------------------

UCDP_COLUMNS_NEEDED = [
    "conflict_id",
    "location",
    "side_a",
    "side_b",
    "intensity_level",
    "type_of_conflict",
    "start_date",
    "year",
    "region",
    "ep_end",
    "gwno_loc",
]


def _extract_first_country(location: str) -> Optional[str]:
    """
    UCDP 'location' can be "Afghanistan, Pakistan".
    Take the first token and try to resolve to ISO3.
    """
    if not location or not isinstance(location, str):
        return None
    first = location.split(",")[0].strip()
    return name_to_iso3(first)


def _parse_start_year(start_date_val) -> Optional[int]:
    """Extract the year component from a start_date string like '1946-01-01'."""
    if pd.isna(start_date_val) or str(start_date_val).strip() == "0":
        return None
    s = str(start_date_val).strip()
    match = re.match(r"(\d{4})", s)
    return int(match.group(1)) if match else None


def import_ucdp_conflicts(conn) -> tuple[int, list[str]]:
    """
    STEP 2: Import conflicts.csv (UCDP dataset).
    Returns (conflicts_imported, failed_list).
    """
    log.info("── STEP 2: Importing conflicts.csv (UCDP) ──")

    if not CONFLICTS_CSV.exists():
        log.error("File not found: %s", CONFLICTS_CSV)
        return 0, []

    df = pd.read_csv(CONFLICTS_CSV, dtype=str, low_memory=False)
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    # Keep only columns we need (whichever are present)
    keep = [c for c in UCDP_COLUMNS_NEEDED if c in df.columns]
    df = df[keep].copy()
    df.fillna("", inplace=True)

    # Filter to year >= 1990
    df["_year_int"] = df["year"].apply(lambda v: int(v) if str(v).isdigit() else 0)
    df = df[df["_year_int"] >= 1990]
    log.info("UCDP rows after year>=1990 filter: %d", len(df))

    imported = 0
    failed: list[str] = []

    with conn.cursor() as cur:
        for _, row in df.iterrows():
            location    = str(row.get("location", "")).strip()
            actor1_name = str(row.get("side_a", "")).strip()
            actor2_name = str(row.get("side_b", "")).strip()
            region      = str(row.get("region", "")).strip() or None

            # ep_end=0 → still ongoing → is_active=True
            ep_end_val = str(row.get("ep_end", "1")).strip()
            is_active  = (ep_end_val == "0")

            start_year_val = _parse_start_year(row.get("start_date", ""))
            last_active    = row.get("_year_int") or start_year_val

            # Resolve ISO3 codes  (non-critical — can be NULL)
            loc_iso3    = _extract_first_country(location)
            actor1_iso3 = name_to_iso3(actor1_name) if actor1_name else None
            actor2_iso3 = name_to_iso3(actor2_name) if actor2_name else None

            # Lat/lng: prefer country table, fall back to None
            latitude, longitude = (None, None)
            if loc_iso3:
                latitude, longitude = lat_lng_by_iso3(cur, loc_iso3)

            try:
                ext_conflict_id_raw = row.get("conflict_id", "")
                ext_conflict_id = int(ext_conflict_id_raw) if str(ext_conflict_id_raw).isdigit() else None
                intensity       = int(row["intensity_level"]) if str(row.get("intensity_level","")).isdigit() else None
                conflict_type   = int(row["type_of_conflict"]) if str(row.get("type_of_conflict","")).isdigit() else None

                cur.execute(
                    """
                    INSERT INTO conflicts
                        (conflict_id, location, actor1, actor2,
                         actor1_iso3, actor2_iso3,
                         conflict_type, intensity_level,
                         start_year, last_active_year,
                         is_active, region,
                         latitude, longitude, source)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,'ucdp')
                    ON CONFLICT DO NOTHING
                    """,
                    (
                        ext_conflict_id,
                        location or None,
                        actor1_name or None,
                        actor2_name or None,
                        actor1_iso3,
                        actor2_iso3,
                        conflict_type,
                        intensity,
                        start_year_val,
                        int(last_active) if last_active else None,
                        is_active,
                        region,
                        float(latitude)  if latitude  is not None else None,
                        float(longitude) if longitude is not None else None,
                    ),
                )
                imported += 1
            except Exception as exc:
                conn.rollback()
                log.error("Failed to insert UCDP conflict '%s': %s", location, exc)
                failed.append(location or "(unknown)")

        conn.commit()

    return imported, failed


# ---------------------------------------------------------------------------
# STEP 3 — Manual conflicts JSON
# ---------------------------------------------------------------------------

def import_manual_conflicts(conn) -> tuple[int, list[str]]:
    """
    STEP 3: Import data/conflicts.json.
    Returns (conflicts_imported, failed_list).
    """
    log.info("── STEP 3: Importing conflicts.json (manual) ──")

    if not CONFLICTS_JSON.exists():
        log.error("File not found: %s", CONFLICTS_JSON)
        return 0, []

    with open(CONFLICTS_JSON, encoding="utf-8") as fh:
        records = json.load(fh)

    if not isinstance(records, list):
        log.error("conflicts.json must contain a JSON array")
        return 0, []

    log.info("Manual conflict records: %d", len(records))
    imported = 0
    failed: list[str] = []

    with conn.cursor() as cur:
        for record in records:
            name = str(record.get("name", "")).strip()
            if not name:
                log.warning("Skipping record with no 'name' field: %s", record)
                continue

            # Skip if already exists (by name, case-insensitive)
            cur.execute(
                "SELECT id FROM conflicts WHERE LOWER(location) = LOWER(%s) AND source = 'manual'",
                (name,),
            )
            if cur.fetchone():
                log.debug("  '%s' already exists — skipping", name)
                continue

            actor1_iso3 = record.get("actor1_iso3") or None
            actor2_iso3 = record.get("actor2_iso3") or None

            # Lat/lng: prefer explicit values in JSON, fall back to countries table
            latitude  = record.get("latitude")
            longitude = record.get("longitude")
            if (latitude is None or longitude is None) and actor1_iso3:
                lat_db, lng_db = lat_lng_by_iso3(cur, actor1_iso3)
                latitude  = latitude  if latitude  is not None else lat_db
                longitude = longitude if longitude is not None else lng_db

            try:
                cur.execute(
                    """
                    INSERT INTO conflicts
                        (location, actor1_iso3, actor2_iso3,
                         conflict_type, intensity_level,
                         start_year, is_active,
                         description, latitude, longitude, source)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,'manual')
                    """,
                    (
                        name,
                        actor1_iso3,
                        actor2_iso3,
                        record.get("conflict_type"),
                        record.get("intensity_level"),
                        record.get("start_year"),
                        bool(record.get("is_active", False)),
                        record.get("description"),
                        float(latitude)  if latitude  is not None else None,
                        float(longitude) if longitude is not None else None,
                    ),
                )
                imported += 1
                log.debug("  inserted manual conflict: %s", name)
            except Exception as exc:
                conn.rollback()
                log.error("Failed to insert manual conflict '%s': %s", name, exc)
                failed.append(name)

        conn.commit()

    return imported, failed


# ---------------------------------------------------------------------------
# STEP 4 — Summary report
# ---------------------------------------------------------------------------

def print_summary(
    countries:    int,
    mil_stats:    int,
    ucdp:         int,
    manual:       int,
    failed_countries: list[str],
    failed_conflicts: list[str],
) -> None:
    print()
    print("=" * 55)
    print("  WarScope — Import Summary")
    print("=" * 55)
    print(f"  ✅  Countries imported       : {countries}")
    print(f"  ✅  Military stats imported  : {mil_stats}")
    print(f"  ✅  UCDP conflicts imported  : {ucdp}")
    print(f"  ✅  Manual conflicts imported: {manual}")

    if failed_countries:
        print(f"\n  ❌  Failed countries ({len(failed_countries)}):")
        for name in sorted(set(failed_countries)):
            print(f"       • {name}")
    else:
        print("  ✅  No country failures")

    if failed_conflicts:
        print(f"\n  ❌  Failed conflicts ({len(failed_conflicts)}):")
        for name in sorted(set(failed_conflicts))[:30]:   # cap at 30 for readability
            print(f"       • {name}")
        if len(failed_conflicts) > 30:
            print(f"       … and {len(failed_conflicts) - 30} more")
    else:
        print("  ✅  No conflict failures")

    print("=" * 55)
    print()


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> int:
    log.info("WarScope data import starting …")

    # Verify input files exist before opening a DB connection
    missing = [
        str(p) for p in [MILITARY_CSV, CONFLICTS_CSV, CONFLICTS_JSON]
        if not p.exists()
    ]
    if missing:
        for path in missing:
            log.warning("Input file not found (will be skipped): %s", path)

    # Open DB connection
    try:
        conn = get_connection()
        log.info("Database connection established")
    except psycopg2.OperationalError as exc:
        log.error("Cannot connect to database: %s", exc)
        log.error("Check your backend/.env and ensure PostgreSQL is running.")
        return 1

    # Add a UNIQUE constraint on military_stats.country_id if it doesn't exist
    # (allows ON CONFLICT in STEP 1)
    with conn.cursor() as cur:
        cur.execute(
            """
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint
                    WHERE conname = 'military_stats_country_id_key'
                ) THEN
                    ALTER TABLE military_stats
                    ADD CONSTRAINT military_stats_country_id_key UNIQUE (country_id);
                END IF;
            END
            $$;
            """
        )
        conn.commit()

    try:
        # Step 1
        countries_n, mil_n, failed_countries = import_military_data(conn)

        # Step 2
        ucdp_n, failed_ucdp = import_ucdp_conflicts(conn)

        # Step 3
        manual_n, failed_manual = import_manual_conflicts(conn)

    finally:
        conn.close()
        log.info("Database connection closed")

    # Step 4
    all_failed_conflicts = failed_ucdp + failed_manual
    print_summary(countries_n, mil_n, ucdp_n, manual_n, failed_countries, all_failed_conflicts)

    return 0


if __name__ == "__main__":
    sys.exit(main())
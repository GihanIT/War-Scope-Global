#!/usr/bin/env python3
"""
generate_timeline_data.py
Run from project root: python generate_timeline_data.py
Reads: /data/raw/<your_csv>.csv
Writes: src/data/timeline-data.js
"""

import csv, json, sys, os, glob
from collections import defaultdict
from datetime import datetime

# ── Find CSV ──────────────────────────────────────────────────────────────────
# Paths relative to project root (works on Windows and Linux)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DIR    = os.path.join(SCRIPT_DIR, 'data', 'raw')
OUT_FILE   = os.path.join(SCRIPT_DIR, 'frontend', 'src', 'data', 'timeline-data.js')

# Try specific file first, then any csv in folder
SPECIFIC = os.path.join(RAW_DIR, 'conflicts.csv')
if os.path.exists(SPECIFIC):
    csvfiles = [SPECIFIC]
else:
    csvfiles = glob.glob(os.path.join(RAW_DIR, '*.csv'))

if not csvfiles:
    print(f"ERROR: No CSV found in {RAW_DIR}")
    sys.exit(1)

# Use highest version if multiple
csvfiles.sort()
CSV_FILE = csvfiles[-1]
print(f"Reading: {CSV_FILE}")

# ── UCDP conflict type labels ─────────────────────────────────────────────────
CONFLICT_TYPES = {
    1: 'Extra-systemic',
    2: 'Inter-state',
    3: 'Internal',
    4: 'Internationalised internal',
}

REGIONS = {
    1: 'Europe',
    2: 'Middle East',
    3: 'Asia',
    4: 'Africa',
    5: 'Americas',
    6: 'Oceania',
}

INTENSITY_LABELS = {
    1: 'Minor conflict',
    2: 'War',
}

def parse_date(s):
    if not s or s.strip() == '': return None
    for fmt in ('%d/%m/%Y', '%Y-%m-%d', '%m/%d/%Y'):
        try:
            return datetime.strptime(s.strip(), fmt).strftime('%Y-%m-%d')
        except ValueError:
            continue
    return None

def safe_int(s):
    try: return int(str(s).strip())
    except: return None

# ── Parse CSV ─────────────────────────────────────────────────────────────────
# Auto-detect delimiter
with open(CSV_FILE, encoding='utf-8-sig') as f:
    sample = f.read(2048)
    dialect = csv.Sniffer().sniff(sample, delimiters='\t,;|')
    delimiter = dialect.delimiter
    print(f"Detected delimiter: {repr(delimiter)}")

# Preview first row
with open(CSV_FILE, encoding='utf-8-sig') as f:
    reader = csv.DictReader(f, delimiter=delimiter)
    first_row = next(reader, None)
    if first_row:
        print(f"Columns: {list(first_row.keys())[:8]}")
        print(f"Sample conflict_id value: {repr(first_row.get('conflict_id'))}")
    else:
        print("ERROR: CSV appears empty")
        sys.exit(1)

# Group rows by conflict_id
conflicts_raw = defaultdict(list)

with open(CSV_FILE, encoding='utf-8-sig') as f:
    reader = csv.DictReader(f, delimiter=delimiter)
    for row in reader:
        cid = safe_int(row.get('conflict_id'))
        if cid:
            conflicts_raw[cid].append(row)

print(f"Found {len(conflicts_raw)} unique conflicts")

# ── Build structured conflicts ────────────────────────────────────────────────
conflicts = []

for cid, rows in conflicts_raw.items():
    # Sort rows by year
    rows_sorted = sorted(rows, key=lambda r: safe_int(r.get('year')) or 0)
    first = rows_sorted[0]
    last  = rows_sorted[-1]

    years = [safe_int(r.get('year')) for r in rows_sorted if safe_int(r.get('year'))]
    if not years: continue

    location   = first.get('location', '').strip()
    side_a     = first.get('side_a', '').strip()
    side_b     = first.get('side_b', '').strip()
    incompat   = safe_int(first.get('incompatibility')) # 1=territory, 2=government
    terr_name  = first.get('territory_name', '').strip()
    region_id  = safe_int(first.get('region'))
    conf_type  = safe_int(first.get('type_of_conflict'))

    start_date  = parse_date(first.get('start_date'))
    start_date2 = parse_date(first.get('start_date2'))

    # Build timeline episodes from year-rows
    episodes = []
    for r in rows_sorted:
        yr        = safe_int(r.get('year'))
        intensity = safe_int(r.get('intensity_level'))
        ep_end    = r.get('ep_end', '0').strip()
        ep_end_dt = parse_date(r.get('ep_end_date'))
        cum_int   = safe_int(r.get('cumulative_intensity'))
        s_date2   = parse_date(r.get('start_date2'))

        episodes.append({
            'year':       yr,
            'intensity':  intensity,
            'intensityLabel': INTENSITY_LABELS.get(intensity, 'Conflict'),
            'episodeEnd': ep_end == '1',
            'endDate':    ep_end_dt,
            'startDate':  s_date2,
            'cumulative': cum_int,
        })

    # Peak intensity
    max_intensity = max((e['intensity'] or 0) for e in episodes)

    # Active years span
    active_years = sorted(set(years))
    gaps = []
    for i in range(1, len(active_years)):
        if active_years[i] - active_years[i-1] > 1:
            gaps.append({'from': active_years[i-1], 'to': active_years[i]})

    # Incompatibility label
    incompat_label = {1: 'Territory', 2: 'Government'}.get(incompat, 'Unknown')

    # Is currently active (last year >= 2020 and no final ep_end)
    last_year = max(years)
    last_ep_end = last.get('ep_end', '0').strip()
    is_active = last_year >= 2020 and last_ep_end != '1'

    conflicts.append({
        'id':           cid,
        'location':     location,
        'sideA':        side_a,
        'sideB':        side_b,
        'incompatibility': incompat_label,
        'territory':    terr_name if terr_name else None,
        'region':       REGIONS.get(region_id, 'Unknown'),
        'regionId':     region_id,
        'conflictType': CONFLICT_TYPES.get(conf_type, 'Unknown'),
        'conflictTypeId': conf_type,
        'startDate':    start_date,
        'startDate2':   start_date2,
        'startYear':    min(years),
        'lastYear':     last_year,
        'isActive':     is_active,
        'peakIntensity': max_intensity,
        'peakLabel':    INTENSITY_LABELS.get(max_intensity, 'Unknown'),
        'activeYears':  active_years,
        'gaps':         gaps,
        'duration':     last_year - min(years) + 1,
        'episodes':     episodes,
        'episodeCount': len(episodes),
    })

# Sort by startYear desc (most recent first in default view)
conflicts.sort(key=lambda c: c['startYear'])

# ── Stats ─────────────────────────────────────────────────────────────────────
total       = len(conflicts)
active      = sum(1 for c in conflicts if c['isActive'])
wars        = sum(1 for c in conflicts if c['peakIntensity'] == 2)
by_region   = defaultdict(int)
by_type     = defaultdict(int)
by_decade   = defaultdict(int)

for c in conflicts:
    by_region[c['region']] += 1
    by_type[c['conflictType']] += 1
    decade = (c['startYear'] // 10) * 10
    by_decade[str(decade)] += 1

stats = {
    'total':    total,
    'active':   active,
    'wars':     wars,
    'byRegion': dict(by_region),
    'byType':   dict(by_type),
    'byDecade': dict(sorted(by_decade.items())),
    'yearMin':  min(c['startYear'] for c in conflicts),
    'yearMax':  max(c['lastYear']  for c in conflicts),
}

print(f"Stats: {total} conflicts, {active} active, {wars} wars")
print(f"Year range: {stats['yearMin']}–{stats['yearMax']}")

# ── Write JS ──────────────────────────────────────────────────────────────────
os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)

js_content = f"""// AUTO-GENERATED by generate_timeline_data.py
// Source: UCDP Conflict Dataset
// DO NOT EDIT MANUALLY — re-run the script to regenerate

export const TIMELINE_STATS = {json.dumps(stats, indent=2)};

export const TIMELINE_CONFLICTS = {json.dumps(conflicts, indent=2)};

export default TIMELINE_CONFLICTS;
"""

with open(OUT_FILE, 'w', encoding='utf-8') as f:
    f.write(js_content)

kb = os.path.getsize(OUT_FILE) / 1024
print(f"Written: {OUT_FILE} ({kb:.1f} KB)")

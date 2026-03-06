-- =============================================================================
-- WarScope — Military Intelligence Platform
-- Database Schema
-- =============================================================================

-- -----------------------------------------------------------------------------
-- EXTENSIONS
-- -----------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =============================================================================
-- TABLE: countries
-- =============================================================================

CREATE TABLE IF NOT EXISTS countries (
    id                      SERIAL          PRIMARY KEY,
    name                    VARCHAR(100)    NOT NULL,
    iso2                    VARCHAR(2)      UNIQUE NOT NULL,
    iso3                    VARCHAR(3)      UNIQUE NOT NULL,
    region                  VARCHAR(100),
    latitude                DECIMAL(9, 6),
    longitude               DECIMAL(9, 6),
    total_population        BIGINT,
    total_land_area_sq_km   BIGINT,
    coastline_coverage_km   BIGINT,
    rank                    INTEGER,
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_countries_iso2   ON countries (iso2);
CREATE INDEX IF NOT EXISTS idx_countries_iso3   ON countries (iso3);
CREATE INDEX IF NOT EXISTS idx_countries_name   ON countries (name);
CREATE INDEX IF NOT EXISTS idx_countries_region ON countries (region);
CREATE INDEX IF NOT EXISTS idx_countries_rank   ON countries (rank);


-- =============================================================================
-- TABLE: military_stats
-- =============================================================================

CREATE TABLE IF NOT EXISTS military_stats (
    id                              SERIAL      PRIMARY KEY,
    country_id                      INTEGER     NOT NULL REFERENCES countries(id) ON DELETE CASCADE,

    -- Personnel
    active_personnel                INTEGER,
    reserve_personnel               INTEGER,
    paramilitary                    INTEGER,
    total_military_manpower         INTEGER,

    -- Land forces
    tanks                           INTEGER,
    armored_fighting_vehicles       INTEGER,
    self_propelled_artillery        INTEGER,
    towed_artillery                 INTEGER,
    rocket_projectors               INTEGER,

    -- Air forces
    total_military_aircraft         INTEGER,
    fighter_aircraft                INTEGER,
    attack_aircraft                 INTEGER,
    transport_aircraft              INTEGER,
    trainer_aircraft                INTEGER,
    attack_helicopters              INTEGER,
    total_military_helicopters      INTEGER,

    -- Naval forces
    total_naval_fleet               INTEGER,
    aircraft_carriers               INTEGER,
    submarines                      INTEGER,
    destroyers                      INTEGER,
    frigates                        INTEGER,
    corvettes                       INTEGER,

    -- Budget & WMD
    defense_budget_usd              BIGINT,
    nuclear_weapons                 INTEGER     DEFAULT 0,

    created_at                      TIMESTAMPTZ DEFAULT NOW(),
    updated_at                      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_military_stats_country_id     ON military_stats (country_id);
CREATE INDEX IF NOT EXISTS idx_military_stats_defense_budget ON military_stats (defense_budget_usd DESC);
CREATE INDEX IF NOT EXISTS idx_military_stats_active_persnl  ON military_stats (active_personnel DESC);


-- =============================================================================
-- TABLE: conflicts
-- =============================================================================

CREATE TABLE IF NOT EXISTS conflicts (
    id                  SERIAL          PRIMARY KEY,
    conflict_id         INTEGER,                        -- External reference ID (e.g. UCDP ID)
    location            VARCHAR(200),
    actor1              VARCHAR(200),
    actor2              VARCHAR(200),
    actor1_iso3         VARCHAR(3),
    actor2_iso3         VARCHAR(3),
    conflict_type       INTEGER,                        -- 1=intrastate, 2=interstate, 3=internationalised intrastate, 4=extrasystemic
    intensity_level     INTEGER,                        -- 1=minor (25-999 deaths), 2=war (1000+ deaths)
    start_year          INTEGER,
    last_active_year    INTEGER,
    is_active           BOOLEAN         DEFAULT FALSE,
    region              VARCHAR(100),
    description         TEXT,
    latitude            DECIMAL(9, 6),
    longitude           DECIMAL(9, 6),
    source              VARCHAR(50)     DEFAULT 'ucdp',
    created_at          TIMESTAMPTZ     DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conflicts_actor1_iso3     ON conflicts (actor1_iso3);
CREATE INDEX IF NOT EXISTS idx_conflicts_actor2_iso3     ON conflicts (actor2_iso3);
CREATE INDEX IF NOT EXISTS idx_conflicts_is_active       ON conflicts (is_active);
CREATE INDEX IF NOT EXISTS idx_conflicts_intensity_level ON conflicts (intensity_level);
CREATE INDEX IF NOT EXISTS idx_conflicts_start_year      ON conflicts (start_year);
CREATE INDEX IF NOT EXISTS idx_conflicts_region          ON conflicts (region);
CREATE INDEX IF NOT EXISTS idx_conflicts_conflict_id     ON conflicts (conflict_id);


-- =============================================================================
-- TABLE: news
-- =============================================================================

CREATE TABLE IF NOT EXISTS news (
    id              SERIAL          PRIMARY KEY,
    country         VARCHAR(100),
    title           TEXT            NOT NULL,
    source          VARCHAR(200),
    url             TEXT,
    published_at    TIMESTAMP,
    tone            DECIMAL(5, 4),  -- Sentiment score: negative = hostile, positive = neutral/positive
    created_at      TIMESTAMPTZ     DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_news_country      ON news (country);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_tone         ON news (tone);


-- =============================================================================
-- SEED DATA: 5 Countries
-- =============================================================================

INSERT INTO countries (name, iso2, iso3, region, latitude, longitude, total_population, total_land_area_sq_km, coastline_coverage_km, rank)
VALUES
    ('United States', 'US', 'USA', 'North America',   37.090240,   -95.712891, 339000000,  9372610,  19924, 1),
    ('Russia',        'RU', 'RUS', 'Europe/Asia',     61.524010,   105.318756, 144000000, 17098242,  37653, 2),
    ('China',         'CN', 'CHN', 'Asia',            35.861660,   104.195397, 1410000000,  9596960,  14500, 3),
    ('India',         'IN', 'IND', 'Asia',            20.593684,    78.962880, 1428000000,  3287263,   7517, 4),
    ('Pakistan',      'PK', 'PAK', 'Asia',            30.375321,    69.345116,  231000000,   881913,   1046, 7)
ON CONFLICT (iso3) DO NOTHING;


-- =============================================================================
-- SEED DATA: Military Stats
-- Sources: Global Firepower Index 2024, SIPRI, open-source estimates
-- =============================================================================

-- United States
INSERT INTO military_stats (
    country_id,
    active_personnel, reserve_personnel, paramilitary, total_military_manpower,
    tanks, armored_fighting_vehicles, self_propelled_artillery, towed_artillery, rocket_projectors,
    total_military_aircraft, fighter_aircraft, attack_aircraft, transport_aircraft, trainer_aircraft, attack_helicopters, total_military_helicopters,
    total_naval_fleet, aircraft_carriers, submarines, destroyers, frigates, corvettes,
    defense_budget_usd, nuclear_weapons
)
SELECT
    id,
    1328000, 799500, 0, 2127500,
    5500, 45000, 1498, 1340, 1366,
    13300, 1956, 716, 945, 2764, 983, 5768,
    484, 11, 68, 92, 0, 0,
    886000000000, 5550
FROM countries WHERE iso3 = 'USA';

-- Russia
INSERT INTO military_stats (
    country_id,
    active_personnel, reserve_personnel, paramilitary, total_military_manpower,
    tanks, armored_fighting_vehicles, self_propelled_artillery, towed_artillery, rocket_projectors,
    total_military_aircraft, fighter_aircraft, attack_aircraft, transport_aircraft, trainer_aircraft, attack_helicopters, total_military_helicopters,
    total_naval_fleet, aircraft_carriers, submarines, destroyers, frigates, corvettes,
    defense_budget_usd, nuclear_weapons
)
SELECT
    id,
    1320000, 2000000, 250000, 3570000,
    12420, 30122, 6574, 7571, 3391,
    4173, 773, 739, 445, 522, 544, 1543,
    603, 1, 64, 15, 11, 88,
    65000000000, 6257
FROM countries WHERE iso3 = 'RUS';

-- China
INSERT INTO military_stats (
    country_id,
    active_personnel, reserve_personnel, paramilitary, total_military_manpower,
    tanks, armored_fighting_vehicles, self_propelled_artillery, towed_artillery, rocket_projectors,
    total_military_aircraft, fighter_aircraft, attack_aircraft, transport_aircraft, trainer_aircraft, attack_helicopters, total_military_helicopters,
    total_naval_fleet, aircraft_carriers, submarines, destroyers, frigates, corvettes,
    defense_budget_usd, nuclear_weapons
)
SELECT
    id,
    2000000, 510000, 1500000, 4010000,
    5000, 35000, 2000, 6246, 2650,
    3285, 1207, 371, 258, 404, 327, 912,
    730, 3, 79, 52, 47, 71,
    225000000000, 500
FROM countries WHERE iso3 = 'CHN';

-- India
INSERT INTO military_stats (
    country_id,
    active_personnel, reserve_personnel, paramilitary, total_military_manpower,
    tanks, armored_fighting_vehicles, self_propelled_artillery, towed_artillery, rocket_projectors,
    total_military_aircraft, fighter_aircraft, attack_aircraft, transport_aircraft, trainer_aircraft, attack_helicopters, total_military_helicopters,
    total_naval_fleet, aircraft_carriers, submarines, destroyers, frigates, corvettes,
    defense_budget_usd, nuclear_weapons
)
SELECT
    id,
    1455550, 1155000, 2527000, 5137550,
    4614, 9719, 235, 4158, 292,
    2229, 520, 130, 271, 359, 37, 722,
    293, 2, 18, 10, 19, 22,
    83600000000, 172
FROM countries WHERE iso3 = 'IND';

-- Pakistan
INSERT INTO military_stats (
    country_id,
    active_personnel, reserve_personnel, paramilitary, total_military_manpower,
    tanks, armored_fighting_vehicles, self_propelled_artillery, towed_artillery, rocket_projectors,
    total_military_aircraft, fighter_aircraft, attack_aircraft, transport_aircraft, trainer_aircraft, attack_helicopters, total_military_helicopters,
    total_naval_fleet, aircraft_carriers, submarines, destroyers, frigates, corvettes,
    defense_budget_usd, nuclear_weapons
)
SELECT
    id,
    654000, 550000, 291000, 1495000,
    2537, 10000, 600, 1240, 144,
    1372, 320, 90, 84, 500, 56, 350,
    114, 0, 9, 0, 11, 7,
    10800000000, 170
FROM countries WHERE iso3 = 'PAK';


-- =============================================================================
-- SEED DATA: Sample Conflicts
-- =============================================================================

INSERT INTO conflicts (conflict_id, location, actor1, actor2, actor1_iso3, actor2_iso3, conflict_type, intensity_level, start_year, last_active_year, is_active, region, description, latitude, longitude, source)
VALUES
    (412,  'Ukraine',         'Russia',                      'Ukraine',                      'RUS', 'UKR', 2, 2, 2022, 2025, TRUE,  'Europe',        'Full-scale Russian invasion of Ukraine, the largest land war in Europe since WWII. Involves combined arms warfare across multiple fronts.', 49.000000, 32.000000, 'ucdp'),
    (225,  'Gaza Strip',      'Israel',                      'Hamas',                        'ISR', NULL,  3, 2, 2023, 2025, TRUE,  'Middle East',   'High-intensity conflict following Hamas cross-border attack on Israel in October 2023, leading to large-scale IDF ground operations in Gaza.', 31.500000, 34.500000, 'ucdp'),
    (319,  'Sudan',           'SAF',                         'RSF',                          'SDN', NULL,  1, 2, 2023, 2025, TRUE,  'Africa',        'Civil war between the Sudanese Armed Forces and the Rapid Support Forces, causing one of the world largest humanitarian crises.', 15.500000, 32.500000, 'ucdp'),
    (501,  'Myanmar',         'Myanmar Military (Tatmadaw)', 'People Defence Forces',        'MMR', NULL,  1, 2, 2021, 2025, TRUE,  'Asia',          'Ongoing civil war following the 2021 military coup, involving the junta against a broad coalition of ethnic armed groups and resistance forces.', 19.745000, 96.129000, 'ucdp'),
    (187,  'Kashmir (LoC)',   'India',                       'Pakistan',                     'IND', 'PAK', 2, 1, 1947, 2023, FALSE, 'Asia',          'Longstanding territorial dispute over the Kashmir region involving cross-border skirmishes, shelling, and proxy engagements along the Line of Control.', 34.083660, 74.797371, 'ucdp');


-- =============================================================================
-- SEED DATA: Sample News
-- =============================================================================

INSERT INTO news (country, title, source, url, published_at, tone)
VALUES
    ('Ukraine',  'Ukraine reports advances in Zaporizhzhia counteroffensive amid continued Russian strikes',  'Reuters',         'https://reuters.com/example/ukraine-zaporizhzhia',       '2025-02-14 09:32:00', -0.4200),
    ('Russia',   'Russia announces new mobilisation wave targeting southern military districts',              'BBC News',        'https://bbc.com/example/russia-mobilisation',            '2025-02-13 14:10:00', -0.5800),
    ('China',    'PLA Navy conducts live-fire drills in South China Sea near contested Spratly Islands',     'AP News',         'https://apnews.com/example/china-south-china-sea-drills', '2025-02-12 06:45:00', -0.3100),
    ('India',    'India commissions INS Arighat, second nuclear ballistic missile submarine',                'The Hindu',       'https://thehindu.com/example/ins-arighat',               '2025-02-10 11:20:00',  0.1500),
    ('Pakistan', 'Pakistan test-fires Shaheen-III ballistic missile in response to regional tensions',       'Dawn News',       'https://dawn.com/example/shaheen-iii-test',              '2025-02-08 17:55:00', -0.2800);


-- =============================================================================
-- HELPER VIEWS
-- =============================================================================

-- Countries with military strength summary
CREATE OR REPLACE VIEW v_country_military_summary AS
SELECT
    c.id,
    c.name,
    c.iso2,
    c.iso3,
    c.region,
    c.rank,
    ms.active_personnel,
    ms.total_military_manpower,
    ms.tanks,
    ms.total_military_aircraft,
    ms.total_naval_fleet,
    ms.defense_budget_usd,
    ms.nuclear_weapons
FROM countries c
LEFT JOIN military_stats ms ON c.id = ms.country_id;

-- Active conflicts with country name resolution
CREATE OR REPLACE VIEW v_active_conflicts AS
SELECT
    cf.id,
    cf.conflict_id,
    cf.location,
    cf.actor1,
    cf.actor2,
    cf.actor1_iso3,
    cf.actor2_iso3,
    cf.intensity_level,
    cf.conflict_type,
    cf.start_year,
    cf.last_active_year,
    cf.region,
    cf.description,
    cf.latitude,
    cf.longitude,
    cf.source,
    c1.name AS actor1_country_name,
    c2.name AS actor2_country_name
FROM conflicts cf
LEFT JOIN countries c1 ON cf.actor1_iso3 = c1.iso3
LEFT JOIN countries c2 ON cf.actor2_iso3 = c2.iso3
WHERE cf.is_active = TRUE;
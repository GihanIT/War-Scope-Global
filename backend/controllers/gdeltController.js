// backend/controllers/gdeltController.js
//
// Curated conflict list merged with live 15-minute GDELT Event Discovery.
// Inactive curated conflicts are completely removed from the payload.

const axios     = require('axios');
const NodeCache = require('node-cache');
const { fetchDynamicGdeltEvents } = require('../utils/gdeltEventParser');

const cache     = new NodeCache({ stdTTL: 900, checkperiod: 60 });
const GDELT_DOC = 'https://api.gdeltproject.org/api/v2/doc/doc';

// CONFIG: Set to true to completely remove inactive conflicts from the payload
const REMOVE_INACTIVE = true;

// ─── Curated conflicts — each has keywords for GDELT activity check ───────────
const KNOWN_CONFLICTS = [
  // ── 2026 Major Additions ──────────────────────────────────────────────────────
  { conflict_name: 'US-Israel-Iran Regional Escalation', startIso3: 'IRN', endIso3: 'USA', arc_type: 'state-vs-state',
    keywords: ['us strike iran', 'israel us iran', 'iranian targets', 'coordinated strikes iran', 'proxy groups middle east'] },
  { conflict_name: 'US-Venezuela Confrontation', startIso3: 'VEN', endIso3: 'USA', arc_type: 'state-vs-state',
    keywords: ['venezuela us military', 'oil tanker blockade', 'caracas washington conflict', 'us operations venezuela'] },
  { conflict_name: 'Myanmar Junta Escalation', startIso3: 'MMR', endLat: 19.7, endLng: 96.1, arc_type: 'state-vs-nonstate',
    keywords: ['myanmar junta airstrikes', 'rebel drone attack myanmar', 'ethnic armed organizations', 'tatmadaw offensive'] },
  { conflict_name: 'Sudan SAF-RSF Deadlock', startIso3: 'SDN', endLat: 15.5, endLng: 32.5, arc_type: 'state-vs-nonstate',
    keywords: ['saf rsf deadlock', 'sudan civil war famine', 'khartoum fighting', 'rapid support forces attack'] },

  // ── Europe ───────────────────────────────────────────────────────────────────
  { conflict_name: 'Ukraine War',             startIso3: 'RUS', endIso3: 'UKR', arc_type: 'state-vs-state',
    keywords: ['ukraine','kyiv','kharkiv','donetsk','zaporizhzhia','kherson','bakhmut','odesa','russian offensive','dnipro'] },
  { conflict_name: 'Russia-Ukraine Front',    startIso3: 'UKR', endLat: 50.4, endLng: 30.5, arc_type: 'state-vs-nonstate',
    keywords: ['ukraine war','ukrainian forces','zelensky','ukrainian military','ukraine attack','ukraine shelling'] },
  { conflict_name: 'Kosovo Tensions',         startIso3: 'SRB', endLat: 42.6, endLng: 20.9, arc_type: 'state-vs-nonstate',
    keywords: ['kosovo','pristina','serbia tension','nato kosovo','kfor'] },
  { conflict_name: 'Armenia-Azerbaijan',      startIso3: 'AZE', endIso3: 'ARM', arc_type: 'state-vs-state',
    keywords: ['armenia','azerbaijan','nagorno','karabakh','yerevan','baku conflict'] },
  { conflict_name: 'Georgia-Russia',          startIso3: 'RUS', endIso3: 'GEO', arc_type: 'state-vs-state',
    keywords: ['georgia russia','south ossetia','abkhazia','tbilisi russia','georgia nato'] },
  { conflict_name: 'Belarus Crisis',          startIso3: 'BLR', endLat: 53.9, endLng: 27.6, arc_type: 'state-vs-nonstate',
    keywords: ['belarus','lukashenko','minsk protest','belarus opposition','wagner belarus'] },

  // ── Middle East ───────────────────────────────────────────────────────────────
  { conflict_name: 'Gaza Conflict',           startIso3: 'ISR', endLat: 31.5, endLng: 34.5, arc_type: 'state-vs-nonstate',
    keywords: ['gaza','hamas','rafah','idf strike','israeli airstrike','gaza strip','hamas attack','ceasefire gaza'] },
  { conflict_name: 'West Bank Violence',      startIso3: 'ISR', endLat: 31.9, endLng: 35.2, arc_type: 'state-vs-nonstate',
    keywords: ['west bank','jenin','ramallah','settler','idf west bank','palestinians killed'] },
  { conflict_name: 'Lebanon-Hezbollah',       startIso3: 'ISR', endIso3: 'LBN', arc_type: 'state-vs-state',
    keywords: ['hezbollah','beirut','southern lebanon','israel lebanon','nasrallah','lebanon strike'] },
  { conflict_name: 'Iran-Israel Tensions',    startIso3: 'IRN', endIso3: 'ISR', arc_type: 'state-vs-state',
    keywords: ['iran israel','iranian attack','israel iran','irgc israel','iranian drone','iranian missile'] },
  { conflict_name: 'Yemen War',               startIso3: 'YEM', endLat: 15.5, endLng: 47.9, arc_type: 'state-vs-nonstate',
    keywords: ['yemen','houthi','sanaa','aden','marib','hodeidah','yemen strike'] },
  { conflict_name: 'Yemen Houthi-Saudi',      startIso3: 'SAU', endIso3: 'YEM', arc_type: 'state-vs-state',
    keywords: ['houthi saudi','saudi arabia yemen','coalition yemen','riyadh houthi'] },
  { conflict_name: 'Red Sea Attacks',         startIso3: 'YEM', endLat: 14.5, endLng: 42.5, arc_type: 'state-vs-nonstate',
    keywords: ['red sea','houthi ship','commercial vessel attack','tanker attack','bab el-mandeb','shipping attack'] },
  { conflict_name: 'Syria War',               startIso3: 'SYR', endLat: 34.8, endLng: 38.9, arc_type: 'state-vs-nonstate',
    keywords: ['syria','damascus','aleppo','idlib','hts','syrian conflict','isis syria','sdf'] },
  { conflict_name: 'Iraq Insurgency',         startIso3: 'IRQ', endLat: 33.2, endLng: 43.7, arc_type: 'state-vs-nonstate',
    keywords: ['iraq','baghdad','mosul','erbil','isis iraq','pmu','iraqi forces','isil iraq'] },
  { conflict_name: 'Iran Internal Unrest',    startIso3: 'IRN', endLat: 35.7, endLng: 51.4, arc_type: 'state-vs-nonstate',
    keywords: ['iran protest','tehran unrest','irgc crackdown','iran opposition','mahsa amini','iran nuclear'] },
  { conflict_name: 'Turkey-PKK',              startIso3: 'TUR', endLat: 37.9, endLng: 40.2, arc_type: 'state-vs-nonstate',
    keywords: ['pkk','turkey kurdish','hpg','southeastern turkey','kurdistan workers','turkish military operation'] },

  // ── Africa ────────────────────────────────────────────────────────────────────
  { conflict_name: 'Sudan Civil War',         startIso3: 'SDN', endLat: 15.5, endLng: 32.5, arc_type: 'state-vs-nonstate',
    keywords: ['sudan','khartoum','rsf','darfur','omdurman','rapid support forces','sudanese army'] },
  { conflict_name: 'Ethiopia Conflict',       startIso3: 'ETH', endLat: 14.0, endLng: 38.7, arc_type: 'state-vs-nonstate',
    keywords: ['ethiopia','tigray','amhara','addis ababa','fano militia','oromo','tplf','ethiopian forces'] },
  { conflict_name: 'Somalia Al-Shabaab',      startIso3: 'SOM', endLat: 5.1,  endLng: 46.2, arc_type: 'state-vs-nonstate',
    keywords: ['somalia','mogadishu','al-shabaab','al shabaab','puntland','amisom','somalia attack'] },
  { conflict_name: 'DRC Eastern Conflict',    startIso3: 'COD', endLat: -1.7, endLng: 29.2, arc_type: 'state-vs-nonstate',
    keywords: ['congo','drc','goma','m23','ituri','kivu','eastern congo','kinshasa offensive'] },
  { conflict_name: 'DRC-Rwanda Tensions',     startIso3: 'RWA', endIso3: 'COD', arc_type: 'state-vs-state',
    keywords: ['rwanda congo','m23 rwanda','drc rwanda','kigali congo','rwanda troops'] },
  { conflict_name: 'Nigeria Boko Haram',      startIso3: 'NGA', endLat: 11.8, endLng: 13.1, arc_type: 'state-vs-nonstate',
    keywords: ['nigeria','boko haram','iswap','maiduguri','bandits nigeria','zamfara','nigerian military'] },
  { conflict_name: 'Sahel Insurgency',        startIso3: 'MLI', endLat: 17.0, endLng: -2.0, arc_type: 'state-vs-nonstate',
    keywords: ['mali','bamako','sahel','jnim','dnf','wagner mali','mali attack'] },
  { conflict_name: 'Burkina Faso Jihadist',   startIso3: 'BFA', endLat: 12.4, endLng: -1.5, arc_type: 'state-vs-nonstate',
    keywords: ['burkina faso','ouagadougou','jnim burkina','aqim','burkina attack','jihadist burkina'] },
  { conflict_name: 'Niger Instability',       startIso3: 'NER', endLat: 13.5, endLng: 2.1,  arc_type: 'state-vs-nonstate',
    keywords: ['niger','niamey','cnsp','junta niger','niger attack','jihadist niger'] },
  { conflict_name: 'Cameroon Anglophone',     startIso3: 'CMR', endLat: 5.9,  endLng: 10.3, arc_type: 'state-vs-nonstate',
    keywords: ['cameroon','anglophone','ambazonia','bamenda','cameroon conflict'] },
  { conflict_name: 'Mozambique Cabo Delgado', startIso3: 'MOZ', endLat: -13.3,endLng: 35.2, arc_type: 'state-vs-nonstate',
    keywords: ['mozambique','cabo delgado','ansar al-sunna','maputo insurgency','mozambique attack'] },
  { conflict_name: 'CAR Civil War',           startIso3: 'CAF', endLat: 7.0,  endLng: 21.0, arc_type: 'state-vs-nonstate',
    keywords: ['central african republic','car bangui','wagner car','faca','seleka','anti-balaka'] },
  { conflict_name: 'Chad Insurgency',         startIso3: 'TCD', endLat: 15.4, endLng: 18.7, arc_type: 'state-vs-nonstate',
    keywords: ['chad','ndjamena','boko haram chad','chad attack','chadian forces'] },
  { conflict_name: 'South Sudan Conflict',    startIso3: 'SSD', endLat: 6.9,  endLng: 31.3, arc_type: 'state-vs-nonstate',
    keywords: ['south sudan','juba','splm','south sudan fighting','south sudan militia'] },
  { conflict_name: 'Libya Factions',          startIso3: 'LBY', endLat: 32.9, endLng: 13.2, arc_type: 'state-vs-nonstate',
    keywords: ['libya','tripoli','haftar','gnu','cyrenaica','libyan forces','lna libya'] },
  { conflict_name: 'Senegal Unrest',          startIso3: 'SEN', endLat: 14.7, endLng: -17.4,arc_type: 'state-vs-nonstate',
    keywords: ['senegal unrest','dakar protest','senegal opposition','ousmane sonko'] },
  { conflict_name: 'Tanzania Insurgency',     startIso3: 'TZA', endLat: -10.5,endLng: 40.4, arc_type: 'state-vs-nonstate',
    keywords: ['tanzania insurgency','mtwara','tanzanian forces','mozambique border attack'] },

  // ── Asia ──────────────────────────────────────────────────────────────────────
  { conflict_name: 'Myanmar Civil War',       startIso3: 'MMR', endLat: 19.7, endLng: 96.1, arc_type: 'state-vs-nonstate',
    keywords: ['myanmar','tatmadaw','yangon','mandalay','shan state','karen','kachin','pdf myanmar','junta myanmar'] },
  { conflict_name: 'Afghanistan Crisis',      startIso3: 'AFG', endLat: 33.9, endLng: 67.7, arc_type: 'state-vs-nonstate',
    keywords: ['afghanistan','kabul','taliban','kandahar','helmand','isis afghanistan','afghan attack'] },
  { conflict_name: 'Pakistan TTP',            startIso3: 'PAK', endLat: 33.7, endLng: 73.1, arc_type: 'state-vs-nonstate',
    keywords: ['pakistan','ttp','peshawar','balochistan','khyber','pakistan attack','isi pakistan','pakistan military'] },
  { conflict_name: 'India-Pakistan LoC',      startIso3: 'IND', endIso3: 'PAK', arc_type: 'state-vs-state',
    keywords: ['kashmir','line of control','india pakistan border','loc ceasefire','loc firing','kashmir militant'] },
  { conflict_name: 'India-China Border',      startIso3: 'CHN', endIso3: 'IND', arc_type: 'state-vs-state',
    keywords: ['india china border','galwan','arunachal','aksai chin','lac china india','ladakh standoff'] },
  { conflict_name: 'Taiwan Strait',           startIso3: 'CHN', endIso3: 'TWN', arc_type: 'state-vs-state',
    keywords: ['taiwan','taipei','pla drills','taiwan strait','china taiwan','tsmc military','taiwan invasion'] },
  { conflict_name: 'South China Sea',         startIso3: 'CHN', endLat: 12.0, endLng: 115.0,arc_type: 'state-vs-nonstate',
    keywords: ['south china sea','spratly','scarborough','philippine sea','china coast guard','scs dispute'] },
  { conflict_name: 'North Korea Tensions',    startIso3: 'PRK', endIso3: 'KOR', arc_type: 'state-vs-state',
    keywords: ['north korea','pyongyang','kim jong','dprk','north korean missile','ballistic missile korea'] },
  { conflict_name: 'DPRK-US Standoff',        startIso3: 'PRK', endIso3: 'USA', arc_type: 'state-vs-state',
    keywords: ['north korea us','dprk nuclear','kim trump','dprk icbm','north korea washington'] },
  { conflict_name: 'Philippines Insurgency',  startIso3: 'PHL', endLat: 7.2,  endLng: 124.2,arc_type: 'state-vs-nonstate',
    keywords: ['philippines insurgency','mindanao','abu sayyaf','bangsamoro','npa philippines'] },
  { conflict_name: 'India Maoist Conflict',   startIso3: 'IND', endLat: 20.3, endLng: 81.9, arc_type: 'state-vs-nonstate',
    keywords: ['naxal','maoist india','chhattisgarh','india maoist','crpf naxal'] },
  { conflict_name: 'Bangladesh Unrest',       startIso3: 'BGD', endLat: 23.7, endLng: 90.4, arc_type: 'state-vs-nonstate',
    keywords: ['bangladesh','dhaka protest','hasina','bangladesh unrest','bangladesh opposition'] },

  // ── Americas ──────────────────────────────────────────────────────────────────
  { conflict_name: 'Colombia ELN',            startIso3: 'COL', endLat: 4.7,  endLng: -74.1,arc_type: 'state-vs-nonstate',
    keywords: ['colombia','eln','farc','bogota','cali','medellin','colombian military','disidencias'] },
  { conflict_name: 'Haiti Gang Crisis',       startIso3: 'HTI', endLat: 18.9, endLng: -72.3,arc_type: 'state-vs-nonstate',
    keywords: ['haiti','port-au-prince','haitian gang','viv ansanm','ariel henry','gang haiti','mss haiti'] },
  { conflict_name: 'Mexico Cartel War',       startIso3: 'MEX', endLat: 25.8, endLng:-108.9,arc_type: 'state-vs-nonstate',
    keywords: ['mexico cartel','sinaloa','jalisco','cjng','narco','culiacan','cartel violence'] },
  { conflict_name: 'Ecuador Crime Crisis',    startIso3: 'ECU', endLat: -0.2, endLng: -78.5,arc_type: 'state-vs-nonstate',
    keywords: ['ecuador','quito','guayaquil gang','ecuador prison','los lobos','ecuadorian cartel'] },
  { conflict_name: 'Venezuela Unrest',        startIso3: 'VEN', endLat: 10.5, endLng: -66.9,arc_type: 'state-vs-nonstate',
    keywords: ['venezuela','maduro','caracas','venezuela opposition','venezuela protest','tren de aragua'] },

  // ── Global flashpoints ─────────────────────────────────────────────────────────
  { conflict_name: 'Russia-NATO Tensions',    startIso3: 'RUS', endIso3: 'USA', arc_type: 'state-vs-state',
    keywords: ['russia nato','nato russia','russian threat','moscow nato','russian military nato','article 5'] },
  { conflict_name: 'Iran Nuclear Standoff',   startIso3: 'IRN', endIso3: 'USA', arc_type: 'state-vs-state',
    keywords: ['iran nuclear','jcpoa','iran enrichment','iran sanctions','iran deal','iran bomb'] },
];

// ─── Country map (from DB, cached in memory) ─────────────────────────────────
let _countryMap = null;
async function getCountryMap(pool) {
  if (_countryMap) return _countryMap;
  const { rows } = await pool.query(
    'SELECT iso3, latitude, longitude FROM countries WHERE latitude IS NOT NULL'
  );
  _countryMap = {};
  rows.forEach(c => { _countryMap[c.iso3] = c; });
  return _countryMap;
}

// ─── Build a Set of "active" conflict names from GDELT article text ───────────
function buildActiveSet(articles) {
  const allText = articles
    .map(a => ((a.title ?? '') + ' ' + (a.url ?? '')).toLowerCase())
    .join(' ');

  const activeNames = new Set();
  KNOWN_CONFLICTS.forEach(c => {
    const hit = c.keywords.some(kw => allText.includes(kw));
    if (hit) activeNames.add(c.conflict_name);
  });
  return activeNames;
}

// ─── Shape curated conflicts into arcs, removing inactive ones if configured ──
function buildCuratedArcs(countryMap, activeSet) {
  const arcs = [];

  KNOWN_CONFLICTS.forEach(c => {
    const a1 = countryMap[c.startIso3];
    if (!a1) return;

    const startLat = parseFloat(a1.latitude);
    const startLng = parseFloat(a1.longitude);
    if (isNaN(startLat) || isNaN(startLng)) return;

    let endLat = c.endLat;
    let endLng = c.endLng;

    if (c.arc_type === 'state-vs-state' && c.endIso3) {
      const a2 = countryMap[c.endIso3];
      if (!a2) return;
      endLat = parseFloat(a2.latitude);
      endLng = parseFloat(a2.longitude);
    }

    if (endLat == null || endLng == null || isNaN(endLat) || isNaN(endLng)) return;

    const is_active = activeSet.size === 0
      ? true  // GDELT unavailable — default everything active
      : activeSet.has(c.conflict_name);

    // ── AUTOMATIC REMOVAL ──
    if (REMOVE_INACTIVE && !is_active) {
      return; 
    }

    arcs.push({
      startLat,
      startLng,
      endLat,
      endLng,
      conflict_name:   c.conflict_name,
      is_active,
      arc_type:        c.arc_type,
      intensity_level: c.arc_type === 'state-vs-state' ? 2 : 1,
      source:          'curated',
    });
  });

  return arcs;
}

// ─── GET /api/conflicts/live ──────────────────────────────────────────────────
const getLiveConflicts = async (req, res, next) => {
  try {
    const CACHE_KEY = 'gdelt:live:v6';
    const cached    = cache.get(CACHE_KEY);
    if (cached) {
      console.log(`[gdelt:live] cache hit — ${cached.length} active arcs returned`);
      return res.json({ source: 'cache', count: cached.length, arcs: cached });
    }

    const pool       = require('../db/connection');
    const countryMap = await getCountryMap(pool);

    // ── 1. Fetch GDELT articles for Curated Activity Detection ────────────────
    let articles  = [];
    let gdeltOk   = false;
    try {
      const query = encodeURIComponent(
        '(war OR airstrike OR missile strike OR troops killed OR military offensive OR rebel attack OR insurgent OR drone strike OR ceasefire violation OR shelling OR bombardment) sourcelang:eng'
      );
      const url  = `${GDELT_DOC}?query=${query}&mode=artlist&maxrecords=250&format=json&sort=DateDesc`;
      const resp = await axios.get(url, { timeout: 12000, headers: { Accept: 'application/json' } });

      if (resp.data?.articles && Array.isArray(resp.data.articles)) {
        articles = resp.data.articles;
        gdeltOk  = true;
        console.log(`[gdelt:live] fetched ${articles.length} articles from GDELT DOC`);
      }
    } catch (err) {
      console.warn('[gdelt:live] GDELT DOC fetch failed:', err.message);
    }

    const activeSet = gdeltOk ? buildActiveSet(articles) : new Set();
    
    // Build curated arcs, automatically skipping inactive ones
    const curatedArcs = buildCuratedArcs(countryMap, activeSet);
    console.log(`[gdelt:live] ${curatedArcs.length} curated conflicts are currently active`);

    // ── 2. Fetch Automatically Discovered Events ──────────────────────────────
    let dynamicArcs = [];
    try {
        dynamicArcs = await fetchDynamicGdeltEvents();
    } catch (err) {
        console.warn('[gdelt:live] Failed to fetch dynamic GDELT events:', err.message);
    }

    // ── 3. Merge Curated and Dynamic Arcs ─────────────────────────────────────
    // Prevent the dynamic parser from adding a conflict we already carefully curated
    const curatedNames = new Set(curatedArcs.map(a => a.conflict_name));
    const uniqueDynamicArcs = dynamicArcs.filter(
        da => !curatedNames.has(da.conflict_name)
    );

    const finalArcs = [...curatedArcs, ...uniqueDynamicArcs];
    console.log(`[gdelt:live] Total arcs sent to frontend: ${finalArcs.length} (${uniqueDynamicArcs.length} dynamically discovered)`);

    cache.set(CACHE_KEY, finalArcs);
    res.json({ source: 'live', count: finalArcs.length, arcs: finalArcs });

  } catch (err) {
    next(err);
  }
};

module.exports = { getLiveConflicts };
// backend/controllers/incidentController.js
// Fetches geo-tagged incidents from GDELT GEO API
// Returns individual events with coordinates for 2D map display

const axios     = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 900, checkperiod: 60 });

const GDELT_GEO = 'https://api.gdeltproject.org/api/v2/geo/geo';
const GDELT_DOC = 'https://api.gdeltproject.org/api/v2/doc/doc';

// ─── CAMEO event code → incident type mapping ─────────────────────────────────
// GDELT uses CAMEO codes. We map them to our 5 incident types.
const CAMEO_MAP = {
  // Battles / armed clashes
  '190': 'battle', '191': 'battle', '192': 'battle', '193': 'battle', '194': 'battle', '195': 'battle',
  '180': 'battle', '181': 'battle', '182': 'battle', '183': 'battle',
  // Explosions / remote violence
  '196': 'explosion', '197': 'explosion', '198': 'explosion', '199': 'explosion',
  // Protests / riots
  '140': 'protest', '141': 'protest', '142': 'protest', '143': 'protest', '144': 'protest',
  '145': 'protest', '150': 'protest', '151': 'protest', '152': 'protest',
  // Violence against civilians
  '200': 'civilian', '201': 'civilian', '202': 'civilian', '203': 'civilian', '204': 'civilian',
  '170': 'civilian', '171': 'civilian', '172': 'civilian', '173': 'civilian', '174': 'civilian', '175': 'civilian',
  // Strategic developments
  '010': 'strategic', '011': 'strategic', '012': 'strategic', '013': 'strategic',
  '030': 'strategic', '031': 'strategic', '032': 'strategic',
  '040': 'strategic', '041': 'strategic', '042': 'strategic', '043': 'strategic',
};

// ─── Incident type config ─────────────────────────────────────────────────────
const INCIDENT_TYPES = {
  battle:    { label: 'Battle / Armed Clash',       color: '#ff3b3b', icon: '⚔️',  cameoMin: 180, cameoMax: 199 },
  explosion: { label: 'Explosion / Remote Violence', color: '#ff6b00', icon: '💥',  cameoMin: 196, cameoMax: 199 },
  protest:   { label: 'Protest / Riot',              color: '#ffaa00', icon: '✊',  cameoMin: 140, cameoMax: 155 },
  civilian:  { label: 'Violence vs Civilians',       color: '#c084fc', icon: '🎯',  cameoMin: 170, cameoMax: 204 },
  strategic: { label: 'Strategic Development',       color: '#00d4ff', icon: '📡',  cameoMin: 10,  cameoMax: 49  },
};

// ─── Keyword-based queries per incident type ──────────────────────────────────
const TYPE_QUERIES = {
  battle:    'airstrike OR "ground offensive" OR "troops killed" OR "military clash" OR "armed attack" OR shelling OR bombardment OR ambush',
  explosion: '"drone strike" OR "missile strike" OR "car bomb" OR explosion OR "IED attack" OR "suicide bomb"',
  protest:   'protest OR riot OR demonstration OR "civil unrest" OR clashes OR "tear gas" OR "rubber bullets"',
  civilian:  '"civilians killed" OR massacre OR atrocity OR "civilian casualties" OR "population displacement" OR "ethnic violence"',
  strategic: '"ceasefire" OR "peace talks" OR "military buildup" OR "troops deployed" OR "weapons shipment" OR "sanctions imposed"',
};

// ─── Fetch geo-tagged articles for one incident type ─────────────────────────
async function fetchTypeIncidents(type, query) {
  try {
    const encoded = encodeURIComponent(`(${query}) sourcelang:eng`);
    const url = `${GDELT_DOC}?query=${encoded}&mode=artlist&maxrecords=50&format=json&sort=DateDesc`;
    const resp = await axios.get(url, {
      timeout: 10000,
      headers: { Accept: 'application/json' },
    });

    if (!resp.data?.articles) return [];

    const articles = resp.data.articles;
    console.log(`[incidents:${type}] got ${articles.length} articles from GDELT`);
    if (articles.length > 0) {
      // Log sample to debug field names
      const sample = articles[0];
      console.log(`[incidents:${type}] sample fields:`, Object.keys(sample).join(', '));
      console.log(`[incidents:${type}] sample title:`, sample.title?.slice(0,80));
      console.log(`[incidents:${type}] sample sourcecountry:`, sample.sourcecountry);
    }

    const typeConfig = INCIDENT_TYPES[type];
    const incidents  = [];

    articles.forEach((art, idx) => {
      // Use all available text fields for location matching
      const text = [
        art.title        ?? '',
        art.url          ?? '',
        art.sourcecountry ?? '',
        art.domain       ?? '',
        art.socialimage  ?? '',
      ].join(' ').toLowerCase();

      // First try location from article text
      let loc = extractLocation(text);

      // Fallback: use sourcecountry field directly
      if (!loc && art.sourcecountry) {
        loc = countryCodeToCoords(art.sourcecountry);
      }

      if (!loc) return;

      incidents.push({
        id:        `${type}-${Date.now()}-${idx}`,
        type,
        label:     typeConfig.label,
        color:     typeConfig.color,
        icon:      typeConfig.icon,
        title:     art.title ?? 'Incident reported',
        url:       art.seendate ? art.url : (art.url ?? null),
        source:    art.domain  ?? 'Unknown',
        date:      art.seendate ?? null,
        lat:       loc.lat,
        lng:       loc.lng,
        country:   loc.country,
        region:    loc.region,
        intensity: estimateIntensity(text),
      });
    });

    return incidents;
  } catch (err) {
    console.warn(`[incidents] fetch failed for type ${type}:`, err.message);
    return [];
  }
}

// ─── Estimate intensity 1-3 from article text ─────────────────────────────────
function estimateIntensity(text) {
  const highWords = ['massacre','dozens killed','hundreds killed','major offensive','heavy casualties','destroyed'];
  const midWords  = ['killed','wounded','attack','strike','clash','explosion','arrested'];
  if (highWords.some(w => text.includes(w))) return 3;
  if (midWords.some(w => text.includes(w)))  return 2;
  return 1;
}

// ─── GDELT sourcecountry code → coords fallback ───────────────────────────────
const COUNTRY_CODE_MAP = {
  'UA': { country:'Ukraine',      region:'Europe',       lat:48.38, lng:31.17 },
  'IL': { country:'Israel',       region:'Middle East',  lat:31.05, lng:34.85 },
  'PS': { country:'Palestine',    region:'Middle East',  lat:31.90, lng:35.20 },
  'SY': { country:'Syria',        region:'Middle East',  lat:34.80, lng:38.99 },
  'IQ': { country:'Iraq',         region:'Middle East',  lat:33.22, lng:43.68 },
  'IR': { country:'Iran',         region:'Middle East',  lat:32.43, lng:53.69 },
  'YE': { country:'Yemen',        region:'Middle East',  lat:15.55, lng:48.52 },
  'LB': { country:'Lebanon',      region:'Middle East',  lat:33.88, lng:35.50 },
  'SD': { country:'Sudan',        region:'Africa',       lat:15.55, lng:32.53 },
  'ET': { country:'Ethiopia',     region:'Africa',       lat:9.14,  lng:40.49 },
  'SO': { country:'Somalia',      region:'Africa',       lat:5.15,  lng:46.20 },
  'CD': { country:'DR Congo',     region:'Africa',       lat:-4.04, lng:21.76 },
  'NG': { country:'Nigeria',      region:'Africa',       lat:9.08,  lng:8.67  },
  'ML': { country:'Mali',         region:'Africa',       lat:17.57, lng:-3.99 },
  'BF': { country:'Burkina Faso', region:'Africa',       lat:12.36, lng:-1.53 },
  'NE': { country:'Niger',        region:'Africa',       lat:17.61, lng:8.08  },
  'LY': { country:'Libya',        region:'Africa',       lat:26.34, lng:17.23 },
  'MZ': { country:'Mozambique',   region:'Africa',       lat:-18.67,lng:35.53 },
  'MM': { country:'Myanmar',      region:'Asia',         lat:17.11, lng:96.96 },
  'AF': { country:'Afghanistan',  region:'Asia',         lat:33.94, lng:67.71 },
  'PK': { country:'Pakistan',     region:'Asia',         lat:30.38, lng:69.35 },
  'PH': { country:'Philippines',  region:'Asia',         lat:12.88, lng:121.77},
  'CO': { country:'Colombia',     region:'Americas',     lat:4.57,  lng:-74.30},
  'HT': { country:'Haiti',        region:'Americas',     lat:18.97, lng:-72.29},
  'MX': { country:'Mexico',       region:'Americas',     lat:23.63, lng:-102.55},
  'VE': { country:'Venezuela',    region:'Americas',     lat:6.42,  lng:-66.59},
  'RU': { country:'Russia',       region:'Europe',       lat:61.52, lng:105.32},
  'TR': { country:'Turkey',       region:'Europe',       lat:38.96, lng:35.24 },
  'BY': { country:'Belarus',      region:'Europe',       lat:53.71, lng:27.95 },
  'SS': { country:'South Sudan',  region:'Africa',       lat:6.88,  lng:31.31 },
  'CF': { country:'CAR',          region:'Africa',       lat:6.61,  lng:20.94 },
  'TD': { country:'Chad',         region:'Africa',       lat:15.45, lng:18.73 },
  'US': { country:'United States',region:'Americas',     lat:37.09, lng:-95.71},
  'CN': { country:'China',        region:'Asia',         lat:35.86, lng:104.20},
  'IN': { country:'India',        region:'Asia',         lat:20.59, lng:78.96 },
  'SA': { country:'Saudi Arabia', region:'Middle East',  lat:23.89, lng:45.08 },
};

function countryCodeToCoords(code) {
  if (!code) return null;
  const upper = code.toUpperCase().slice(0,2);
  const entry = COUNTRY_CODE_MAP[upper];
  if (!entry) return null;
  return {
    country: entry.country,
    region:  entry.region,
    lat:     entry.lat + (Math.random() - 0.5) * 1.5,
    lng:     entry.lng + (Math.random() - 0.5) * 1.5,
  };
}

// ─── Location keyword → lat/lng lookup ───────────────────────────────────────
const LOCATION_INDEX = [
  // Middle East
  { keys:['ukraine','kyiv','kharkiv','donetsk','zaporizhzhia','kherson','odesa','mariupol','bakhmut'], country:'Ukraine', region:'Europe', lat:48.38, lng:31.17 },
  { keys:['gaza','rafah','hamas','khan younis'], country:'Gaza Strip', region:'Middle East', lat:31.35, lng:34.31 },
  { keys:['west bank','jenin','ramallah','nablus','hebron'], country:'West Bank', region:'Middle East', lat:31.90, lng:35.20 },
  { keys:['israel','tel aviv','jerusalem','idf','israeli'], country:'Israel', region:'Middle East', lat:31.05, lng:34.85 },
  { keys:['lebanon','beirut','hezbollah','southern lebanon'], country:'Lebanon', region:'Middle East', lat:33.88, lng:35.50 },
  { keys:['syria','damascus','aleppo','idlib','deir ez-zor','raqqa'], country:'Syria', region:'Middle East', lat:34.80, lng:38.99 },
  { keys:['iran','tehran','isfahan','irgc','persian'], country:'Iran', region:'Middle East', lat:32.43, lng:53.69 },
  { keys:['iraq','baghdad','mosul','erbil','basra','kirkuk'], country:'Iraq', region:'Middle East', lat:33.22, lng:43.68 },
  { keys:['yemen','sanaa','aden','houthi','hodeidah','marib'], country:'Yemen', region:'Middle East', lat:15.55, lng:48.52 },
  { keys:['saudi','riyadh','jeddah','aramco'], country:'Saudi Arabia', region:'Middle East', lat:23.89, lng:45.08 },
  { keys:['red sea','bab el-mandeb','gulf of aden','shipping lane'], country:'Red Sea', region:'Middle East', lat:14.50, lng:42.50 },
  { keys:['turkey','ankara','istanbul','pkk','turkish','erdogan'], country:'Turkey', region:'Europe', lat:38.96, lng:35.24 },
  // Europe
  { keys:['russia','moscow','kremlin','russian','putin'], country:'Russia', region:'Europe', lat:61.52, lng:105.32 },
  { keys:['belarus','minsk','lukashenko'], country:'Belarus', region:'Europe', lat:53.71, lng:27.95 },
  { keys:['kosovo','pristina','nato balkans'], country:'Kosovo', region:'Europe', lat:42.60, lng:20.90 },
  { keys:['armenia','yerevan','armenian'], country:'Armenia', region:'Europe', lat:40.07, lng:45.04 },
  { keys:['azerbaijan','baku','azerbaijani'], country:'Azerbaijan', region:'Europe', lat:40.14, lng:47.58 },
  { keys:['georgia','tbilisi','georgian','south ossetia'], country:'Georgia', region:'Europe', lat:42.32, lng:43.36 },
  // Africa
  { keys:['sudan','khartoum','rsf','darfur','omdurman'], country:'Sudan', region:'Africa', lat:15.55, lng:32.53 },
  { keys:['ethiopia','addis ababa','tigray','amhara','oromo'], country:'Ethiopia', region:'Africa', lat:9.14, lng:40.49 },
  { keys:['somalia','mogadishu','al-shabaab','puntland'], country:'Somalia', region:'Africa', lat:5.15, lng:46.20 },
  { keys:['congo','drc','goma','kivu','kinshasa','m23'], country:'DR Congo', region:'Africa', lat:-4.04, lng:21.76 },
  { keys:['nigeria','abuja','lagos','boko haram','iswap'], country:'Nigeria', region:'Africa', lat:9.08, lng:8.67 },
  { keys:['mali','bamako','sahel','wagner mali'], country:'Mali', region:'Africa', lat:17.57, lng:-3.99 },
  { keys:['burkina faso','ouagadougou','burkina'], country:'Burkina Faso', region:'Africa', lat:12.36, lng:-1.53 },
  { keys:['niger','niamey','junta niger'], country:'Niger', region:'Africa', lat:17.61, lng:8.08 },
  { keys:['libya','tripoli','haftar','benghazi'], country:'Libya', region:'Africa', lat:26.34, lng:17.23 },
  { keys:['mozambique','cabo delgado','maputo'], country:'Mozambique', region:'Africa', lat:-18.67, lng:35.53 },
  { keys:['central african republic','bangui','car seleka'], country:'CAR', region:'Africa', lat:6.61, lng:20.94 },
  { keys:['south sudan','juba'], country:'South Sudan', region:'Africa', lat:6.88, lng:31.31 },
  { keys:['cameroon','anglophone','bamenda'], country:'Cameroon', region:'Africa', lat:7.37, lng:12.35 },
  { keys:['chad','ndjamena'], country:'Chad', region:'Africa', lat:15.45, lng:18.73 },
  // Asia
  { keys:['myanmar','tatmadaw','yangon','mandalay','karen','kachin','shan'], country:'Myanmar', region:'Asia', lat:17.11, lng:96.96 },
  { keys:['afghanistan','kabul','taliban','kandahar','helmand'], country:'Afghanistan', region:'Asia', lat:33.94, lng:67.71 },
  { keys:['pakistan','islamabad','peshawar','ttp','balochistan','karachi'], country:'Pakistan', region:'Asia', lat:30.38, lng:69.35 },
  { keys:['kashmir','line of control','loc india pakistan'], country:'Kashmir', region:'Asia', lat:34.08, lng:74.80 },
  { keys:['taiwan','taipei','strait','pla drills'], country:'Taiwan', region:'Asia', lat:23.70, lng:120.96 },
  { keys:['south china sea','spratly','scarborough shoal'], country:'South China Sea', region:'Asia', lat:12.0, lng:115.0 },
  { keys:['north korea','pyongyang','kim jong','dprk'], country:'North Korea', region:'Asia', lat:40.34, lng:127.51 },
  { keys:['philippines','manila','mindanao','abu sayyaf'], country:'Philippines', region:'Asia', lat:12.88, lng:121.77 },
  { keys:['bangladesh','dhaka'], country:'Bangladesh', region:'Asia', lat:23.68, lng:90.36 },
  // Americas
  { keys:['colombia','bogota','medellin','eln','farc'], country:'Colombia', region:'Americas', lat:4.57, lng:-74.30 },
  { keys:['haiti','port-au-prince','haitian gang'], country:'Haiti', region:'Americas', lat:18.97, lng:-72.29 },
  { keys:['mexico','cartel','sinaloa','jalisco','culiacan','narco'], country:'Mexico', region:'Americas', lat:23.63, lng:-102.55 },
  { keys:['venezuela','caracas','maduro'], country:'Venezuela', region:'Americas', lat:6.42, lng:-66.59 },
  { keys:['ecuador','quito','guayaquil'], country:'Ecuador', region:'Americas', lat:-1.83, lng:-78.18 },
];

function extractLocation(text) {
  for (const loc of LOCATION_INDEX) {
    if (loc.keys.some(k => text.includes(k))) {
      // Add small random jitter so dots don't overlap perfectly
      return {
        country: loc.country,
        region:  loc.region,
        lat:     loc.lat + (Math.random() - 0.5) * 2.5,
        lng:     loc.lng + (Math.random() - 0.5) * 2.5,
      };
    }
  }
  return null;
}

// ─── GET /api/incidents/live ──────────────────────────────────────────────────
const getLiveIncidents = async (req, res, next) => {
  try {
    const CACHE_KEY = 'incidents:live:v5';
    const forceRefresh = req.query.refresh === 'true';
    const cached    = cache.get(CACHE_KEY);
    if (cached && Array.isArray(cached) && cached.length > 0 && !forceRefresh) {
      console.log(`[incidents] cache hit — ${cached.length} incidents`);
      return res.json({ source: 'cache', count: cached.length, incidents: cached, updatedAt: cache.get('incidents:ts') });
    }

    console.log('[incidents] fetching fresh data from GDELT...');

    // Fetch all 5 types in parallel
    const results = await Promise.allSettled(
      Object.entries(TYPE_QUERIES).map(([type, query]) => fetchTypeIncidents(type, query))
    );

    const allIncidents = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value);

    // Deduplicate by proximity (merge dots within ~1 degree)
    const deduped = deduplicateByProximity(allIncidents);

    // If GDELT returned nothing, use fallback hotspot data
    if (deduped.length === 0) {
      console.log("[incidents] GDELT returned 0 matches — using fallback hotspot data");
      const fallback = buildFallbackIncidents();
      cache.set(CACHE_KEY, fallback, 300); // cache fallback for 5 min only
      cache.set("incidents:ts", new Date().toISOString());
      return res.json({ source: "fallback", count: fallback.length, incidents: fallback, updatedAt: new Date().toISOString() });
    }

    // Sort by date desc
    deduped.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    });

    const ts = new Date().toISOString();
    cache.set(CACHE_KEY, deduped);
    cache.set('incidents:ts', ts);

    console.log(`[incidents] returning ${deduped.length} incidents`);
    res.json({ source: 'live', count: deduped.length, incidents: deduped, updatedAt: ts });

  } catch (err) {
    next(err);
  }
};

// ─── Deduplicate: merge incidents within ~1.5 degree radius ──────────────────
function deduplicateByProximity(incidents) {
  const result = [];
  const used   = new Set();

  incidents.forEach((inc, i) => {
    if (used.has(i)) return;
    // Check for nearby same-type incident
    const nearby = incidents.findIndex((other, j) =>
      j !== i && !used.has(j) &&
      other.type === inc.type &&
      Math.abs(other.lat - inc.lat) < 1.5 &&
      Math.abs(other.lng - inc.lng) < 1.5
    );
    if (nearby !== -1) used.add(nearby);
    result.push(inc);
  });

  return result;
}

module.exports = { getLiveIncidents };

// ─── Fallback seed incidents from known hotspots ──────────────────────────────
// Used when GDELT returns nothing — gives the map something to show
function buildFallbackIncidents() {
  const HOTSPOTS = [
    { type:'battle',    title:'Active fighting reported — Ukraine front lines',    country:'Ukraine',      region:'Europe',      lat:48.5,  lng:31.2  },
    { type:'battle',    title:'Military operations ongoing — Gaza Strip',           country:'Gaza',         region:'Middle East', lat:31.4,  lng:34.4  },
    { type:'explosion', title:'Drone/missile activity reported — Red Sea',          country:'Red Sea',      region:'Middle East', lat:14.5,  lng:42.5  },
    { type:'battle',    title:'Armed clashes reported — Sudan (SAF vs RSF)',        country:'Sudan',        region:'Africa',      lat:15.6,  lng:32.5  },
    { type:'battle',    title:'Ongoing insurgency activity — Myanmar',              country:'Myanmar',      region:'Asia',        lat:19.0,  lng:96.5  },
    { type:'battle',    title:'Al-Shabaab operations reported — Somalia',           country:'Somalia',      region:'Africa',      lat:5.2,   lng:46.2  },
    { type:'civilian',  title:'Humanitarian crisis continuing — DR Congo east',     country:'DR Congo',     region:'Africa',      lat:-1.7,  lng:29.3  },
    { type:'battle',    title:'Taliban / ISIS-K activity — Afghanistan',            country:'Afghanistan',  region:'Asia',        lat:34.0,  lng:67.7  },
    { type:'battle',    title:'TTP attacks reported — Pakistan northwest',          country:'Pakistan',     region:'Asia',        lat:33.8,  lng:70.5  },
    { type:'protest',   title:'Civil unrest reported — Haiti',                      country:'Haiti',        region:'Americas',    lat:18.9,  lng:-72.3 },
    { type:'battle',    title:'ELN activity reported — Colombia',                   country:'Colombia',     region:'Americas',    lat:4.6,   lng:-74.1 },
    { type:'battle',    title:'Jihadist attacks reported — Burkina Faso',           country:'Burkina Faso', region:'Africa',      lat:12.4,  lng:-1.5  },
    { type:'battle',    title:'JNIM operations reported — Mali',                    country:'Mali',         region:'Africa',      lat:17.6,  lng:-4.0  },
    { type:'explosion', title:'Missile exchange reported — Israel/Lebanon border',  country:'Lebanon',      region:'Middle East', lat:33.5,  lng:35.5  },
    { type:'strategic', title:'Military exercises ongoing — Taiwan Strait',         country:'Taiwan Strait',region:'Asia',        lat:24.0,  lng:120.5 },
    { type:'battle',    title:'M23 rebel activity — eastern DRC',                   country:'DR Congo',     region:'Africa',      lat:-1.5,  lng:29.0  },
    { type:'battle',    title:'Houthi operations — Yemen',                          country:'Yemen',        region:'Middle East', lat:15.2,  lng:44.2  },
    { type:'protest',   title:'Anti-government protests reported — Venezuela',      country:'Venezuela',    region:'Americas',    lat:10.5,  lng:-66.9 },
    { type:'battle',    title:'PKK clashes — southeastern Turkey',                  country:'Turkey',       region:'Europe',      lat:37.9,  lng:40.5  },
    { type:'strategic', title:'Sanctions pressure escalating — Iran',               country:'Iran',         region:'Middle East', lat:32.4,  lng:53.7  },
  ];

  const now = new Date().toISOString();
  return HOTSPOTS.map((h, i) => ({
    id:        `fallback-${i}`,
    type:      h.type,
    label:     INCIDENT_TYPES[h.type]?.label ?? h.type,
    color:     INCIDENT_TYPES[h.type]?.color ?? '#888',
    icon:      INCIDENT_TYPES[h.type]?.icon  ?? '📍',
    title:     h.title,
    url:       null,
    source:    'WarScope Intelligence',
    date:      now,
    lat:       h.lat + (Math.random() - 0.5) * 1.0,
    lng:       h.lng + (Math.random() - 0.5) * 1.0,
    country:   h.country,
    region:    h.region,
    intensity: 2,
    isFallback: true,
  }));
}
// backend/services/warImpactService.js
'use strict';

const https = require('https');
const http  = require('http');

// FIX: Version 3.x of yahoo-finance2 requires instantiation
const YahooFinance = require('yahoo-finance2').default; 
const yahooFinance = new YahooFinance();

// ── Curated conflicts ─────────────────────────────────────────────────────────
const CONFLICTS = [
  { id:'iran',     name:'US–Israel–Iran War',     countries:['IRN','ISR'],           region:'Middle East',     startYear:2026, startDate:'2026-02-28', commodityShocks:['oil','gas','copper'],           color:'#ff3b3b', flags:['ir','il','us'], description:'US and Israel launched major strikes on Feb 28, 2026. Khamenei killed on Day 1. Strait of Hormuz partially closed — Brent crude surged past $100/barrel. Iran striking Gulf states, Lebanon, and US bases across region.' },
  { id:'ukraine',  name:'Russia–Ukraine War',     countries:['UKR','RUS'],           region:'Eastern Europe',  startYear:2022, startDate:'2022-02-24', commodityShocks:['wheat','gas','fertilizer','corn'],  color:'#3b82f6', flags:['ua','ru'],  description:'Full-scale Russian invasion. Major disruption to wheat, sunflower oil, gas and fertilizer markets globally.' },
  { id:'gaza',     name:'Israel–Gaza War',         countries:['ISR','PSE'],           region:'Middle East',     startYear:2023, startDate:'2023-10-07', commodityShocks:['oil','gas'],                        color:'#f59e0b', flags:['il','ps'],  description:'Ongoing military conflict in Gaza. Ceasefire broken Oct 2025. Regional shipping disruption and humanitarian crisis.' },
  { id:'sudan',    name:'Sudan Civil War',         countries:['SDN'],                 region:'East Africa',     startYear:2023, startDate:'2023-04-15', commodityShocks:['wheat','corn'],                     color:'#ef4444', flags:['sd'],       description:'SAF vs RSF armed conflict. Largest active displacement crisis with 10M+ displaced.' },
  { id:'myanmar',  name:'Myanmar Civil War',       countries:['MMR'],                 region:'Southeast Asia',  startYear:2021, startDate:'2021-02-01', commodityShocks:['wheat','corn'],                     color:'#8b5cf6', flags:['mm'],       description:'Military coup and ongoing resistance conflict disrupting agriculture and manufacturing.' },
  { id:'yemen',    name:'Yemen Civil War',          countries:['YEM'],                 region:'Middle East',     startYear:2015, startDate:'2015-03-26', commodityShocks:['oil','gas'],                        color:'#10b981', flags:['ye'],       description:'Houthi Red Sea attacks raising global shipping costs by 15–20%.' },
  { id:'sahel',    name:'Sahel Insurgency',         countries:['MLI','BFA','NER'],     region:'West Africa',     startYear:2012, startDate:'2012-01-01', commodityShocks:['wheat','corn','fertilizer'],        color:'#f97316', flags:['ml','bf','ne'], description:'Islamist insurgency across Mali, Burkina Faso and Niger causing severe food insecurity.' },
  { id:'haiti',    name:'Haiti Gang Crisis',        countries:['HTI'],                 region:'Caribbean',       startYear:2021, startDate:'2021-07-07', commodityShocks:['wheat','corn'],                     color:'#06b6d4', flags:['ht'],       description:'State collapse and gang control. Complete economic and humanitarian breakdown.' },
  { id:'drc',      name:'DRC Eastern Conflict',     countries:['COD'],                 region:'Central Africa',  startYear:2022, startDate:'2022-03-01', commodityShocks:['fertilizer'],                      color:'#84cc16', flags:['cd'],       description:'M23 and armed groups controlling mineral-rich eastern DRC. Cobalt/coltan supply disruption.' },
];

const EXPOSURE = {
  iran:    { high:['SAU','ARE','KWT','QAT','BHR','OMN','IRQ','JOR','LBN','SYR','PAK','IND','CHN','JPN','KOR','DEU','ITA','GRC','TUR','EGY'], med:['GBR','FRA','ESP','NLD','BEL','AUS','THA','SGP','MYS','IDN','NGA','ZAF','MAR','TUN'], reason:'Strait of Hormuz closure — 20% of world oil supply disrupted. Oil, LNG, fertilizer shipments halted. Global energy crisis.' },
  ukraine: { high:['EGY','LBN','TUN','TUR','PAK','BGD','IDN','ETH','YEM','LBY','IRQ','JOR','MRT','SOM','GEO','ARM','MDA','BLR','KAZ','AZE'], med:['MAR','SDN','TZA','KEN','NGA','GHA','SEN','CMR','CIV','NER','MLI','BFA'] },
  gaza:    { high:['JOR','LBN','EGY','TUR','SAU','ARE','QAT','KWT','BHR','OMN','SYR','IRQ'],                                                   med:['MAR','TUN','LBY','IDN','MYS','BGD','PAK'] },
  sudan:   { high:['EGY','ETH','TCD','CAF','LBY','ERI','UGA','KEN'],                                                                           med:['SAU','ARE','QAT','JOR'] },
  myanmar: { high:['THA','BGD','IND','CHN','LAO','KHM','MYS','SGP'],                                                                           med:['VNM','IDN','PHL','AUS','JPN'] },
  yemen:   { high:['SAU','ARE','OMN','JOR','EGY','ETH','SOM','DJI'],                                                                           med:['IND','CHN','SGP','MYS','GBR','USA','DEU','FRA'] },
  sahel:   { high:['SEN','GIN','CIV','GHA','BEN','TGO','NGA','GNB','GMB','MRT'],                                                               med:['MAR','DZA','TUN','LBY','FRA','ESP'] },
  haiti:   { high:['DOM','USA','CAN','JAM','TTO','BHS'],                                                                                       med:['CUB','BLZ','GUY','SUR'] },
  drc:     { high:['RWA','BDI','UGA','TZA','ZMB','AGO','COG','CAF'],                                                                           med:['ZAF','KEN','MOZ','NAM','BWA'] },
};

const REFUGEES = {
  iran:    { total:3200000, internal:2800000, abroad:400000, hosts:[{iso3:'IRQ',name:'Iraq',count:180000},{iso3:'TUR',name:'Turkey',count:95000},{iso3:'ARE',name:'UAE',count:60000},{iso3:'DEU',name:'Germany',count:40000},{iso3:'GBR',name:'UK',count:25000}], costPerPerson:9000 },
  ukraine: { total:14200000, internal:3700000, abroad:6500000, hosts:[{iso3:'DEU',name:'Germany',count:1150000},{iso3:'POL',name:'Poland',count:960000},{iso3:'CZE',name:'Czech Rep.',count:370000},{iso3:'GBR',name:'UK',count:220000},{iso3:'ESP',name:'Spain',count:190000},{iso3:'ITA',name:'Italy',count:175000},{iso3:'AUT',name:'Austria',count:95000},{iso3:'FRA',name:'France',count:90000},{iso3:'ROU',name:'Romania',count:80000},{iso3:'BGR',name:'Bulgaria',count:70000}], costPerPerson:12000 },
  gaza:    { total:1900000,  internal:1900000, abroad:85000,   hosts:[{iso3:'EGY',name:'Egypt',count:50000},{iso3:'JOR',name:'Jordan',count:20000},{iso3:'TUR',name:'Turkey',count:8000}], costPerPerson:8000 },
  sudan:   { total:10800000, internal:8200000, abroad:2600000, hosts:[{iso3:'EGY',name:'Egypt',count:920000},{iso3:'TCD',name:'Chad',count:670000},{iso3:'ETH',name:'Ethiopia',count:450000},{iso3:'SSD',name:'South Sudan',count:320000},{iso3:'CAF',name:'C.A.R.',count:45000},{iso3:'LBY',name:'Libya',count:30000}], costPerPerson:3500 },
  myanmar: { total:3200000,  internal:2600000, abroad:1200000, hosts:[{iso3:'BGD',name:'Bangladesh',count:960000},{iso3:'THA',name:'Thailand',count:120000},{iso3:'IND',name:'India',count:40000},{iso3:'MYS',name:'Malaysia',count:35000}], costPerPerson:2000 },
  yemen:   { total:4500000,  internal:4100000, abroad:310000,  hosts:[{iso3:'OMN',name:'Oman',count:150000},{iso3:'ETH',name:'Ethiopia',count:80000},{iso3:'DJI',name:'Djibouti',count:35000},{iso3:'SOM',name:'Somalia',count:28000}], costPerPerson:2500 },
  sahel:   { total:6800000,  internal:5200000, abroad:1600000, hosts:[{iso3:'NGA',name:'Nigeria',count:420000},{iso3:'CIV',name:"Côte d'Ivoire",count:310000},{iso3:'GHA',name:'Ghana',count:95000},{iso3:'TGO',name:'Togo',count:55000},{iso3:'BEN',name:'Benin',count:50000}], costPerPerson:1500 },
  haiti:   { total:700000,   internal:580000,  abroad:280000,  hosts:[{iso3:'USA',name:'United States',count:180000},{iso3:'DOM',name:'Dom. Republic',count:60000},{iso3:'CAN',name:'Canada',count:25000}], costPerPerson:15000 },
  drc:     { total:7200000,  internal:6100000, abroad:1000000, hosts:[{iso3:'UGA',name:'Uganda',count:430000},{iso3:'RWA',name:'Rwanda',count:220000},{iso3:'TZA',name:'Tanzania',count:195000},{iso3:'BDI',name:'Burundi',count:80000},{iso3:'ZMB',name:'Zambia',count:70000}], costPerPerson:1800 },
};

function fetchJSON(url, timeout = 12000) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout }, (res) => {
      if (res.statusCode >= 400) { res.resume(); reject(new Error(`HTTP ${res.statusCode}`)); return; }
      if (res.statusCode >= 300 && res.headers.location) { resolve(fetchJSON(res.headers.location)); return; }
      const c = []; res.on('data', d => c.push(d));
      res.on('end', () => { try { resolve(JSON.parse(Buffer.concat(c).toString())); } catch(e) { reject(e); } });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

async function fetchWBSeries(iso3, indicator, mrv = 15) {
  const url = `https://api.worldbank.org/v2/country/${iso3}/indicator/${indicator}?format=json&mrv=${mrv}&per_page=50`;
  const data = await fetchJSON(url);
  if (!Array.isArray(data) || !data[1]) return [];
  return data[1].filter(r => r.value !== null).map(r => ({ year: parseInt(r.date), value: parseFloat(r.value) })).sort((a,b) => a.year - b.year);
}

async function fetchFX() {
  const d = await fetchJSON('https://open.er-api.com/v6/latest/USD');
  return d.rates ?? {};
}

const _cache = {};
const C = (key, ttl) => { const c = _cache[key]; return c && Date.now()-c.t < ttl ? c.d : null; };
const S = (key, d)   => { _cache[key] = { d, t: Date.now() }; return d; };
const TTL6  = 6  * 3600000;
const TTL24 = 24 * 3600000;

// ── REAL-TIME Commodity prices (Yahoo Finance) ──────────────────────────────────
let _commodityFetchPromise = null; 

async function getCommodities() {
  const cached = C('commodities', TTL6);
  if (cached) return cached;

  if (_commodityFetchPromise) {
    return { _status: 'fetching' };
  }

  _commodityFetchPromise = (async () => {
    console.log('[warImpact] Fetching LIVE commodity prices from Yahoo Finance...');
    const results = {};
    
    // Ticker symbols for global futures + multiplier (CBOT quotes Wheat/Corn in cents)
    const fetches = [
      ['oil',        'CL=F', 1],
      ['gas',        'NG=F', 1],
      ['wheat',      'ZW=F', 0.01], 
      ['corn',       'ZC=F', 0.01],
      ['fertilizer', 'HG=F', 1], // HG=F is Copper
    ];

    for (const [key, symbol, mult] of fetches) {
      try {
        // 1. Get historical monthly data for the chart background
        const historical = await yahooFinance.historical(symbol, {
          period1: '2015-01-01',
          period2: new Date(), // <-- FIX: Explicitly set the end date to right now
          interval: '1mo'
        });

        const byYear = {};
        historical.forEach(d => {
          const y = d.date.getFullYear();
          if (!byYear[y]) byYear[y] = [];
          if (d.close) byYear[y].push(d.close * mult);
        });

        const chartData = Object.entries(byYear).map(([y, vals]) => ({
          year: parseInt(y),
          value: Math.round((vals.reduce((a,b)=>a+b,0)/vals.length)*100)/100
        })).sort((a,b) => a.year - b.year);

        // 2. Get the ABSOLUTE LIVE price right now
        const quote = await yahooFinance.quote(symbol);
        const livePrice = Math.round((quote.regularMarketPrice * mult) * 100) / 100;
        const currentYear = new Date().getFullYear();

        // Overwrite the current year's averaged data with the live spike
        const currentYearIndex = chartData.findIndex(d => d.year === currentYear);
        if (currentYearIndex >= 0) {
           chartData[currentYearIndex].value = livePrice;
        } else {
           chartData.push({ year: currentYear, value: livePrice });
        }

        results[key] = chartData;
        console.log(`[warImpact] ${key} LIVE: $${livePrice}`);
      } catch (e) {
        console.log(`[warImpact] ${key} failed: ${e.message}`);
        results[key] = [];
      }
    }

    _commodityFetchPromise = null;
    const hasData = Object.values(results).some(arr => arr.length > 0);
    if (hasData) {
      return S('commodities', results);
    }
    return results; 
  })();

  return { _status: 'fetching' };
}

const WAR_CCY = { UKR:'UAH',RUS:'RUB',SYR:'SYP',YEM:'YER',SDN:'SDG',MMR:'MMK',HTI:'HTG',LBN:'LBP',IRN:'IRR',EGY:'EGP',PAK:'PKR',NGA:'NGN',ETH:'ETB',TUR:'TRY',ARG:'ARS' };
const BASELINE = { UAH:27.3,RUB:73.7,SYP:2512,YER:250,SDG:440,MMK:1785,HTG:90,LBP:1507,IRR:42000,EGP:15.7,PKR:177,NGN:411,ETB:44.2,TRY:13.4,ARS:95 };

async function getCurrencies() {
  const cached = C('currencies', TTL6);
  if (cached) return cached;
  console.log('[warImpact] Fetching exchange rates...');
  const rates = await fetchFX();
  const r = {};
  for (const [iso3, ccy] of Object.entries(WAR_CCY)) {
    const cur = rates[ccy], base = BASELINE[ccy];
    if (!cur || !base) continue;
    r[iso3] = { currency:ccy, current:Math.round(cur*100)/100, baseline:base, change:Math.round(((cur-base)/base)*1000)/10, worse: cur > base };
  }
  return S('currencies', r);
}

async function getEconData(conflictId) {
  const cached = C(`econ_${conflictId}`, TTL24);
  if (cached) return cached;
  const conflict = CONFLICTS.find(c => c.id === conflictId);
  if (!conflict) return null;
  console.log(`[warImpact] Fetching econ data for ${conflictId}...`);
  const r = {};
  for (const iso3 of conflict.countries) {
    const [growth, inf, gdp, unemp] = await Promise.allSettled([
      fetchWBSeries(iso3, 'NY.GDP.MKTP.KD.ZG', 12),
      fetchWBSeries(iso3, 'FP.CPI.TOTL.ZG',    12),
      fetchWBSeries(iso3, 'NY.GDP.MKTP.CD',     12),
      fetchWBSeries(iso3, 'SL.UEM.TOTL.ZS',     12),
    ]);
    r[iso3] = {
      growth:     growth.status  === 'fulfilled' ? growth.value  : [],
      inflation:  inf.status     === 'fulfilled' ? inf.value     : [],
      gdp:        gdp.status     === 'fulfilled' ? gdp.value     : [],
      unemployment: unemp.status === 'fulfilled' ? unemp.value   : [],
    };
  }
  return S(`econ_${conflictId}`, r);
}

function getConflicts() {
  return CONFLICTS.map(c => ({ ...c, exposure: EXPOSURE[c.id] ?? { high:[], med:[] }, refugees: REFUGEES[c.id] ?? null }));
}

async function getConflictDetail(id) {
  const conflict = CONFLICTS.find(c => c.id === id);
  if (!conflict) return null;
  const [commodities, currencies, econData] = await Promise.allSettled([
    getCommodities(), getCurrencies(), getEconData(id),
  ]);
  return {
    conflict: { ...conflict, exposure: EXPOSURE[id] ?? { high:[], med:[] }, refugees: REFUGEES[id] ?? null },
    commodities:  commodities.status  === 'fulfilled' ? commodities.value  : null,
    currencies:   currencies.status   === 'fulfilled' ? currencies.value   : null,
    econData:     econData.status     === 'fulfilled' ? econData.value     : null,
  };
}

function clearCache() {
  Object.keys(_cache).forEach(k => delete _cache[k]);
  console.log('[warImpact] Cache cleared');
}

module.exports = { getConflicts, getConflictDetail, getCommodities, getCurrencies, clearCache };
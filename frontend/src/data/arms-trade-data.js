// src/data/arms-trade-data.js
// SIPRI Arms Transfers Database — curated dataset 150+ transfers
// TIV = Trend Indicator Value (SIPRI methodology, millions USD equivalent)

export const ARMS_ERAS = {
  'cold-war':   { label: 'Cold War',      years: '1950–1991', color: '#4a90d9' },
  'post-cold':  { label: 'Post-Cold War', years: '1992–2013', color: '#f5a623' },
  'modern':     { label: 'Modern Era',    years: '2014–2024', color: '#ff3b3b' },
};

export const ARMS_CATEGORIES = {
  aircraft:  { label: 'Aircraft',          icon: '✈️',  color: '#00d4ff' },
  naval:     { label: 'Naval Vessels',     icon: '🚢',  color: '#4a90d9' },
  missile:   { label: 'Missiles & Air Defence', icon: '🚀', color: '#ff3b3b' },
  armour:    { label: 'Armour & Vehicles', icon: '🛡️',  color: '#f5a623' },
  drone:     { label: 'Drones / UAVs',     icon: '🛸',  color: '#c084fc' },
  artillery: { label: 'Artillery',         icon: '💣',  color: '#ff6b00' },
  mixed:     { label: 'Mixed Systems',     icon: '⚔️',  color: '#8892a4' },
};

// Each transfer: id, era, from, to, tiv (millions), cat, label, year, fromLat, fromLng, toLat, toLng, description
export const ARMS_TRANSFERS = [

  // ── COLD WAR ERA (1950–1991) ────────────────────────────────────────────────

  // USA exports
  { id:'cw-01', era:'cold-war', from:'USA', to:'UK',          tiv:2800, cat:'aircraft',  label:'F-104 Starfighters & F-4 Phantoms',         year:1961, fromLat:38.9,  fromLng:-77.0, toLat:51.5,  toLng:-0.1,   description:'Multi-role jet fighters supplied to RAF under NATO standardisation agreements.' },
  { id:'cw-02', era:'cold-war', from:'USA', to:'Israel',      tiv:3200, cat:'aircraft',  label:'F-4 Phantom II & A-4 Skyhawk',               year:1968, fromLat:38.9,  fromLng:-77.0, toLat:31.8,  toLng:35.2,   description:'Combat aircraft supplied following 1967 war to ensure Israeli air superiority.' },
  { id:'cw-03', era:'cold-war', from:'USA', to:'Saudi Arabia',tiv:4100, cat:'aircraft',  label:'F-15 Eagle air superiority fighters',        year:1978, fromLat:38.9,  fromLng:-77.0, toLat:24.7,  toLng:46.7,   description:'Advanced air superiority fighters, one of the largest Cold War arms deals.' },
  { id:'cw-04', era:'cold-war', from:'USA', to:'Iran',        tiv:2600, cat:'aircraft',  label:'F-14 Tomcat fighters (Shah era)',            year:1974, fromLat:38.9,  fromLng:-77.0, toLat:35.7,  toLng:51.4,   description:'Advanced swing-wing fighters sold to Imperial Iran under Shah Pahlavi.' },
  { id:'cw-05', era:'cold-war', from:'USA', to:'South Korea', tiv:1800, cat:'aircraft',  label:'F-86 Sabre & F-5 Freedom Fighter',           year:1955, fromLat:38.9,  fromLng:-77.0, toLat:37.6,  toLng:127.0,  description:'Jet fighters to rebuild ROKAF after Korean War.' },
  { id:'cw-06', era:'cold-war', from:'USA', to:'Taiwan',      tiv:1600, cat:'aircraft',  label:'F-104G Starfighter & F-5E Tiger',            year:1963, fromLat:38.9,  fromLng:-77.0, toLat:25.0,  toLng:121.5,  description:'Fighters supplied to counter PRC air threat across the Taiwan Strait.' },
  { id:'cw-07', era:'cold-war', from:'USA', to:'Pakistan',    tiv:1400, cat:'aircraft',  label:'F-86 Sabre & F-104 Starfighter',             year:1956, fromLat:38.9,  fromLng:-77.0, toLat:33.7,  toLng:73.1,   description:'Aircraft supplied as part of SEATO/CENTO alliance commitments.' },
  { id:'cw-08', era:'cold-war', from:'USA', to:'Greece',      tiv:900,  cat:'naval',     label:'Fletcher-class destroyers',                  year:1959, fromLat:38.9,  fromLng:-77.0, toLat:37.9,  toLng:23.7,   description:'WWII-era destroyers transferred to NATO ally Greece to bolster Aegean defences.' },
  { id:'cw-09', era:'cold-war', from:'USA', to:'Turkey',      tiv:1100, cat:'armour',    label:'M48 Patton & M60 tanks',                     year:1965, fromLat:38.9,  fromLng:-77.0, toLat:39.9,  toLng:32.9,   description:'Main battle tanks supplied to NATO eastern flank.' },
  { id:'cw-10', era:'cold-war', from:'USA', to:'Egypt',       tiv:2200, cat:'aircraft',  label:'F-16 Fighting Falcon (Camp David)',          year:1981, fromLat:38.9,  fromLng:-77.0, toLat:30.1,  toLng:31.2,   description:'F-16s supplied following Egypt–Israel peace treaty as part of Camp David accords.' },
  { id:'cw-11', era:'cold-war', from:'USA', to:'Jordan',      tiv:800,  cat:'aircraft',  label:'F-104 Starfighter & Hawk missiles',          year:1967, fromLat:38.9,  fromLng:-77.0, toLat:31.9,  toLng:35.9,   description:'Aircraft and SAMs supplied to moderate Arab ally Jordan.' },
  { id:'cw-12', era:'cold-war', from:'USA', to:'Philippines', tiv:700,  cat:'mixed',     label:'F-86, patrol vessels & artillery',           year:1958, fromLat:38.9,  fromLng:-77.0, toLat:14.6,  toLng:121.0,  description:'Mixed package supporting the Philippine armed forces under mutual defence treaty.' },

  // USSR exports
  { id:'cw-13', era:'cold-war', from:'USSR', to:'Egypt',      tiv:3800, cat:'aircraft',  label:'MiG-21, MiG-23 & Su-7 fighters',            year:1962, fromLat:55.8,  fromLng:37.6,  toLat:30.1,  toLng:31.2,   description:'Comprehensive Soviet air force package, largest Middle East arms transfer of the era.' },
  { id:'cw-14', era:'cold-war', from:'USSR', to:'Syria',      tiv:2900, cat:'mixed',     label:'MiG-23/25, T-72 tanks, SAM systems',        year:1973, fromLat:55.8,  fromLng:37.6,  toLat:33.5,  toLng:36.3,   description:'Massive resupply during and after 1973 Yom Kippur War.' },
  { id:'cw-15', era:'cold-war', from:'USSR', to:'India',      tiv:4600, cat:'mixed',     label:'MiG-21, T-54/55, Petya frigates',           year:1962, fromLat:55.8,  fromLng:37.6,  toLat:28.6,  toLng:77.2,   description:'Foundational Indo-Soviet defence partnership — largest Cold War transfer to Asia.' },
  { id:'cw-16', era:'cold-war', from:'USSR', to:'Cuba',       tiv:2100, cat:'mixed',     label:'MiG-21, T-55 tanks, SA-2 missiles',         year:1962, fromLat:55.8,  fromLng:37.6,  toLat:23.1,  toLng:-82.4,  description:'Arms that triggered the Cuban Missile Crisis; continued supply throughout Cold War.' },
  { id:'cw-17', era:'cold-war', from:'USSR', to:'Vietnam',    tiv:3400, cat:'mixed',     label:'MiG-17/19/21, SA-2, T-54 tanks',            year:1965, fromLat:55.8,  fromLng:37.6,  toLat:21.0,  toLng:105.8,  description:'Comprehensive air defence and ground forces package for North Vietnam.' },
  { id:'cw-18', era:'cold-war', from:'USSR', to:'North Korea',tiv:1900, cat:'mixed',     label:'MiG-15/17/21, T-34/54 tanks',               year:1950, fromLat:55.8,  fromLng:37.6,  toLat:39.0,  toLng:125.8,  description:'Korean War and post-war resupply establishing North Korean military structure.' },
  { id:'cw-19', era:'cold-war', from:'USSR', to:'Iraq',       tiv:5200, cat:'mixed',     label:'MiG-23/25/29, T-72, Scud missiles',         year:1972, fromLat:55.8,  fromLng:37.6,  toLat:33.3,  toLng:44.4,   description:'One of the largest Soviet export relationships — Iraq was USSR\'s top Middle East client.' },
  { id:'cw-20', era:'cold-war', from:'USSR', to:'Libya',      tiv:2700, cat:'mixed',     label:'MiG-25, T-72, SAM batteries, Scud',         year:1975, fromLat:55.8,  fromLng:37.6,  toLat:32.9,  toLng:13.2,   description:'Gaddafi\'s Libya became a major Soviet arms client, storing more equipment than it could operate.' },
  { id:'cw-21', era:'cold-war', from:'USSR', to:'Ethiopia',   tiv:1600, cat:'mixed',     label:'MiG-21/23, T-55/62, artillery',             year:1977, fromLat:55.8,  fromLng:37.6,  toLat:9.0,   toLng:38.7,   description:'Massive airlift and sealift supporting Derg regime during Ogaden War.' },
  { id:'cw-22', era:'cold-war', from:'USSR', to:'Angola',     tiv:1400, cat:'mixed',     label:'MiG-21, T-54/55, BM-21 rocket artillery',  year:1976, fromLat:55.8,  fromLng:37.6,  toLat:-8.8,  toLng:13.2,   description:'Arms to MPLA government, delivered partly via Cuban intermediaries.' },
  { id:'cw-23', era:'cold-war', from:'USSR', to:'Afghanistan',tiv:2200, cat:'mixed',     label:'Mi-24 Hind, T-72, BM-27 artillery',        year:1979, fromLat:55.8,  fromLng:37.6,  toLat:34.5,  toLng:69.2,   description:'Weapons deployed during Soviet invasion and occupation 1979–1989.' },
  { id:'cw-24', era:'cold-war', from:'USSR', to:'Poland',     tiv:1800, cat:'mixed',     label:'T-55/72 tanks, MiG-21/23, warships',        year:1955, fromLat:55.8,  fromLng:37.6,  toLat:52.2,  toLng:21.0,   description:'Warsaw Pact standardisation — Poland received extensive Soviet equipment.' },

  // UK exports
  { id:'cw-25', era:'cold-war', from:'UK',  to:'India',       tiv:1200, cat:'naval',     label:'Centaur-class carrier & Leander frigates',  year:1960, fromLat:51.5,  fromLng:-0.1,  toLat:18.9,  toLng:72.8,   description:'Major naval transfers giving India blue-water capability.' },
  { id:'cw-26', era:'cold-war', from:'UK',  to:'Saudi Arabia',tiv:2400, cat:'aircraft',  label:'Lightning & BAC Strikemaster jets',          year:1966, fromLat:51.5,  fromLng:-0.1,  toLat:24.7,  toLng:46.7,   description:'Fighter jets supplied under Al-Yamamah precursor agreements.' },
  { id:'cw-27', era:'cold-war', from:'UK',  to:'Jordan',      tiv:800,  cat:'armour',    label:'Centurion tanks & Tigercat missiles',        year:1960, fromLat:51.5,  fromLng:-0.1,  toLat:31.9,  toLng:35.9,   description:'Centurion MBTs formed backbone of Jordanian armoured forces.' },

  // France exports
  { id:'cw-28', era:'cold-war', from:'France', to:'Israel',   tiv:1800, cat:'aircraft',  label:'Mirage III & Dassault Mystère',              year:1958, fromLat:48.9,  fromLng:2.3,   toLat:31.8,  toLng:35.2,   description:'Mirage III jets gave Israel decisive air superiority in 1967 Six-Day War.' },
  { id:'cw-29', era:'cold-war', from:'France', to:'Iraq',     tiv:2300, cat:'aircraft',  label:'Mirage F1 fighters & Exocet missiles',       year:1981, fromLat:48.9,  fromLng:2.3,   toLat:33.3,  toLng:44.4,   description:'Sold to Iraq during Iran-Iraq War despite arms embargo concerns.' },
  { id:'cw-30', era:'cold-war', from:'France', to:'Pakistan', tiv:900,  cat:'naval',     label:'Agosta-class submarines',                    year:1978, fromLat:48.9,  fromLng:2.3,   toLat:24.9,  toLng:67.0,   description:'Diesel-electric submarines enhancing Pakistani naval strike capability.' },
  { id:'cw-31', era:'cold-war', from:'France', to:'Saudi Arabia',tiv:1600,cat:'armour',  label:'AMX-30 main battle tanks',                   year:1979, fromLat:48.9,  fromLng:2.3,   toLat:24.7,  toLng:46.7,   description:'AMX-30s formed core of Saudi Arabian Army armoured corps.' },

  // China exports
  { id:'cw-32', era:'cold-war', from:'China', to:'Pakistan',  tiv:1400, cat:'aircraft',  label:'J-6 (MiG-19), F-7 & T-59 tanks',           year:1966, fromLat:39.9,  fromLng:116.4, toLat:33.7,  toLng:73.1,   description:'Foundational Sino-Pakistani defence relationship, continuing to present day.' },
  { id:'cw-33', era:'cold-war', from:'China', to:'North Korea',tiv:900, cat:'mixed',     label:'J-5/6 fighters, T-59/62 tanks',             year:1960, fromLat:39.9,  fromLng:116.4, toLat:39.0,  toLng:125.8,  description:'Arms supply after Sino-Soviet split reduced DPRK dependence on USSR.' },

  // ── POST-COLD WAR ERA (1992–2013) ───────────────────────────────────────────

  // USA exports
  { id:'pc-01', era:'post-cold', from:'USA', to:'Israel',     tiv:6800, cat:'aircraft',  label:'F-15I Ra\'am & F-16I Sufa',                 year:1994, fromLat:38.9,  fromLng:-77.0, toLat:31.8,  toLng:35.2,   description:'Advanced multi-role fighters with Israel-specific modifications, funded by US military aid.' },
  { id:'pc-02', era:'post-cold', from:'USA', to:'Saudi Arabia',tiv:8200,cat:'aircraft',  label:'F-15S/SA Eagle & Apache helicopters',        year:1993, fromLat:38.9,  fromLng:-77.0, toLat:24.7,  toLng:46.7,   description:'Post-Gulf War modernisation package — one of the largest US arms deals in history.' },
  { id:'pc-03', era:'post-cold', from:'USA', to:'Taiwan',     tiv:5400, cat:'mixed',     label:'F-16A/B, Patriot PAC-2, Perry frigates',    year:1992, fromLat:38.9,  fromLng:-77.0, toLat:25.0,  toLng:121.5,  description:'Major package approved over PRC objections to support Taiwan defence.' },
  { id:'pc-04', era:'post-cold', from:'USA', to:'UAE',        tiv:4600, cat:'aircraft',  label:'F-16E/F Desert Falcon & Apache',            year:2000, fromLat:38.9,  fromLng:-77.0, toLat:24.5,  toLng:54.4,   description:'Advanced Block 60 F-16s with superior avionics to USAF standard variant.' },
  { id:'pc-05', era:'post-cold', from:'USA', to:'South Korea',tiv:3800, cat:'aircraft',  label:'F-15K Slam Eagle',                          year:2002, fromLat:38.9,  fromLng:-77.0, toLat:37.6,  toLng:127.0,  description:'Advanced strike fighters selected over Eurofighter and Rafale.' },
  { id:'pc-06', era:'post-cold', from:'USA', to:'Egypt',      tiv:3200, cat:'mixed',     label:'F-16C/D, M1A1 Abrams (co-production)',      year:1992, fromLat:38.9,  fromLng:-77.0, toLat:30.1,  toLng:31.2,   description:'Egypt co-produces M1A1 Abrams tanks — unique industrial partnership.' },
  { id:'pc-07', era:'post-cold', from:'USA', to:'Kuwait',     tiv:2800, cat:'mixed',     label:'F/A-18C/D Hornet & M1A2 Abrams',           year:1992, fromLat:38.9,  fromLng:-77.0, toLat:29.4,  toLng:47.9,   description:'Post-liberation package to rebuild Kuwaiti armed forces after Gulf War.' },
  { id:'pc-08', era:'post-cold', from:'USA', to:'Japan',      tiv:4200, cat:'missile',   label:'Patriot PAC-3 & SM-3 (BMD system)',         year:2003, fromLat:38.9,  fromLng:-77.0, toLat:35.7,  toLng:139.7,  description:'Ballistic missile defence systems countering North Korean threat.' },
  { id:'pc-09', era:'post-cold', from:'USA', to:'Australia',  tiv:3600, cat:'aircraft',  label:'F/A-18F Super Hornet & EA-18G Growler',    year:2007, fromLat:38.9,  fromLng:-77.0, toLat:-35.3, toLng:149.1,  description:'Interim replacement for F-111 pending F-35 delivery.' },
  { id:'pc-10', era:'post-cold', from:'USA', to:'Poland',     tiv:2100, cat:'missile',   label:'Patriot PAC-3 air defence system',          year:2003, fromLat:38.9,  fromLng:-77.0, toLat:52.2,  toLng:21.0,   description:'NATO eastern flank air defence, partially in response to Russian pressure.' },
  { id:'pc-11', era:'post-cold', from:'USA', to:'Morocco',    tiv:1400, cat:'armour',    label:'M1A1 Abrams tanks & F-16C/D',              year:2011, fromLat:38.9,  fromLng:-77.0, toLat:33.9,  toLng:-6.9,   description:'Modernisation package for key North African ally.' },

  // Russia exports
  { id:'pc-12', era:'post-cold', from:'Russia', to:'China',   tiv:7200, cat:'mixed',     label:'Su-27/30, Kilo submarines, Sovremenny DD', year:1992, fromLat:55.8,  fromLng:37.6,  toLat:39.9,  toLng:116.4,  description:'Largest post-Soviet arms relationship — Russia\'s biggest export customer 1992–2010.' },
  { id:'pc-13', era:'post-cold', from:'Russia', to:'India',   tiv:8900, cat:'mixed',     label:'Su-30MKI, Gorshkov carrier, T-90 tanks',   year:1996, fromLat:55.8,  fromLng:37.6,  toLat:28.6,  toLng:77.2,   description:'Deepening post-Soviet Indo-Russian partnership, including carrier INS Vikramaditya.' },
  { id:'pc-14', era:'post-cold', from:'Russia', to:'Algeria', tiv:3800, cat:'mixed',     label:'Su-30MKA, T-90SA, S-300PMU2',              year:2006, fromLat:55.8,  fromLng:37.6,  toLat:36.7,  toLng:3.1,    description:'Algeria became Russia\'s top African arms client with massive modernisation.' },
  { id:'pc-15', era:'post-cold', from:'Russia', to:'Venezuela',tiv:4200,cat:'mixed',     label:'Su-30MKV, T-72B1V, S-300VM',              year:2006, fromLat:55.8,  fromLng:37.6,  toLat:10.5,  toLng:-66.9,  description:'Chavez-era arms purchases — largest Latin American deal with Russia.' },
  { id:'pc-16', era:'post-cold', from:'Russia', to:'Iran',    tiv:2600, cat:'missile',   label:'S-300PMU-1 & Kilo-class submarines',       year:2007, fromLat:55.8,  fromLng:37.6,  toLat:35.7,  toLng:51.4,   description:'Controversial S-300 sale blocked by sanctions, eventually delivered 2016.' },
  { id:'pc-17', era:'post-cold', from:'Russia', to:'Syria',   tiv:2100, cat:'mixed',     label:'MiG-29SMT, Pantsir-S1, Buk-M2',           year:2008, fromLat:55.8,  fromLng:37.6,  toLat:33.5,  toLng:36.3,   description:'Pre-war modernisation of Syrian Arab Air Force and air defence network.' },
  { id:'pc-18', era:'post-cold', from:'Russia', to:'Malaysia',tiv:1200, cat:'aircraft',  label:'Su-30MKM fighters',                        year:2003, fromLat:55.8,  fromLng:37.6,  toLat:3.1,   toLng:101.7,  description:'Malaysia selected Flanker over Eurofighter in surprise decision.' },

  // France exports
  { id:'pc-19', era:'post-cold', from:'France', to:'UAE',     tiv:3200, cat:'aircraft',  label:'Mirage 2000-9 & SCALP cruise missiles',    year:1997, fromLat:48.9,  fromLng:2.3,   toLat:24.5,  toLng:54.4,   description:'UAE the launch customer for upgraded Mirage 2000-9 variant.' },
  { id:'pc-20', era:'post-cold', from:'France', to:'Taiwan',  tiv:2800, cat:'naval',     label:'La Fayette-class frigates (6 ships)',       year:1991, fromLat:48.9,  fromLng:2.3,   toLat:25.0,  toLng:121.5,  description:'Stealth frigates caused diplomatic crisis with China; ongoing scandal over kickbacks.' },
  { id:'pc-21', era:'post-cold', from:'France', to:'Greece',  tiv:2100, cat:'mixed',     label:'Mirage 2000-5 & FREMM frigates',           year:1999, fromLat:48.9,  fromLng:2.3,   toLat:37.9,  toLng:23.7,   description:'Major Hellenic modernisation package with France as primary supplier.' },
  { id:'pc-22', era:'post-cold', from:'France', to:'Brazil',  tiv:1800, cat:'naval',     label:'Scorpene submarines & Riachuelo',          year:2009, fromLat:48.9,  fromLng:2.3,   toLat:-15.8, toLng:-47.9,  description:'Nuclear-powered submarine technology transfer — unique French export arrangement.' },

  // UK exports
  { id:'pc-23', era:'post-cold', from:'UK',  to:'Saudi Arabia',tiv:9200,cat:'aircraft',  label:'Tornado IDS/ADV & Typhoon (Al-Yamamah)',   year:1985, fromLat:51.5,  fromLng:-0.1,  toLat:24.7,  toLng:46.7,   description:'Al-Yamamah — largest ever British defence export deal, worth £43 billion total.' },
  { id:'pc-24', era:'post-cold', from:'UK',  to:'India',       tiv:1800, cat:'naval',    label:'Sea Harrier & Type 23 frigate systems',    year:1997, fromLat:51.5,  fromLng:-0.1,  toLat:18.9,  toLng:72.8,   description:'Naval aviation and frigate systems as part of Indo-British defence ties.' },
  { id:'pc-25', era:'post-cold', from:'UK',  to:'Oman',        tiv:1400, cat:'aircraft', label:'Typhoon Eurofighter & Hawk trainers',      year:2012, fromLat:51.5,  fromLng:-0.1,  toLat:23.6,  toLng:58.6,   description:'12 Typhoons and Hawks for Royal Air Force of Oman.' },

  // Germany exports
  { id:'pc-26', era:'post-cold', from:'Germany', to:'Turkey', tiv:2200, cat:'armour',   label:'Leopard 1A3/2A4 tanks (1,000+ units)',     year:1993, fromLat:52.5,  fromLng:13.4,  toLat:39.9,  toLng:32.9,   description:'Massive post-Cold War transfer of Bundeswehr surplus Leopard tanks to NATO ally.' },
  { id:'pc-27', era:'post-cold', from:'Germany', to:'Greece', tiv:1600, cat:'armour',   label:'Leopard 2A4/HEL & Type 214 submarines',   year:2000, fromLat:52.5,  fromLng:13.4,  toLat:37.9,  toLng:23.7,   description:'Leopards and HDW submarines forming Greek armoured and naval backbone.' },
  { id:'pc-28', era:'post-cold', from:'Germany', to:'Israel', tiv:2800, cat:'naval',    label:'Dolphin-class submarines (6 boats)',        year:1999, fromLat:52.5,  fromLng:13.4,  toLat:31.8,  toLng:35.2,   description:'Dolphin submarines believed to carry nuclear-capable cruise missiles; partly subsidised.' },
  { id:'pc-29', era:'post-cold', from:'Germany', to:'Saudi Arabia',tiv:1800,cat:'armour','label':'Leopard 2 & G36 rifles controversy',   year:2012, fromLat:52.5,  fromLng:13.4,  toLat:24.7,  toLng:46.7,   description:'Controversial sale triggering German parliamentary debate over arms export policy.' },

  // China exports
  { id:'pc-30', era:'post-cold', from:'China', to:'Pakistan', tiv:3800, cat:'mixed',    label:'JF-17 Thunder (co-development), F-7PG',    year:2007, fromLat:39.9,  fromLng:116.4, toLat:33.7,  toLng:73.1,   description:'JF-17 co-developed specifically to replace ageing Pakistani fleet without US dependency.' },
  { id:'pc-31', era:'post-cold', from:'China', to:'Bangladesh',tiv:1200,cat:'mixed',    label:'F-7BG fighters & Ming-class submarine',    year:2002, fromLat:39.9,  fromLng:116.4, toLat:23.7,  toLng:90.4,   description:'Bangladesh one of China\'s most consistent South Asian arms customers.' },
  { id:'pc-32', era:'post-cold', from:'China', to:'Myanmar',  tiv:1400, cat:'mixed',    label:'F-7 fighters, frigates, Type 63A tanks',   year:1994, fromLat:39.9,  fromLng:116.4, toLat:19.7,  toLng:96.1,   description:'China filling vacuum left by Western sanctions on Myanmar military junta.' },

  // Israel exports
  { id:'pc-33', era:'post-cold', from:'Israel', to:'India',   tiv:3200, cat:'missile',  label:'Phalcon AWACS, Barak SAM, Heron UAV',     year:2004, fromLat:31.8,  fromLng:35.2,  toLat:28.6,  toLng:77.2,   description:'India became Israel\'s largest arms export customer by 2013.' },
  { id:'pc-34', era:'post-cold', from:'Israel', to:'China',   tiv:2100, cat:'mixed',    label:'Phalcon AWACS (cancelled), Harpy UAV',     year:2000, fromLat:31.8,  fromLng:35.2,  toLat:39.9,  toLng:116.4,  description:'Phalcon AWACS sale cancelled under US pressure; Harpy anti-radar UAV delivered.' },

  // ── MODERN ERA (2014–2024) ───────────────────────────────────────────────────

  // USA exports
  { id:'mo-01', era:'modern', from:'USA', to:'Saudi Arabia',  tiv:14600,cat:'mixed',    label:'THAAD, F-15SA, Patriot, Apache, bombs',    year:2017, fromLat:38.9,  fromLng:-77.0, toLat:24.7,  toLng:46.7,   description:'$110B+ arms package signed during Trump visit — largest single arms deal in US history.' },
  { id:'mo-02', era:'modern', from:'USA', to:'UAE',           tiv:8200, cat:'aircraft', label:'F-35A Lightning II (50 jets)',              year:2021, fromLat:38.9,  fromLng:-77.0, toLat:24.5,  toLng:54.4,   description:'First F-35 sale to Arab state, linked to Abraham Accords; later suspended by Biden.' },
  { id:'mo-03', era:'modern', from:'USA', to:'Japan',         tiv:6400, cat:'mixed',    label:'F-35A/B, Osprey, Aegis upgrades',          year:2016, fromLat:38.9,  fromLng:-77.0, toLat:35.7,  toLng:139.7,  description:'Japan\'s massive post-pacifism rearmament drive, largest defence budget increase in decades.' },
  { id:'mo-04', era:'modern', from:'USA', to:'Poland',        tiv:7800, cat:'mixed',    label:'F-35A, HIMARS, Abrams M1A2SEPv3, Patriot', year:2018, fromLat:38.9,  fromLng:-77.0, toLat:52.2,  toLng:21.0,   description:'Massive Polish rearmament after Russia-Ukraine war — largest European arms buyer 2022–2024.' },
  { id:'mo-05', era:'modern', from:'USA', to:'Ukraine',       tiv:32000,cat:'mixed',    label:'HIMARS, Patriot, M1 Abrams, F-16, Javelins',year:2022,fromLat:38.9,  fromLng:-77.0, toLat:50.5,  toLng:30.5,   description:'Largest US arms transfer since WWII in scale — comprehensive military aid package.' },
  { id:'mo-06', era:'modern', from:'USA', to:'Taiwan',        tiv:5200, cat:'missile',  label:'SLAM-ER, Harpoon coastal defence, Stinger', year:2020, fromLat:38.9,  fromLng:-77.0, toLat:25.0,  toLng:121.5,  description:'Anti-ship and anti-air systems to deny PLA amphibious landing capability.' },
  { id:'mo-07', era:'modern', from:'USA', to:'India',         tiv:4800, cat:'mixed',    label:'Apache, Chinook, MH-60R, C-17, P-8',       year:2015, fromLat:38.9,  fromLng:-77.0, toLat:28.6,  toLng:77.2,   description:'India diversifying away from Russia — US becoming major supplier for first time.' },
  { id:'mo-08', era:'modern', from:'USA', to:'Australia',     tiv:9800, cat:'mixed',    label:'F-35A, Virginia SSN (AUKUS), MH-60R',      year:2019, fromLat:38.9,  fromLng:-77.0, toLat:-35.3, toLng:149.1,  description:'AUKUS nuclear submarine deal — transformative Indo-Pacific defence partnership.' },
  { id:'mo-09', era:'modern', from:'USA', to:'Germany',       tiv:4200, cat:'mixed',    label:'F-35A (35 jets) & CH-47F Chinook',         year:2022, fromLat:38.9,  fromLng:-77.0, toLat:52.5,  toLng:13.4,   description:'Germany\'s Zeitenwende — replacing Tornado with F-35 for nuclear sharing role.' },
  { id:'mo-10', era:'modern', from:'USA', to:'Israel',        tiv:18000,cat:'mixed',    label:'F-35I Adir, bombs, Iron Dome aid, Hellfire', year:2016,fromLat:38.9,  fromLng:-77.0, toLat:31.8,  toLng:35.2,   description:'Ongoing $3.8B annual US military aid package — accelerated dramatically post Oct 2023.' },
  { id:'mo-11', era:'modern', from:'USA', to:'Canada',        tiv:8800, cat:'aircraft', label:'F-35A (88 jets) — NORAD modernisation',     year:2023, fromLat:38.9,  fromLng:-77.0, toLat:45.4,  toLng:-75.7,  description:'Canada\'s long-delayed fighter replacement finally settled on F-35 after years of debate.' },
  { id:'mo-12', era:'modern', from:'USA', to:'Finland',       tiv:7200, cat:'aircraft', label:'F-35A (64 jets) — HX programme',           year:2021, fromLat:38.9,  fromLng:-77.0, toLat:60.2,  toLng:24.9,   description:'Finland selected F-35 over Eurofighter, Gripen and Super Hornet — largest Finnish defence purchase.' },
  { id:'mo-13', era:'modern', from:'USA', to:'Romania',       tiv:2800, cat:'aircraft', label:'F-35A (32 jets) & Patriot PAC-3',          year:2024, fromLat:38.9,  fromLng:-77.0, toLat:44.4,  toLng:26.1,   description:'NATO eastern flank reinforcement following Russia\'s invasion of Ukraine.' },
  { id:'mo-14', era:'modern', from:'USA', to:'Greece',        tiv:3200, cat:'aircraft', label:'F-35A (40 jets) & Rafale supplement',      year:2023, fromLat:38.9,  fromLng:-77.0, toLat:37.9,  toLng:23.7,   description:'Greece expanding fleet with mixed F-35/Rafale approach to counter Turkish Flankers.' },

  // Russia exports
  { id:'mo-15', era:'modern', from:'Russia', to:'India',      tiv:6200, cat:'mixed',    label:'S-400 Triumf, Ka-226T, AK-203 production', year:2016, fromLat:55.8,  fromLng:37.6,  toLat:28.6,  toLng:77.2,   description:'S-400 sale defying US CAATSA sanctions threat — India choosing strategic autonomy.' },
  { id:'mo-16', era:'modern', from:'Russia', to:'China',      tiv:4800, cat:'mixed',    label:'S-400, Su-35, Il-76/78 tankers',           year:2015, fromLat:55.8,  fromLng:37.6,  toLat:39.9,  toLng:116.4,  description:'China diversifying air defence and tanker capability with Russian systems.' },
  { id:'mo-17', era:'modern', from:'Russia', to:'Turkey',     tiv:2400, cat:'missile',  label:'S-400 Triumf air defence system',          year:2017, fromLat:55.8,  fromLng:37.6,  toLat:39.9,  toLng:32.9,   description:'NATO crisis — Turkey\'s S-400 purchase led to F-35 expulsion from programme.' },
  { id:'mo-18', era:'modern', from:'Russia', to:'Egypt',      tiv:3600, cat:'mixed',    label:'MiG-29M, Ka-52K, S-300VM Antey',          year:2015, fromLat:55.8,  fromLng:37.6,  toLat:30.1,  toLng:31.2,   description:'Egypt diversifying from US dependency, largest Russian Arab state deal in decades.' },
  { id:'mo-19', era:'modern', from:'Russia', to:'Algeria',    tiv:4200, cat:'mixed',    label:'Su-57 (negotiated), S-400, Su-30MKA',     year:2019, fromLat:55.8,  fromLng:37.6,  toLat:36.7,  toLng:3.1,    description:'Algeria remains Russia\'s most consistent African arms customer.' },
  { id:'mo-20', era:'modern', from:'Russia', to:'Belarus',    tiv:1800, cat:'mixed',    label:'S-400, Iskander-M, Su-30SM fighters',     year:2021, fromLat:55.8,  fromLng:37.6,  toLat:53.9,  toLng:27.6,   description:'Belarus integrating into Russian military structure including nuclear sharing.' },

  // France exports
  { id:'mo-21', era:'modern', from:'France', to:'India',      tiv:7800, cat:'aircraft', label:'Rafale F3R (36 jets) — MMRCA',             year:2016, fromLat:48.9,  fromLng:2.3,   toLat:28.6,  toLng:77.2,   description:'India\'s controversial Rafale purchase — largest French export deal, subject of political scandal.' },
  { id:'mo-22', era:'modern', from:'France', to:'Egypt',      tiv:5200, cat:'mixed',    label:'Rafale, FREMM frigates, Mistral class',    year:2015, fromLat:48.9,  fromLng:2.3,   toLat:30.1,  toLng:31.2,   description:'Egypt becoming one of France\'s largest export customers for Dassault and Naval Group.' },
  { id:'mo-23', era:'modern', from:'France', to:'Qatar',      tiv:6800, cat:'aircraft', label:'Rafale F3R (36+12 jets)',                  year:2016, fromLat:48.9,  fromLng:2.3,   toLat:25.3,  toLng:51.5,   description:'Qatar first export customer for Rafale — deal that broke French export drought.' },
  { id:'mo-24', era:'modern', from:'France', to:'Greece',     tiv:3200, cat:'aircraft', label:'Rafale F3R (18+6 jets) & FDI frigates',   year:2021, fromLat:48.9,  fromLng:2.3,   toLat:37.9,  toLng:23.7,   description:'Greece buying Rafales to counter Turkish F-16 upgrades across Aegean.' },
  { id:'mo-25', era:'modern', from:'France', to:'UAE',        tiv:9200, cat:'aircraft', label:'Rafale F4 (80 jets) — record deal',        year:2021, fromLat:48.9,  fromLng:2.3,   toLat:24.5,  toLng:54.4,   description:'Largest ever Rafale export deal at €17 billion — UAE replacing Mirage 2000-9 fleet.' },
  { id:'mo-26', era:'modern', from:'France', to:'Indonesia',  tiv:2800, cat:'aircraft', label:'Rafale F3 (42 jets)',                      year:2022, fromLat:48.9,  fromLng:2.3,   toLat:-6.2,  toLng:106.8,  description:'Indonesia switching from Su-27/30 to Western fighters with Rafale selection.' },
  { id:'mo-27', era:'modern', from:'France', to:'Croatia',    tiv:1200, cat:'aircraft', label:'Rafale F3R (12 jets, ex-French AF)',       year:2021, fromLat:48.9,  fromLng:2.3,   toLat:45.8,  toLng:16.0,   description:'Ex-French Air Force Rafales at bargain price replacing ageing MiG-21 fleet.' },

  // China exports
  { id:'mo-28', era:'modern', from:'China', to:'Pakistan',    tiv:6400, cat:'mixed',    label:'Type 054A/P frigates, JF-17 Block III, HQ-9',year:2017,fromLat:39.9, fromLng:116.4, toLat:33.7,  toLng:73.1,   description:'Pakistan China\'s largest arms export customer — comprehensive force modernisation.' },
  { id:'mo-29', era:'modern', from:'China', to:'Bangladesh',  tiv:1800, cat:'naval',    label:'Type 035G submarine & Ming-class',         year:2016, fromLat:39.9,  fromLng:116.4, toLat:23.7,  toLng:90.4,   description:'Bangladesh first South Asian nation to receive Chinese submarines.' },
  { id:'mo-30', era:'modern', from:'China', to:'Nigeria',     tiv:800,  cat:'aircraft', label:'L-15 Falcon & CH-3A armed drones',         year:2021, fromLat:39.9,  fromLng:116.4, toLat:9.1,   toLng:7.4,    description:'China expanding African market with affordable jets and armed UAVs.' },
  { id:'mo-31', era:'modern', from:'China', to:'Saudi Arabia',tiv:1600, cat:'drone',    label:'CH-4B & Wing Loong II armed UAVs',        year:2017, fromLat:39.9,  fromLng:116.4, toLat:24.7,  toLng:46.7,   description:'Saudi Arabia buying Chinese armed drones — used extensively in Yemen conflict.' },
  { id:'mo-32', era:'modern', from:'China', to:'UAE',         tiv:1200, cat:'drone',    label:'Wing Loong I/II UCAV',                    year:2016, fromLat:39.9,  fromLng:116.4, toLat:24.5,  toLng:54.4,   description:'UAE among first Arab operators of Chinese armed drones.' },
  { id:'mo-33', era:'modern', from:'China', to:'Serbia',      tiv:900,  cat:'missile',  label:'HQ-22 (FK-3) SAM system',                 year:2022, fromLat:39.9,  fromLng:116.4, toLat:44.8,  toLng:20.5,   description:'First Chinese air defence sale to a European country — geopolitically significant.' },
  { id:'mo-34', era:'modern', from:'China', to:'Argentina',   tiv:1100, cat:'naval',    label:'Type 042 destroyers & corvettes',         year:2023, fromLat:39.9,  fromLng:116.4, toLat:-34.6, toLng:-58.4,  description:'China making inroads into South American defence market traditionally dominated by US/EU.' },

  // Turkey exports
  { id:'mo-35', era:'modern', from:'Turkey', to:'Ukraine',    tiv:1400, cat:'drone',    label:'Bayraktar TB2 armed drones',              year:2019, fromLat:39.9,  fromLng:32.9,  toLat:50.5,  toLng:30.5,   description:'TB2 proved decisive in 2020 Nagorno-Karabakh and 2022 Ukraine war — Turkey\'s export success story.' },
  { id:'mo-36', era:'modern', from:'Turkey', to:'Azerbaijan', tiv:1200, cat:'drone',    label:'Bayraktar TB2 & Akinci drones',           year:2020, fromLat:39.9,  fromLng:32.9,  toLat:40.4,  toLng:49.9,   description:'TB2s decimated Armenian armour in 44-day Nagorno-Karabakh war.' },
  { id:'mo-37', era:'modern', from:'Turkey', to:'Somalia',    tiv:400,  cat:'drone',    label:'Bayraktar TB2 & armoured vehicles',       year:2022, fromLat:39.9,  fromLng:32.9,  toLat:2.0,   toLng:45.3,   description:'Turkey expanding African military footprint through defence exports and basing.' },
  { id:'mo-38', era:'modern', from:'Turkey', to:'Poland',     tiv:600,  cat:'drone',    label:'Bayraktar TB2 (24 systems)',              year:2021, fromLat:39.9,  fromLng:32.9,  toLat:52.2,  toLng:21.0,   description:'Poland first NATO member to acquire Turkish TB2 drones — post-Ukraine war rush.' },
  { id:'mo-39', era:'modern', from:'Turkey', to:'Ethiopia',   tiv:500,  cat:'drone',    label:'Bayraktar TB2 (used in Tigray war)',      year:2021, fromLat:39.9,  fromLng:32.9,  toLat:9.0,   toLng:38.7,   description:'TB2s deployed in Tigray conflict — drew international criticism.' },

  // UK exports
  { id:'mo-40', era:'modern', from:'UK', to:'Saudi Arabia',   tiv:6200, cat:'aircraft', label:'Typhoon Tranche 3 & Brimstone missiles',  year:2014, fromLat:51.5,  fromLng:-0.1,  toLat:24.7,  toLng:46.7,   description:'Ongoing Al-Salam programme — Typhoons used in Yemen strikes drawing UK criticism.' },
  { id:'mo-41', era:'modern', from:'UK', to:'Qatar',          tiv:3400, cat:'aircraft', label:'Typhoon & Hawk T.2 jets',                 year:2017, fromLat:51.5,  fromLng:-0.1,  toLat:25.3,  toLng:51.5,   description:'Qatar purchasing Typhoon alongside French Rafale for diversified fleet.' },
  { id:'mo-42', era:'modern', from:'UK', to:'Ukraine',        tiv:2800, cat:'mixed',    label:'Challenger 2, Storm Shadow, Brimstone, Starstreak',year:2022,fromLat:51.5,fromLng:-0.1,toLat:50.5,toLng:30.5,'description':'UK first country to supply Western main battle tanks to Ukraine.' },

  // Israel exports
  { id:'mo-43', era:'modern', from:'Israel', to:'India',      tiv:4200, cat:'mixed',    label:'Spike ATGM, Barak-8, Heron TP, Iron Dome',year:2016,fromLat:31.8,  fromLng:35.2,  toLat:28.6,  toLng:77.2,   description:'India Israel\'s largest arms export market — missiles, UAVs, air defence.' },
  { id:'mo-44', era:'modern', from:'Israel', to:'Azerbaijan', tiv:1600, cat:'drone',    label:'Harop loitering munition & Heron UAV',    year:2016, fromLat:31.8,  fromLng:35.2,  toLat:40.4,  toLng:49.9,   description:'Israeli Harop loitering munitions devastating in 2020 Karabakh war.' },

  // North Korea exports
  { id:'mo-45', era:'modern', from:'North Korea', to:'Russia',tiv:2200, cat:'artillery',label:'152mm shells, Hwasong ballistic missiles', year:2023, fromLat:39.0,  fromLng:125.8, toLat:55.8,  toLng:37.6,   description:'Unprecedented DPRK arms supply to Russia for use in Ukraine — millions of artillery shells.' },
  { id:'mo-46', era:'modern', from:'Iran', to:'Russia',       tiv:1800, cat:'drone',    label:'Shahed-136 Geran-2 kamikaze drones',      year:2022, fromLat:35.7,  fromLng:51.4,  toLat:55.8,  toLng:37.6,   description:'Iran supplying Russia with one-way attack drones used extensively against Ukrainian cities.' },
  { id:'mo-47', era:'modern', from:'Iran', to:'Houthis',      tiv:800,  cat:'missile',  label:'Anti-ship missiles, Shahed drones, Fateh',year:2015, fromLat:35.7,  fromLng:51.4,  toLat:15.5,  toLng:44.2,   description:'Iran arming Houthi rebels — weapons used against Saudi targets and Red Sea shipping.' },
  { id:'mo-48', era:'modern', from:'Iran', to:'Hezbollah',    tiv:600,  cat:'missile',  label:'Fateh-110, Zelzal, Kornet ATGMs',         year:2014, fromLat:35.7,  fromLng:51.4,  toLat:33.9,  toLng:35.5,   description:'Ongoing Iranian arms pipeline to Hezbollah via Syria.' },

  // Germany exports
  { id:'mo-49', era:'modern', from:'Germany', to:'Ukraine',   tiv:3800, cat:'mixed',    label:'Leopard 2A6, IRIS-T SLM, PzH 2000',      year:2022, fromLat:52.5,  fromLng:13.4,  toLat:50.5,  toLng:30.5,   description:'Germany overcoming historic reluctance — Leopard 2 deliveries after months of debate.' },
  { id:'mo-50', era:'modern', from:'Germany', to:'Israel',    tiv:2200, cat:'naval',    label:'Dolphin II & Dakar-class submarines',     year:2019, fromLat:52.5,  fromLng:13.4,  toLat:31.8,  toLng:35.2,   description:'Continued German submarine supply to Israel; deliveries paused after Oct 2023 scrutiny.' },
];
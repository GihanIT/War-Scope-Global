// ─────────────────────────────────────────────────────────────
// ARMS TRADE TEMPLATE — arms-trade-data.js
// Add to the ARMS_TRANSFERS array.
// TIV = Trend Indicator Value (SIPRI methodology, millions USD)
// Find TIV values at: sipri.org/databases/armstransfers
// ─────────────────────────────────────────────────────────────

{
  id: 'mod-XX',                    // unique id — use next available number e.g. 'mod-51'
  era: 'modern',                   // cold-war (1950-1991) | post-cold (1992-2013) | modern (2014+)
  from: 'Supplier Country',        // country name — must match existing entries
  to: 'Recipient Country',         // country name
  tiv: 1200,                       // SIPRI TIV in millions USD equivalent
  cat: 'aircraft',                 // see categories below
  label: 'Short description of what was transferred',  // e.g. '36 Rafale fighter jets'
  year: 2020,                      // year of contract or delivery

  // Coordinates for map arcs — use capital city coordinates
  // Find at: latlong.net or Google Maps
  fromLat: 48.9, fromLng: 2.3,    // Paris (France)
  toLat:   28.6, toLng:   77.2,   // New Delhi (India)

  description: 'Full description of the transfer — context, significance, delivery timeline.',
  source: 'SIPRI Arms Transfers Database + [any additional source]',
  lastVerified: '2026-03',
},

// ── ERA VALUES ────────────────────────────────────────────────
// cold-war    1950–1991
// post-cold   1992–2013
// modern      2014–present

// ── CATEGORY VALUES ──────────────────────────────────────────
// aircraft    Fighter jets, bombers, transport aircraft, helicopters
// naval       Warships, submarines, patrol vessels
// missile     Air defence systems, ballistic missiles, cruise missiles
// armour      Tanks, APCs, IFVs, artillery
// drone       UAVs, armed drones
// artillery   Towed artillery, rocket artillery, mortars
// mixed       Multiple categories in one deal

// ── CAPITAL CITY COORDINATES (common) ────────────────────────
// Use these for fromLat/fromLng and toLat/toLng:
//
// Washington DC (USA):    38.9, -77.0
// Moscow (Russia):        55.8,  37.6
// Beijing (China):        39.9, 116.4
// London (UK):            51.5,  -0.1
// Paris (France):         48.9,   2.3
// Berlin (Germany):       52.5,  13.4
// Tel Aviv (Israel):      31.8,  34.8
// Riyadh (Saudi Arabia):  24.7,  46.7
// New Delhi (India):      28.6,  77.2
// Islamabad (Pakistan):   33.7,  73.1
// Tokyo (Japan):          35.7, 139.7
// Seoul (South Korea):    37.6, 127.0
// Ankara (Turkey):        39.9,  32.9
// Tehran (Iran):          35.7,  51.4
// Cairo (Egypt):          30.1,  31.2
// Kyiv (Ukraine):         50.4,  30.5
// Warsaw (Poland):        52.2,  21.0
// Canberra (Australia): -35.3, 149.1
// Ottawa (Canada):        45.4, -75.7
// Abuja (Nigeria):         9.1,   7.4
// Nairobi (Kenya):        -1.3,  36.8
// Pretoria (S. Africa):  -25.7,  28.2
// Bangkok (Thailand):     13.8, 100.5
// Jakarta (Indonesia):    -6.2, 106.8
// Kuala Lumpur (Malaysia): 3.1, 101.7

// ── EXAMPLE ───────────────────────────────────────────────────
{
  id: 'mod-51',
  era: 'modern',
  from: 'France', to: 'India',
  tiv: 3200, cat: 'aircraft',
  label: '36 Rafale fighter jets',
  year: 2016,
  fromLat: 48.9, fromLng: 2.3,
  toLat: 28.6, toLng: 77.2,
  description: 'EUR 7.87 billion government-to-government deal. France\'s largest ever arms export. Delivery of all 36 jets completed September 2022.',
  source: 'SIPRI Arms Transfers Database + French MoD press release, Sept 2016',
  lastVerified: '2026-03',
},

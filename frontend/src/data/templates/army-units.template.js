// ─────────────────────────────────────────────────────────────
// ARMY UNITS TEMPLATE — army-units-db.js
// Copy this block and fill in your country's data.
// Add to the COUNTRIES object AND the UNITS array.
// Delete any fields you don't know — do NOT leave them blank.
// ─────────────────────────────────────────────────────────────

// ── STEP 1: Add to COUNTRIES object ──────────────────────────
// Find the COUNTRIES object at the top of army-units-db.js
// and add your country:

'YOUR_COUNTRY': { flag: '🏳️', iso3: 'XXX' },

// Example:
'Thailand': { flag: '🇹🇭', iso3: 'THA' },

// ── STEP 2: Add to UNITS array ────────────────────────────────
// Add one block per branch (army, navy, air force, etc.)
// Copy and fill in as many as you know.

{
  country: 'YOUR COUNTRY NAME',    // e.g. 'Thailand'
  iso3: 'XXX',                     // ISO 3166-1 alpha-3 code e.g. 'THA'
  branch: 'army',                  // army | navy | air | marines | sof | coastguard | gendarmerie
  name: 'Name of the military branch',  // e.g. 'Royal Thai Army'
  established: 1900,               // year established — delete if unknown
  personnel: {
    active:  100000,               // active duty — use null if unknown
    reserve: 50000,                // reserve/national guard — use null if unknown
  },
  hq: 'Capital City',             // headquarters city
  commander: 'Commander Title',    // e.g. 'Chief of Army Staff' or actual name if public
  majorUnits: [
    'Unit Name (Location)',
    'Unit Name (Location)',
    // Add as many as you know
  ],
  equipment: {
    tanks:        0,               // main battle tanks — use null if unknown
    apcs:         0,               // armoured personnel carriers / IFVs
    artillery:    0,               // towed + self-propelled combined
    helicopters:  0,               // all military helicopters
    // Add other equipment types relevant to this branch
  },
  missions: [
    'Brief description of current mission or role',
    // e.g. 'Counter-insurgency operations in southern border provinces'
  ],
  notes: 'Any important caveats about the data, e.g. figures are estimates',
  source: 'REQUIRED — where did you get this data? URL or citation',
  lastVerified: '2026-03',        // YYYY-MM when you last verified this
},

// ── BRANCH VALUES ─────────────────────────────────────────────
// army         Ground forces / land army
// navy         Naval forces
// air          Air force
// marines      Marine / amphibious forces
// sof          Special operations forces
// strategic    Strategic command / nuclear command
// cyber        Cyber and information warfare units
// space        Space command
// missile      Strategic missile forces (e.g. China's PLA Rocket Force)
// coastguard   Coast guard / maritime patrol
// gendarmerie  Paramilitary police / gendarmerie

// ── EXAMPLE (Nigeria) ─────────────────────────────────────────
{
  country: 'Nigeria',
  iso3: 'NGA',
  branch: 'army',
  name: 'Nigerian Army',
  established: 1960,
  personnel: { active: 100000, reserve: 32000 },
  hq: 'Abuja',
  commander: 'Chief of Army Staff',
  majorUnits: [
    '1 Division (Kaduna)',
    '2 Division (Ibadan)',
    '3 Division (Jos)',
    '81 Division (Lagos)',
  ],
  equipment: { tanks: 148, apcs: 1500, artillery: 339, helicopters: 48 },
  missions: ['Counter-insurgency (Boko Haram)', 'Counter-banditry', 'UN peacekeeping'],
  notes: 'Personnel figures approximate — sourced 2025',
  source: 'Nigerian Army (army.mil.ng) + IISS Military Balance 2025 p.489',
  lastVerified: '2026-03',
},

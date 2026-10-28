// ─────────────────────────────────────────────────────────────
// TIMELINE TEMPLATE — timeline-data.js
// Add to the TIMELINE_CONFLICTS array.
// Base data from UCDP — ucdp.uu.se
// ─────────────────────────────────────────────────────────────

{
  id: 'country-name-year',         // unique slug e.g. 'eth-tigray-2020'
  location: 'Country (Region)',    // e.g. 'Ethiopia (Tigray)'
  region: 'Africa',                // Africa | Middle East | Europe | Asia | Americas | Oceania

  // The two main sides in the conflict
  sideA: 'Government / State actor',
  sideB: 'Opposition / Non-state actor or other state',

  conflictType: 'Internal',        // Internal | Interstate | Internationalised Internal
  incompatibility: 'Government',   // Government | Territory | Both

  startYear: 2020,                 // year conflict began
  lastYear: 2022,                  // year of last recorded violence (or current year if active)
  isActive: false,                 // true = ongoing, false = ended

  // Intensity at peak
  peakIntensity: 2,                // 1 = Minor | 2 = War (see below)
  peakLabel: 'War',                // 'Minor Armed Conflict' | 'War'

  totalDeaths: 300000,             // approximate total battle deaths — use null if unknown

  // Year-by-year intensity (include all years with violence)
  episodes: [
    { year: 2020, intensity: 2, label: 'War' },
    { year: 2021, intensity: 2, label: 'War' },
    { year: 2022, intensity: 1, label: 'Minor (ceasefire Nov 2022)' },
  ],

  description: 'Brief description of the conflict, causes, key events and outcome.',
  tags: ['civil war', 'ethnic conflict'],   // relevant tags for filtering
  source: 'UCDP Conflict Catalog v24.1',
  lastVerified: '2026-03',
},

// ── INTENSITY VALUES ──────────────────────────────────────────
// 1  Minor Armed Conflict — at least 25 but fewer than 1,000 battle deaths/year
// 2  War                  — at least 1,000 battle deaths/year

// ── CONFLICT TYPE VALUES ──────────────────────────────────────
// Internal                  Fought within one state between government and internal opposition
// Interstate                Fought between two or more states
// Internationalised Internal Internal conflict with foreign military intervention

// ── INCOMPATIBILITY VALUES ────────────────────────────────────
// Government  Who controls the government
// Territory   Control over a specific territory (secession, autonomy)
// Both        Both government control and territorial issues

// ── REGION VALUES ─────────────────────────────────────────────
// Africa | Middle East | Europe | Asia | Americas | Oceania

// ── EXAMPLE (Ethiopia Tigray) ─────────────────────────────────
{
  id: 'eth-tigray-2020',
  location: 'Ethiopia (Tigray)',
  region: 'Africa',
  sideA: 'Ethiopian Government + Eritrea',
  sideB: 'TPLF (Tigray People\'s Liberation Front)',
  conflictType: 'Internationalised Internal',
  incompatibility: 'Government',
  startYear: 2020, lastYear: 2022, isActive: false,
  peakIntensity: 2, peakLabel: 'War',
  totalDeaths: 300000,
  episodes: [
    { year: 2020, intensity: 2, label: 'War' },
    { year: 2021, intensity: 2, label: 'War' },
    { year: 2022, intensity: 1, label: 'Minor — ceasefire November 2022' },
  ],
  description: 'Armed conflict between Ethiopian federal forces (with Eritrean support) and the TPLF. Ceasefire signed November 2022. Estimated 300,000–500,000 deaths.',
  tags: ['civil war', 'humanitarian crisis', 'ethnic conflict', 'ceasefire'],
  source: 'UCDP Conflict Catalog v24.1 + ACLED',
  lastVerified: '2026-03',
},

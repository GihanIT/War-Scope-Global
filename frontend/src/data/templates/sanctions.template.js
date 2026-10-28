// ─────────────────────────────────────────────────────────────
// SANCTIONS TEMPLATE — sanctions-data.js
// Add to the SANCTIONED_COUNTRIES array.
// ─────────────────────────────────────────────────────────────

{
  iso3: 'XXX',                     // ISO 3 country code
  name: 'Country Name',
  flag: '🏳️',                     // emoji flag
  severity: 'high',                // critical | high | medium | low
  summary: 'One sentence summary of why sanctions were imposed and when.',

  sanctions: [
    // Add one block per sanction. Multiple sanctions per country are common.
    {
      id: 'xxx-us-arms',           // unique id: iso3-issuer-type
      issuer: 'US',                // UN | US | EU | UK
      type: 'arms',                // arms | financial | travel | trade | oil
      title: 'Full title of the sanction',
      imposed: '2021-02-11',       // YYYY-MM-DD
      expanded: null,              // date if expanded later, or null
      description: 'What this sanction covers and who it affects.',
      status: 'active',            // active | suspended | lifted
      legalBasis: 'Executive Order 14014 or Regulation number',
      source: 'OFAC or EU Sanctions Map URL',
    },
    // Add more sanctions for the same country
  ],

  source: 'Overall source for this country entry',
  lastVerified: '2026-03',
},

// ── SEVERITY VALUES ───────────────────────────────────────────
// critical  Comprehensive sanctions (Russia, Iran, North Korea level)
// high      Significant sanctions covering multiple domains
// medium    Targeted sanctions (arms embargo + some financial)
// low       Limited sanctions (arms embargo only, or travel bans only)

// ── ISSUER VALUES ─────────────────────────────────────────────
// UN    United Nations Security Council
// US    United States (OFAC)
// EU    European Union
// UK    United Kingdom (OFSI)

// ── TYPE VALUES ───────────────────────────────────────────────
// arms        Arms embargo — ban on weapons exports/imports
// financial   Asset freezes, bank restrictions, investment bans
// travel      Travel bans, visa restrictions on individuals
// trade       General trade restrictions, import/export bans
// oil         Oil, gas, energy-specific sanctions

// ── EXAMPLE (Myanmar) ─────────────────────────────────────────
{
  iso3: 'MMR',
  name: 'Myanmar',
  flag: '🇲🇲',
  severity: 'high',
  summary: 'Sanctions imposed following the military coup of 1 February 2021 and violent crackdown on civilians.',
  sanctions: [
    {
      id: 'mmr-us-arms',
      issuer: 'US', type: 'arms',
      title: 'Arms Embargo on Myanmar Military (Tatmadaw)',
      imposed: '2021-02-11', expanded: null,
      description: 'Prohibition on export of defence articles to Myanmar military. Suspension of military-to-military activities.',
      status: 'active',
      legalBasis: 'Executive Order 14014',
      source: 'OFAC — ofac.treasury.gov',
    },
    {
      id: 'mmr-eu-arms',
      issuer: 'EU', type: 'arms',
      title: 'EU Arms Embargo on Myanmar',
      imposed: '2021-02-22', expanded: '2022-02-21',
      description: 'Full arms embargo. Expanded in 2022 to include dual-use goods.',
      status: 'active',
      legalBasis: 'Council Decision 2021/308/CFSP',
      source: 'EU Sanctions Map — sanctionsmap.eu',
    },
  ],
  source: 'OFAC + EU Sanctions Map + UK OFSI',
  lastVerified: '2026-03',
},

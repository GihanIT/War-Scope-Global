// ─────────────────────────────────────────────────────────────
// VEHICLES TEMPLATE — vehicles-db.js
// One entry per vehicle/weapon system.
// Add to the VEHICLES array.
// ─────────────────────────────────────────────────────────────

{
  id: 'unique-vehicle-slug',       // lowercase, hyphens, unique — e.g. 'k2-black-panther'
  name: 'Vehicle Name',            // e.g. 'K2 Black Panther'
  manufacturer: 'Company Name',    // e.g. 'Hyundai Rotem'
  country: 'Country of Origin',    // e.g. 'South Korea'
  iso3: 'XXX',                     // ISO 3 code of country of origin
  type: 'Main Battle Tank',        // see type list below
  role: 'Brief description of operational role',
  status: 'Active',                // Active | In Development | Retired | Export Only
  inService: 2014,                 // year entered service — delete if unknown

  // Image — use Wikimedia Commons URL when possible (free, stable)
  // Find at: commons.wikimedia.org
  image: 'https://upload.wikimedia.org/wikipedia/commons/...',

  specs: {
    weight:   '55 tonnes',         // with unit
    length:   '10.8 m',
    width:    '3.6 m',
    height:   '2.4 m',
    crew:     3,                   // number
    speed:    '70 km/h (road)',
    range:    '450 km',
    engine:   '1,500 hp diesel',
    armament: 'Main weapon description',
    armour:   'Armour type',
    // Add or remove spec fields as relevant
  },

  // Countries that operate this vehicle
  operators: [
    { iso3: 'KOR', name: 'South Korea', quantity: 260, notes: 'Primary operator' },
    { iso3: 'POL', name: 'Poland',      quantity: 180, notes: 'On order' },
    // Add more operators
  ],

  description: 'One paragraph describing the vehicle, its significance and history.',
  source: 'REQUIRED — manufacturer specs URL + IISS or other verification',
  lastVerified: '2026-03',
},

// ── TYPE VALUES ───────────────────────────────────────────────
// Main Battle Tank             Infantry Fighting Vehicle
// Armoured Personnel Carrier   Self-Propelled Artillery
// Towed Artillery              Multiple Rocket Launcher
// Fighter Aircraft             Attack Aircraft
// Transport Aircraft           Maritime Patrol Aircraft
// Attack Helicopter            Transport Helicopter
// Destroyer                    Frigate
// Corvette                     Submarine
// Aircraft Carrier             Patrol Vessel
// UAV / Drone                  Air Defence System
// Ballistic Missile            Cruise Missile

// ── EXAMPLE ───────────────────────────────────────────────────
{
  id: 'k2-black-panther',
  name: 'K2 Black Panther',
  manufacturer: 'Hyundai Rotem',
  country: 'South Korea',
  iso3: 'KOR',
  type: 'Main Battle Tank',
  role: 'Armoured warfare, breakthrough operations',
  status: 'Active',
  inService: 2014,
  image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/K2_Black_Panther.jpg/800px-K2_Black_Panther.jpg',
  specs: {
    weight: '55 tonnes', length: '10.8 m', width: '3.6 m', height: '2.4 m',
    crew: 3, speed: '70 km/h (road)', range: '450 km',
    engine: '1,500 hp MTU 883 diesel', armament: '120mm smoothbore gun',
    armour: 'Composite + ERA + APS',
  },
  operators: [
    { iso3: 'KOR', name: 'South Korea', quantity: 260, notes: 'Primary operator' },
    { iso3: 'POL', name: 'Poland', quantity: 180, notes: 'K2PL variant on order' },
  ],
  description: 'South Korea\'s most advanced MBT. Features autoloader and active protection system.',
  source: 'Hyundai Rotem official specs + IISS Military Balance 2025',
  lastVerified: '2026-03',
},

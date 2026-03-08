// src/data/army-units-db.js

export const COUNTRIES = {
  'USA': { flag: '🇺🇸', iso3: 'USA' },
  'Russia': { flag: '🇷🇺', iso3: 'RUS' },
  'China': { flag: '🇨🇳', iso3: 'CHN' },
  'UK': { flag: '🇬🇧', iso3: 'GBR' },
  'France': { flag: '🇫🇷', iso3: 'FRA' },
  'Germany': { flag: '🇩🇪', iso3: 'DEU' },
  'Israel': { flag: '🇮🇱', iso3: 'ISR' },
  'India': { flag: '🇮🇳', iso3: 'IND' },
  'Pakistan': { flag: '🇵🇰', iso3: 'PAK' },
  'Japan': { flag: '🇯🇵', iso3: 'JPN' },
  'South Korea': { flag: '🇰🇷', iso3: 'KOR' },
  'North Korea': { flag: '🇰🇵', iso3: 'PRK' },
  'Turkey': { flag: '🇹🇷', iso3: 'TUR' },
  'Iran': { flag: '🇮🇷', iso3: 'IRN' },
  'Italy': { flag: '🇮🇹', iso3: 'ITA' },
  'Brazil': { flag: '🇧🇷', iso3: 'BRA' },
  'Australia': { flag: '🇦🇺', iso3: 'AUS' },
  'Canada': { flag: '🇨🇦', iso3: 'CAN' },
  'Egypt': { flag: '🇪🇬', iso3: 'EGY' },
  'Saudi Arabia': { flag: '🇸🇦', iso3: 'SAU' },
  'UAE': { flag: '🇦🇪', iso3: 'ARE' },
  'Poland': { flag: '🇵🇱', iso3: 'POL' },
  'Ukraine': { flag: '🇺🇦', iso3: 'UKR' },
  'Spain': { flag: '🇪🇸', iso3: 'ESP' },
  'Indonesia': { flag: '🇮🇩', iso3: 'IDN' },
  'Taiwan': { flag: '🇹🇼', iso3: 'TWN' },
  'Greece': { flag: '🇬🇷', iso3: 'GRC' },
  'Sweden': { flag: '🇸🇪', iso3: 'SWE' },
  'Norway': { flag: '🇳🇴', iso3: 'NOR' },
  'Netherlands': { flag: '🇳🇱', iso3: 'NLD' },
  'Singapore': { flag: '🇸🇬', iso3: 'SGP' },
  'Thailand': { flag: '🇹🇭', iso3: 'THA' },
  'Vietnam': { flag: '🇻🇳', iso3: 'VNM' },
  'Mexico': { flag: '🇲🇽', iso3: 'MEX' },
  'Colombia': { flag: '🇨🇴', iso3: 'COL' },
  'Argentina': { flag: '🇦🇷', iso3: 'ARG' },
  'South Africa': { flag: '🇿🇦', iso3: 'ZAF' },
  'Nigeria': { flag: '🇳🇬', iso3: 'NGA' },
  'Algeria': { flag: '🇩🇿', iso3: 'DZA' },
  'Morocco': { flag: '🇲🇦', iso3: 'MAR' },
  'Finland': { flag: '🇫🇮', iso3: 'FIN' },
  'Romania': { flag: '🇷🇴', iso3: 'ROU' },
  'Czech Republic': { flag: '🇨🇿', iso3: 'CZE' },
  'Denmark': { flag: '🇩🇰', iso3: 'DNK' },
  'Belgium': { flag: '🇧🇪', iso3: 'BEL' },
  'Portugal': { flag: '🇵🇹', iso3: 'PRT' },
  'Switzerland': { flag: '🇨🇭', iso3: 'CHE' },
  'Austria': { flag: '🇦🇹', iso3: 'AUT' },
  'Philippines': { flag: '🇵🇭', iso3: 'PHL' },
  'Bangladesh': { flag: '🇧🇩', iso3: 'BGD' },
  'Iraq': { flag: '🇮🇶', iso3: 'IRQ' },
  'Jordan': { flag: '🇯🇴', iso3: 'JOR' },
  'Myanmar': { flag: '🇲🇲', iso3: 'MMR' },
  'Ethiopia': { flag: '🇪🇹', iso3: 'ETH' }
};

export const BRANCHES = {
  'army':      { label: 'Ground Forces', color: '#4caf50' },
  'navy':      { label: 'Naval Forces', color: '#2196f3' },
  'air':       { label: 'Air Force', color: '#00d4ff' },
  'marines':   { label: 'Marine / Amphibious', color: '#00bfa5' },
  'sof':       { label: 'Special Operations', color: '#ffaa00' },
  'strategic': { label: 'Strategic Command', color: '#ff3b3b' },
  'cyber':     { label: 'Cyber & Intelligence', color: '#c084fc' },
  'space':     { label: 'Space Command', color: '#9c27b0' },
  'missile':   { label: 'Strategic Missile Forces', color: '#ff5722' },
  'coastguard': { label: 'Coast Guard', color: '#0097a7' },
  'gendarmerie': { label: 'Gendarmerie / Paramilitary', color: '#795548' }
};

export const UNITS = [

  // ═══════════════════════════════════════════
  // ───────────────── USA ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'us-dod',
    country: 'USA',
    branch: 'strategic',
    name: 'United States Department of Defense',
    nativeName: 'DoD',
    motto: 'Provide the military forces needed to deter war and ensure our nation\'s security',
    founded: '1947-09-18',
    headquarters: 'The Pentagon, Arlington, Virginia',
    strength: '2,860,000 (1,340,000 active; 800,000 reserve; 720,000 civilian)',
    type: 'Military Administration',
    role: 'Overall command and administration of the United States Armed Forces',
    commander: 'Secretary of Defense',
    currentCommander: 'Pete Hegseth (2025–present)',
    bases: ['The Pentagon'],
    equipment: [],
    budget: '$842 billion (FY2024)',
    status: 'Active',
    website: 'https://www.defense.gov',
    description:
      'The Department of Defense is the executive department of the U.S. federal government charged with coordinating and supervising all agencies and functions of the government directly related to national security and the United States Armed Forces. It is the largest employer in the world.',
    combatHistory: [
      'Cold War (1947–1991)',
      'Korean War (1950–1953)',
      'Vietnam War (1955–1975)',
      'Gulf War (1990–1991)',
      'War in Afghanistan (2001–2021)',
      'Iraq War (2003–2011)',
      'Global War on Terror (2001–present)',
      'Operation Inherent Resolve (2014–present)'
    ],
    parentId: null
  },

  {
    id: 'us-army',
    country: 'USA',
    branch: 'army',
    name: 'United States Army',
    nativeName: 'US Army',
    motto: "This We'll Defend",
    founded: '1775-06-14',
    headquarters: 'The Pentagon, Arlington, Virginia',
    strength: '452,000 active duty; 336,000 Army National Guard; 189,000 Army Reserve',
    type: 'Ground Warfare Branch',
    role: 'Land-based military operations, power projection, sustained ground combat',
    commander: 'Chief of Staff of the Army',
    currentCommander: 'Gen. Randy George (2023–present)',
    bases: ['Fort Liberty (NC)', 'Fort Cavazos (TX)', 'Fort Moore (GA)', 'Fort Campbell (KY)', 'Fort Drum (NY)', 'Fort Riley (KS)', 'Fort Stewart (GA)', 'Fort Carson (CO)', 'Joint Base Lewis-McChord (WA)', 'Schofield Barracks (HI)'],
    equipment: [
      'M1A2 SEPv3 Abrams MBT',
      'M2A3/M2A4 Bradley IFV',
      'M109A7 Paladin SPH',
      'M270A2 MLRS',
      'M142 HIMARS',
      'AH-64E Apache Guardian',
      'UH-60M Black Hawk',
      'CH-47F Chinook',
      'RQ-7B Shadow UAV',
      'MQ-1C Gray Eagle UAV',
      'Stryker ICV family',
      'M1126 Stryker',
      'JLTV (Joint Light Tactical Vehicle)',
      'Patriot PAC-3 MSE',
      'THAAD (Terminal High Altitude Area Defense)',
      'XM30 Mechanized ICV (in development)'
    ],
    budget: '$185 billion (FY2024)',
    status: 'Active',
    website: 'https://www.army.mil',
    description:
      'The United States Army is the oldest and most senior branch of the U.S. military. It is responsible for land-based military operations and is the largest branch by personnel. The Army is organized into 10 active duty divisions and maintains a global presence with forces stationed across six continents.',
    combatHistory: [
      'American Revolutionary War (1775–1783)',
      'War of 1812 (1812–1815)',
      'Mexican-American War (1846–1848)',
      'American Civil War (1861–1865)',
      'Spanish-American War (1898)',
      'World War I (1917–1918)',
      'World War II (1941–1945)',
      'Korean War (1950–1953)',
      'Vietnam War (1955–1975)',
      'Gulf War (1990–1991)',
      'War in Afghanistan (2001–2021)',
      'Iraq War (2003–2011)'
    ],
    parentId: 'us-dod'
  },

  {
    id: 'us-1st-armored',
    country: 'USA',
    branch: 'army',
    name: '1st Armored Division',
    nativeName: 'Old Ironsides',
    motto: 'Iron Soldiers',
    founded: '1940-07-15',
    headquarters: 'Fort Bliss, Texas',
    strength: '17,000',
    type: 'Armored Division',
    role: 'Heavy armored warfare, combined arms maneuver',
    commander: 'Major General',
    bases: ['Fort Bliss (TX)'],
    equipment: [
      'M1A2 SEPv3 Abrams',
      'M2A3 Bradley',
      'M109A7 Paladin',
      'M142 HIMARS',
      'AH-64E Apache'
    ],
    status: 'Active',
    description:
      'The 1st Armored Division, nicknamed "Old Ironsides," is a combined arms division of the United States Army. It was the first armored division of the U.S. Army, activated in 1940. The division has served in North Africa, Italy, Iraq, and Afghanistan.',
    combatHistory: [
      'World War II – North Africa & Italy',
      'Gulf War (1990–1991)',
      'Iraq War (2003–2011)',
      'War in Afghanistan'
    ],
    parentId: 'us-army'
  },

  {
    id: 'us-82nd-airborne',
    country: 'USA',
    branch: 'army',
    name: '82nd Airborne Division',
    nativeName: 'All American',
    motto: 'All American',
    founded: '1917-08-25',
    headquarters: 'Fort Liberty, North Carolina',
    strength: '14,000',
    type: 'Airborne Division',
    role: 'Rapid deployment, airborne assault, strategic response force',
    commander: 'Major General',
    bases: ['Fort Liberty (NC)'],
    equipment: [
      'M4A1 carbines',
      'M240 machine guns',
      'Javelin anti-tank missiles',
      'M119A3 howitzer',
      'JLTV',
      'UH-60 Black Hawk'
    ],
    status: 'Active',
    description:
      'The 82nd Airborne Division is an airborne infantry division of the United States Army specializing in joint forcible entry operations. It is the U.S. military\'s primary conventional airborne strategic response force and can deploy within 18 hours worldwide.',
    combatHistory: [
      'World War I',
      'World War II – Sicily, Normandy, Operation Market Garden, Battle of the Bulge',
      'Vietnam War',
      'Grenada (1983)',
      'Panama (1989)',
      'Gulf War (1991)',
      'War in Afghanistan',
      'Iraq War'
    ],
    parentId: 'us-army'
  },

  {
    id: 'us-101st-airborne',
    country: 'USA',
    branch: 'army',
    name: '101st Airborne Division (Air Assault)',
    nativeName: 'Screaming Eagles',
    motto: 'Rendezvous with Destiny',
    founded: '1942-08-15',
    headquarters: 'Fort Campbell, Kentucky',
    strength: '15,800',
    type: 'Air Assault Division',
    role: 'Air assault operations, rapid deployment',
    commander: 'Major General',
    bases: ['Fort Campbell (KY)'],
    equipment: [
      'UH-60 Black Hawk',
      'CH-47 Chinook',
      'AH-64 Apache',
      'M4A1 carbines',
      'Javelin',
      'JLTV'
    ],
    status: 'Active',
    description:
      'The 101st Airborne Division is the only air assault division of the United States Army. The Screaming Eagles specialize in helicopter-borne assault operations and can deploy an entire brigade combat team by helicopter within hours.',
    combatHistory: [
      'World War II – Normandy, Operation Market Garden, Battle of the Bulge',
      'Vietnam War – Battle of Hamburger Hill',
      'Gulf War',
      'War in Afghanistan',
      'Iraq War'
    ],
    parentId: 'us-army'
  },

  {
    id: 'us-navy',
    country: 'USA',
    branch: 'navy',
    name: 'United States Navy',
    nativeName: 'USN',
    motto: 'Semper Fortis (Always Courageous)',
    founded: '1775-10-13',
    headquarters: 'The Pentagon, Arlington, Virginia',
    strength: '347,000 active; 101,000 reserve',
    type: 'Naval Warfare Branch',
    role: 'Maritime warfare, power projection, sea control, deterrence',
    commander: 'Chief of Naval Operations',
    currentCommander: 'ADM Lisa Franchetti (2023–present)',
    bases: ['Naval Station Norfolk (VA)', 'Naval Base San Diego (CA)', 'Naval Station Pearl Harbor (HI)', 'Naval Station Mayport (FL)', 'Naval Base Kitsap (WA)', 'Naval Support Activity Bahrain', 'Naval Activities Japan (Yokosuka)'],
    equipment: [
      'Nimitz-class aircraft carriers (10)',
      'Gerald R. Ford-class aircraft carrier (1)',
      'Arleigh Burke-class destroyers (72)',
      'Ticonderoga-class cruisers (9)',
      'Virginia-class attack submarines (23)',
      'Ohio-class ballistic missile submarines (14)',
      'F/A-18E/F Super Hornet',
      'F-35C Lightning II',
      'E-2D Advanced Hawkeye',
      'P-8A Poseidon',
      'MH-60R/S Seahawk',
      'MQ-25 Stingray (entering service)',
      'Tomahawk cruise missiles',
      'SM-6 missiles',
      'Aegis Combat System'
    ],
    budget: '$255 billion (FY2024)',
    status: 'Active',
    website: 'https://www.navy.mil',
    description:
      'The United States Navy is the largest and most capable navy in the world. It maintains 11 aircraft carrier strike groups and can project power globally. The Navy operates a fleet of approximately 296 deployable battle force ships.',
    combatHistory: [
      'American Revolutionary War',
      'War of 1812',
      'Civil War',
      'Spanish-American War',
      'World War I',
      'World War II – Pacific and Atlantic theaters',
      'Korean War',
      'Vietnam War',
      'Gulf War',
      'War in Afghanistan',
      'Iraq War'
    ],
    parentId: 'us-dod'
  },

  {
    id: 'us-navy-seals',
    country: 'USA',
    branch: 'sof',
    name: 'United States Navy SEALs',
    nativeName: 'Navy SEALs',
    motto: 'The Only Easy Day Was Yesterday',
    founded: '1962-01-01',
    headquarters: 'Naval Amphibious Base Coronado, California',
    strength: '2,500',
    type: 'Naval Special Warfare',
    role: 'Sea, air, and land unconventional warfare; direct action; counter-terrorism; special reconnaissance',
    commander: 'Commander, Naval Special Warfare Command',
    bases: ['NAB Coronado (CA)', 'NAB Little Creek (VA)'],
    equipment: [
      'HK416',
      'Mk 13 Mod 7 sniper rifle',
      'SIG Sauer P226/P320',
      'Mk 48 machine gun',
      'SDV (SEAL Delivery Vehicle)',
      'CRRCs (Combat Rubber Raiding Craft)',
      'MH-60S/MH-47 helicopters (support)'
    ],
    status: 'Active',
    description:
      'The Navy SEALs are the U.S. Navy\'s primary special operations force. They are trained to operate in all environments (Sea, Air, and Land). SEAL teams have been central to U.S. counterterrorism operations worldwide, including the operation that killed Osama bin Laden.',
    combatHistory: [
      'Vietnam War',
      'Grenada (1983)',
      'Panama (1989)',
      'Gulf War',
      'Somalia (1993)',
      'War in Afghanistan',
      'Iraq War',
      'Operation Neptune Spear (2011)'
    ],
    parentId: 'us-socom'
  },

  {
    id: 'us-usmc',
    country: 'USA',
    branch: 'marines',
    name: 'United States Marine Corps',
    nativeName: 'USMC',
    motto: 'Semper Fidelis (Always Faithful)',
    founded: '1775-11-10',
    headquarters: 'The Pentagon, Arlington, Virginia',
    strength: '172,000 active; 33,000 reserve',
    type: 'Amphibious / Expeditionary Force',
    role: 'Amphibious operations, expeditionary warfare, rapid crisis response, power projection from the sea',
    commander: 'Commandant of the Marine Corps',
    currentCommander: 'Gen. Eric Smith (2023–present)',
    bases: ['Camp Pendleton (CA)', 'Camp Lejeune (NC)', 'MCAS Miramar (CA)', 'MCB Quantico (VA)', 'MCB Camp Butler (Okinawa, Japan)', 'MCAS Cherry Point (NC)'],
    equipment: [
      'F-35B/C Lightning II',
      'AV-8B Harrier II (retiring)',
      'MV-22B Osprey',
      'AH-1Z Viper',
      'UH-1Y Venom',
      'CH-53K King Stallion',
      'AAV-7A1 (being replaced by ACV)',
      'ACV (Amphibious Combat Vehicle)',
      'LAV-25',
      'HIMARS',
      'M777A2 howitzer',
      'JLTV',
      'NMESIS (anti-ship missile)',
      'MQ-9A Reaper'
    ],
    budget: '$52 billion (FY2024)',
    status: 'Active',
    website: 'https://www.marines.mil',
    description:
      'The USMC is a branch of the U.S. military responsible for conducting expeditionary and amphibious operations. Under Force Design 2030, the Marine Corps is transforming into a lighter, more distributed force focused on the Indo-Pacific theater, emphasizing anti-ship missiles, long-range fires, and distributed operations.',
    combatHistory: [
      'American Revolutionary War',
      'Barbary Wars',
      'Mexican-American War',
      'World War I – Belleau Wood',
      'World War II – Guadalcanal, Iwo Jima, Okinawa',
      'Korean War – Chosin Reservoir, Inchon',
      'Vietnam War – Hue, Khe Sanh',
      'Gulf War',
      'War in Afghanistan',
      'Iraq War – Fallujah'
    ],
    parentId: 'us-dod'
  },

  {
    id: 'us-usaf',
    country: 'USA',
    branch: 'air',
    name: 'United States Air Force',
    nativeName: 'USAF',
    motto: 'Aim High... Fly-Fight-Win',
    founded: '1947-09-18',
    headquarters: 'The Pentagon, Arlington, Virginia',
    strength: '325,000 active; 69,000 Air National Guard; 58,000 Air Force Reserve',
    type: 'Air Warfare Branch',
    role: 'Air superiority, global strike, rapid global mobility, ISR, cyberspace operations',
    commander: 'Chief of Staff of the Air Force',
    currentCommander: 'Gen. David Allvin (2023–present)',
    bases: ['Joint Base Andrews (MD)', 'Nellis AFB (NV)', 'Eglin AFB (FL)', 'Wright-Patterson AFB (OH)', 'Ramstein AB (Germany)', 'Kadena AB (Japan)', 'Al Udeid AB (Qatar)'],
    equipment: [
      'F-22 Raptor',
      'F-35A Lightning II',
      'F-15E/EX Strike Eagle/Eagle II',
      'F-16C/D Fighting Falcon',
      'B-2 Spirit',
      'B-1B Lancer',
      'B-52H Stratofortress',
      'B-21 Raider (entering service)',
      'C-17 Globemaster III',
      'C-130J Super Hercules',
      'KC-46A Pegasus',
      'KC-135 Stratotanker',
      'MQ-9 Reaper',
      'RQ-4 Global Hawk',
      'E-3 Sentry AWACS',
      'NGAD (Next Generation Air Dominance – in development)',
      'CCA (Collaborative Combat Aircraft – in development)',
      'Minuteman III ICBM',
      'AGM-183A ARRW (hypersonic)',
      'JASSM-ER'
    ],
    budget: '$217 billion (FY2024)',
    status: 'Active',
    website: 'https://www.af.mil',
    description:
      'The United States Air Force is the most technologically advanced air force in the world, operating over 5,200 aircraft. It is responsible for air superiority, global strike, space operations (via Space Force), and nuclear deterrence through the ICBM leg of the nuclear triad.',
    combatHistory: [
      'Korean War',
      'Vietnam War – Operation Rolling Thunder, Linebacker II',
      'Gulf War – Operation Desert Storm',
      'Kosovo War (1999)',
      'War in Afghanistan',
      'Iraq War',
      'Operation Inherent Resolve'
    ],
    parentId: 'us-dod'
  },

  {
    id: 'us-socom',
    country: 'USA',
    branch: 'sof',
    name: 'United States Special Operations Command',
    nativeName: 'USSOCOM',
    motto: 'Sine Pari (Without Equal)',
    founded: '1987-04-16',
    headquarters: 'MacDill Air Force Base, Tampa, Florida',
    strength: '70,000',
    type: 'Unified Combatant Command',
    role: 'Unified command of all U.S. special operations forces; counterterrorism, unconventional warfare, direct action, special reconnaissance, counter-proliferation',
    commander: 'Commander USSOCOM',
    currentCommander: 'Gen. Bryan Fenton (2022–present)',
    equipment: [
      'MH-60M Black Hawk (DAP)',
      'MH-47G Chinook',
      'MH-6M/AH-6M Little Bird',
      'CV-22B Osprey',
      'MC-130J Commando II',
      'AC-130J Ghostrider',
      'MQ-9 Reaper',
      'Mark V Special Operations Craft',
      'Combatant Craft Assault (CCA)',
      'DPV/LTATV vehicles'
    ],
    bases: ['MacDill AFB (FL)'],
    budget: '$13.1 billion (FY2024)',
    status: 'Active',
    website: 'https://www.socom.mil',
    description:
      'USSOCOM is the unified combatant command responsible for overseeing the various special operations component commands of the Army, Navy, Air Force, and Marine Corps. It provides fully capable special operations forces to defend the United States and its interests.',
    combatHistory: [
      'Operation Just Cause – Panama (1989)',
      'Gulf War (1991)',
      'Operation Gothic Serpent – Somalia (1993)',
      'Operation Enduring Freedom – Afghanistan (2001–2014)',
      'Operation Iraqi Freedom (2003–2011)',
      'Operation Neptune Spear (2011)',
      'Operation Inherent Resolve (2014–present)',
      'Raid on al-Baghdadi (2019)'
    ],
    parentId: 'us-dod'
  },

  {
    id: 'us-delta',
    country: 'USA',
    branch: 'sof',
    name: '1st Special Forces Operational Detachment-Delta',
    nativeName: 'Delta Force / CAG (Combat Applications Group)',
    motto: '',
    founded: '1977-11-19',
    headquarters: 'Fort Liberty, North Carolina',
    strength: '~1,000 (estimated, classified)',
    type: 'Tier 1 Special Mission Unit',
    role: 'Counterterrorism, hostage rescue, direct action, special reconnaissance, national intervention operations',
    commander: 'Classified',
    bases: ['Fort Liberty (NC) – classified compound'],
    equipment: [
      'HK416 assault rifle',
      'SIG Sauer MCX',
      'Glock 19/17',
      'SIG Sauer P320-M17/M18',
      'Mk 17 SCAR-H',
      'HK MP7',
      'Barrett M82/M107 sniper rifle',
      'MH-6M/AH-6M Little Bird (160th SOAR)',
      'Modified vehicles (technical trucks, SUVs)',
      'Night vision & thermal optics'
    ],
    status: 'Active',
    description:
      'Delta Force is the United States Army\'s premier Tier 1 special mission unit. Modeled after the British SAS, Delta specializes in counterterrorism, hostage rescue, and direct action operations against high-value targets. Its existence is not officially acknowledged by the U.S. government. Operators are recruited from the 75th Ranger Regiment and Army Special Forces (Green Berets).',
    combatHistory: [
      'Operation Eagle Claw – Iran hostage rescue attempt (1980)',
      'Invasion of Grenada (1983)',
      'Invasion of Panama (1989)',
      'Battle of Mogadishu – Somalia (1993)',
      'Operation Enduring Freedom – Afghanistan',
      'Operation Iraqi Freedom',
      'Hunt for Abu Musab al-Zarqawi (2006)',
      'Operation Kayla Mueller – al-Baghdadi raid (2019)'
    ],
    parentId: 'us-socom'
  },

  {
    id: 'us-75th-rangers',
    country: 'USA',
    branch: 'sof',
    name: '75th Ranger Regiment',
    nativeName: 'Rangers',
    motto: 'Rangers Lead the Way',
    founded: '1974-10-03',
    headquarters: 'Fort Moore, Georgia',
    strength: '3,600',
    type: 'Special Operations Light Infantry',
    role: 'Direct action raids, airfield seizure, personnel recovery, special reconnaissance',
    commander: 'Colonel',
    bases: ['Fort Moore (GA)', 'Joint Base Lewis-McChord (WA)', 'Fort Liberty (NC)'],
    equipment: [
      'M4A1 SOPMOD Block II',
      'Mk 17 SCAR-H',
      'M110 SASS',
      'Carl Gustaf recoilless rifle',
      'Javelin anti-tank missile',
      'Stryker vehicles (Ranger variants)',
      'GMV 1.1 ground mobility vehicle'
    ],
    status: 'Active',
    description:
      'The 75th Ranger Regiment is a premier light infantry unit and special operations force. Rangers are capable of conducting large-scale joint forcible entry operations and are often the first conventional force on the ground in a conflict zone. The regiment consists of three Ranger battalions and a Special Troops Battalion.',
    combatHistory: [
      'World War II – D-Day, Pointe du Hoc',
      'Invasion of Grenada (1983)',
      'Invasion of Panama (1989)',
      'Battle of Mogadishu (1993)',
      'War in Afghanistan – Roberts Ridge',
      'Iraq War'
    ],
    parentId: 'us-socom'
  },

  {
    id: 'us-green-berets',
    country: 'USA',
    branch: 'sof',
    name: 'United States Army Special Forces',
    nativeName: 'Green Berets',
    motto: 'De Oppresso Liber (To Free the Oppressed)',
    founded: '1952-06-19',
    headquarters: 'Fort Liberty, North Carolina',
    strength: '~7,000',
    type: 'Special Forces',
    role: 'Unconventional warfare, foreign internal defense, direct action, counter-insurgency, special reconnaissance',
    commander: 'Commanding General, 1st Special Forces Command',
    bases: ['Fort Liberty (NC)', 'Fort Campbell (KY)', 'Fort Carson (CO)', 'Joint Base Lewis-McChord (WA)', 'Okinawa (Japan)', 'Panzer Kaserne (Germany)'],
    equipment: [
      'M4A1 SOPMOD',
      'HK416',
      'Mk 17 SCAR-H',
      'M110 sniper system',
      'GMV 1.1',
      'Non-standard weapons (captured enemy equipment for UW)'
    ],
    status: 'Active',
    description:
      'The Green Berets are the United States Army\'s premier unconventional warfare force. Organized into 5 active duty and 2 National Guard Special Forces Groups, they specialize in training, advising, and leading indigenous forces in guerrilla warfare and counter-insurgency. Each 12-man Operational Detachment Alpha (ODA) is cross-trained in weapons, engineering, communications, and medicine.',
    combatHistory: [
      'Vietnam War',
      'El Salvador (1980s)',
      'Gulf War',
      'Somalia (1993)',
      'War in Afghanistan – Horse Soldiers (2001)',
      'Iraq War',
      'Operation Inherent Resolve – Syria',
      'Africa operations (Niger, Somalia, etc.)'
    ],
    parentId: 'us-socom'
  },

  {
    id: 'us-spacecom',
    country: 'USA',
    branch: 'space',
    name: 'United States Space Force',
    nativeName: 'USSF',
    motto: 'Semper Supra (Always Above)',
    founded: '2019-12-20',
    headquarters: 'The Pentagon, Arlington, Virginia',
    strength: '8,600 Guardians',
    type: 'Space Warfare Branch',
    role: 'Space domain awareness, satellite operations, missile warning, space control, nuclear deterrence support',
    commander: 'Chief of Space Operations',
    currentCommander: 'Gen. B. Chance Saltzman (2022–present)',
    bases: ['Peterson SFB (CO)', 'Vandenberg SFB (CA)', 'Patrick SFB (FL)', 'Buckley SFB (CO)', 'Schriever SFB (CO)', 'Cape Canaveral SFS (FL)'],
    equipment: [
      'GPS III satellites',
      'Space-Based Infrared System (SBIRS)',
      'Advanced Extremely High Frequency (AEHF) satellites',
      'X-37B orbital test vehicle',
      'Space Fence radar system',
      'Ground-Based Electro-Optical Deep Space Surveillance (GEODSS)',
      'Space Launch Complex operations'
    ],
    budget: '$30 billion (FY2024)',
    status: 'Active',
    website: 'https://www.spaceforce.mil',
    description:
      'The United States Space Force is the newest branch of the U.S. Armed Forces, established in December 2019. It organizes, trains, and equips space forces to protect U.S. and allied interests in space and provide space capabilities to the joint force. The USSF operates satellites for communications, navigation, missile warning, and surveillance.',
    combatHistory: [],
    parentId: 'us-dod'
  },

  {
    id: 'us-cybercom',
    country: 'USA',
    branch: 'cyber',
    name: 'United States Cyber Command',
    nativeName: 'USCYBERCOM',
    motto: '',
    founded: '2009-06-23',
    headquarters: 'Fort Meade, Maryland',
    strength: '6,200+',
    type: 'Unified Combatant Command',
    role: 'Cyberspace operations, defense of DoD networks, offensive cyber operations',
    commander: 'Commander USCYBERCOM / Director NSA',
    currentCommander: 'Gen. Timothy Haugh (2024–present)',
    bases: ['Fort Meade (MD)'],
    equipment: [
      'Cyber Mission Force teams',
      'Unified Platform',
      'Joint Cyber Warfighting Architecture (JCWA)'
    ],
    status: 'Active',
    description:
      'USCYBERCOM directs, synchronizes, and coordinates cyberspace planning and operations to defend and advance national interests. It commands the Cyber National Mission Force and service cyber components from all branches. USCYBERCOM is dual-hatted with the National Security Agency (NSA).',
    combatHistory: [
      'Operation Glowing Symphony (vs. ISIS, 2016)',
      'Various classified offensive and defensive cyber operations'
    ],
    parentId: 'us-dod'
  },

  {
    id: 'us-coastguard',
    country: 'USA',
    branch: 'coastguard',
    name: 'United States Coast Guard',
    nativeName: 'USCG',
    motto: 'Semper Paratus (Always Ready)',
    founded: '1790-08-04',
    headquarters: 'Washington, D.C.',
    strength: '42,000 active; 7,000 reserve; 8,500 civilian',
    type: 'Maritime Law Enforcement / Military Branch',
    role: 'Maritime law enforcement, search and rescue, port security, drug interdiction, environmental protection',
    commander: 'Commandant of the Coast Guard',
    bases: ['USCG Base Kodiak (AK)', 'USCG Base Elizabeth City (NC)', 'USCG Base Miami (FL)'],
    equipment: [
      'Legend-class National Security Cutter',
      'Heritage-class Offshore Patrol Cutter',
      'Sentinel-class Fast Response Cutter',
      'HC-130J Super Hercules',
      'MH-60T Jayhawk',
      'MH-65 Dolphin',
      'HC-144 Ocean Sentry'
    ],
    status: 'Active',
    description:
      'The U.S. Coast Guard is a unique military branch that operates under the Department of Homeland Security during peacetime and can be transferred to the Department of the Navy during wartime. It is the primary maritime law enforcement agency of the United States.',
    combatHistory: [
      'World War I',
      'World War II – Battle of the Atlantic, Pacific',
      'Vietnam War – Operation Market Time',
      'Gulf War',
      'War on Terror'
    ],
    parentId: 'us-dod'
  },

  // ═══════════════════════════════════════════
  // ───────────────── RUSSIA ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'ru-mod',
    country: 'Russia',
    branch: 'strategic',
    name: 'Ministry of Defence of the Russian Federation',
    nativeName: 'Министерство обороны Российской Федерации',
    motto: '',
    founded: '1992-03-16',
    headquarters: 'Moscow, Russia',
    strength: '1,320,000 active; 2,000,000 reserve',
    type: 'Military Administration',
    role: 'Command, administration, and policy of the Russian Armed Forces',
    commander: 'Minister of Defence',
    currentCommander: 'Andrey Belousov (2024–present)',
    bases: ['National Defense Management Center, Moscow'],
    equipment: [],
    budget: '~$109 billion (2024 estimate, official + supplementary)',
    status: 'Active',
    description:
      'The Ministry of Defence oversees all branches of the Russian Armed Forces including the Ground Forces, Navy, Aerospace Forces, Strategic Missile Forces, and Airborne Forces. Following losses in the Russo-Ukrainian War, Russia has undergone significant military restructuring and mobilization since 2022.',
    combatHistory: [
      'First Chechen War (1994–1996)',
      'Second Chechen War (1999–2009)',
      'Russo-Georgian War (2008)',
      'Annexation of Crimea (2014)',
      'Syrian Civil War intervention (2015–present)',
      'Russo-Ukrainian War (2022–present)'
    ],
    parentId: null
  },

  {
    id: 'ru-ground',
    country: 'Russia',
    branch: 'army',
    name: 'Russian Ground Forces',
    nativeName: 'Сухопутные войска Российской Федерации',
    motto: '',
    founded: '1992-05-07',
    headquarters: 'Moscow',
    strength: '550,000 (2024 estimate)',
    type: 'Ground Warfare Branch',
    role: 'Land warfare, territorial defense, combined arms maneuver',
    commander: 'Commander-in-Chief of the Russian Ground Forces',
    currentCommander: 'Gen. Oleg Salyukov (2014–present)',
    bases: ['Multiple military districts across Russia'],
    equipment: [
      'T-90M Proryv MBT',
      'T-80BVM MBT',
      'T-72B3 MBT',
      'T-14 Armata (limited production)',
      'BMP-3 IFV',
      'BMP-2M IFV',
      'BTR-82A APC',
      'Kurganets-25 IFV (limited)',
      'BM-21 Grad MLRS',
      'BM-27 Uragan MLRS',
      'BM-30 Smerch MLRS',
      'Tornado-G/S MLRS',
      '2S19 Msta-S SPH',
      '2S35 Koalitsiya-SV SPH',
      'Iskander-M tactical ballistic missile',
      'S-300V4 air defense',
      'Buk-M3 air defense',
      'Tor-M2 air defense',
      'Ka-52 Alligator',
      'Mi-28N Night Hunter',
      'Mi-35M',
      'Mi-8AMTSh'
    ],
    status: 'Active',
    description:
      'The Russian Ground Forces are the land branch of the Russian Armed Forces. They have been heavily engaged in the Russo-Ukrainian War since 2022, suffering significant equipment and personnel losses while also receiving new modernized equipment and mobilized personnel.',
    combatHistory: [
      'First Chechen War (1994–1996)',
      'Second Chechen War (1999–2009)',
      'Russo-Georgian War (2008)',
      'Syrian Civil War (2015–present)',
      'Russo-Ukrainian War (2022–present)'
    ],
    parentId: 'ru-mod'
  },

  {
    id: 'ru-vdv',
    country: 'Russia',
    branch: 'army',
    name: 'Russian Airborne Forces',
    nativeName: 'Воздушно-десантные войска (ВДВ)',
    motto: 'Nobody But Us (Никто кроме нас)',
    founded: '1930-08-02',
    headquarters: 'Moscow',
    strength: '45,000',
    type: 'Airborne Rapid Deployment Force',
    role: 'Airborne assault, rapid deployment, deep rear operations, power projection',
    commander: 'Commander VDV',
    currentCommander: 'Col. Gen. Mikhail Teplinsky (2022–present)',
    bases: ['Tula', 'Pskov', 'Ryazan', 'Ivanovo', 'Ulyanovsk', 'Novorossiysk'],
    equipment: [
      'BMD-4M airborne IFV',
      'BTR-MDM Rakushka APC',
      'BTR-D',
      'BMD-2',
      'Sprut-SDM1 self-propelled anti-tank gun',
      '2S9 Nona SPM',
      'Kornet ATGM',
      'D-30 howitzer',
      'Verba MANPADS',
      'Il-76 transport aircraft (for paradrop)',
      'Mi-8AMTSh helicopters'
    ],
    status: 'Active',
    description:
      'The Russian Airborne Forces (VDV) are an elite rapid-deployment force that operates as an independent branch directly subordinate to the General Staff, not the Ground Forces. Known for their blue berets and striped telnyashka undershirts, the VDV are considered Russia\'s most combat-ready conventional force. They have suffered significant casualties in the Russo-Ukrainian War.',
    combatHistory: [
      'Soviet-Afghan War (1979–1989)',
      'First Chechen War (1994–1996)',
      'Second Chechen War (1999–2009)',
      'Russo-Georgian War (2008)',
      'Annexation of Crimea (2014)',
      'Russo-Ukrainian War (2022–present) – Battle of Hostomel Airport'
    ],
    parentId: 'ru-mod'
  },

  {
    id: 'ru-navy',
    country: 'Russia',
    branch: 'navy',
    name: 'Russian Navy',
    nativeName: 'Военно-Морской Флот Российской Федерации (ВМФ)',
    motto: '',
    founded: '1696',
    headquarters: 'Saint Petersburg (Main Admiralty)',
    strength: '150,000',
    type: 'Naval Warfare Branch',
    role: 'Naval warfare, strategic nuclear deterrence (submarine-based), sea denial, power projection',
    commander: 'Commander-in-Chief of the Russian Navy',
    currentCommander: 'Adm. Alexander Moiseyev (2024–present)',
    bases: ['Severomorsk (Northern Fleet)', 'Vladivostok (Pacific Fleet)', 'Sevastopol (Black Sea Fleet)', 'Baltiysk (Baltic Fleet)', 'Kaspiysk (Caspian Flotilla)'],
    equipment: [
      'Admiral Kuznetsov aircraft carrier (under repair)',
      'Kirov-class battlecruiser – Admiral Nakhimov (refitting)',
      'Slava-class cruisers',
      'Admiral Gorshkov-class frigates',
      'Admiral Grigorovich-class frigates',
      'Steregushchiy-class corvettes',
      'Borei-A class SSBN (Bulava SLBM)',
      'Yasen-M class SSGN (Kalibr/Zircon)',
      'Kilo-class diesel submarines',
      'Kalibr cruise missiles',
      '3M22 Zircon hypersonic missile',
      'P-800 Oniks anti-ship missile',
      'Su-33 carrier fighters',
      'Ka-27/Ka-29 helicopters'
    ],
    status: 'Active',
    description:
      'The Russian Navy is organized into five fleets: Northern, Pacific, Black Sea, Baltic, and Caspian. It maintains Russia\'s sea-based nuclear deterrent through its fleet of ballistic missile submarines. The Black Sea Fleet has suffered significant losses during the Russo-Ukrainian War, including the flagship Moskva.',
    combatHistory: [
      'Russo-Japanese War (1904–1905)',
      'World War I',
      'World War II – Great Patriotic War',
      'Cold War',
      'Russo-Georgian War (2008)',
      'Syrian Civil War – cruise missile strikes',
      'Russo-Ukrainian War (2022–present) – loss of Moskva'
    ],
    parentId: 'ru-mod'
  },

  {
    id: 'ru-aerospace',
    country: 'Russia',
    branch: 'air',
    name: 'Russian Aerospace Forces',
    nativeName: 'Воздушно-космические силы (ВКС)',
    motto: '',
    founded: '2015-08-01',
    headquarters: 'Moscow',
    strength: '165,000',
    type: 'Aerospace Warfare Branch',
    role: 'Air superiority, ground attack, strategic bombing, missile defense, space operations',
    commander: 'Commander-in-Chief of the VKS',
    currentCommander: 'Gen. Viktor Afzalov (2024–present)',
    bases: ['Multiple air bases across Russia'],
    equipment: [
      'Su-57 Felon (5th gen, limited numbers)',
      'Su-35S Flanker-E',
      'Su-34 Fullback (fighter-bomber)',
      'Su-30SM Flanker-H',
      'Su-25SM3 Frogfoot (CAS)',
      'MiG-31BM Foxhound (interceptor)',
      'MiG-29SMT Fulcrum',
      'Tu-160M Blackjack (strategic bomber)',
      'Tu-95MSM Bear (strategic bomber)',
      'Tu-22M3M Backfire (long-range bomber)',
      'A-50U AWACS',
      'Il-76MD-90A transport',
      'S-400 Triumf air defense system',
      'S-350 Vityaz',
      'S-500 Prometey (entering service)',
      'Pantsir-S1/S2 SHORAD',
      'Kh-101/102 cruise missiles',
      'Kinzhal hypersonic missile (MiG-31 launched)'
    ],
    status: 'Active',
    description:
      'The Russian Aerospace Forces were formed in 2015 by merging the Russian Air Force and Aerospace Defence Forces. The VKS is responsible for air operations, air and missile defense, space surveillance, and military space operations. It has been heavily committed in both the Syrian intervention and the Russo-Ukrainian War.',
    combatHistory: [
      'Syrian Civil War (2015–present) – major air campaign',
      'Russo-Ukrainian War (2022–present)'
    ],
    parentId: 'ru-mod'
  },

  {
    id: 'ru-strategic-missile',
    country: 'Russia',
    branch: 'missile',
    name: 'Strategic Missile Forces',
    nativeName: 'Ракетные войска стратегического назначения (РВСН)',
    motto: '',
    founded: '1959-12-17',
    headquarters: 'Vlasikha, Moscow Oblast',
    strength: '50,000',
    type: 'Strategic Nuclear Force',
    role: 'Operation and maintenance of Russia\'s land-based intercontinental ballistic missile arsenal; nuclear deterrence',
    commander: 'Commander of the Strategic Missile Forces',
    currentCommander: 'Lt. Gen. Sergey Karakayev (2010–present)',
    bases: ['Kozelsk', 'Tatishchevo', 'Novosibirsk', 'Barnaul', 'Irkutsk', 'Yoshkar-Ola', 'Teykovo', 'Nizhniy Tagil'],
    equipment: [
      'RS-28 Sarmat (SS-X-30 Satan II) – entering service',
      'RS-24 Yars (SS-27 Mod 2) – MIRV ICBM',
      'RT-2PM2 Topol-M (SS-27) – single warhead ICBM',
      'RS-12M Topol (SS-25 Sickle) – being retired',
      'Avangard hypersonic glide vehicle',
      'Mobile ICBM launchers (TELs)',
      'Silo-based ICBM complexes'
    ],
    status: 'Active',
    description:
      'The Strategic Missile Forces are the land-based component of Russia\'s nuclear triad. They operate approximately 300+ ICBMs with over 1,000 nuclear warheads. The force is currently modernizing with the RS-28 Sarmat heavy ICBM and the Avangard hypersonic glide vehicle, which can carry nuclear warheads at Mach 20+.',
    combatHistory: [],
    parentId: 'ru-mod'
  },

  {
    id: 'ru-spetsnaz',
    country: 'Russia',
    branch: 'sof',
    name: 'Spetsnaz GRU',
    nativeName: 'Спецназ ГРУ',
    motto: '',
    founded: '1950',
    headquarters: 'Moscow (GRU HQ)',
    strength: '~15,000',
    type: 'Military Intelligence Special Forces',
    role: 'Special reconnaissance, sabotage, direct action, unconventional warfare, assassination',
    commander: 'GRU Director',
    bases: ['Multiple locations across military districts'],
    equipment: [
      'AK-12/AK-15',
      'AS Val suppressed rifle',
      'VSS Vintorez sniper rifle',
      'SV-98 sniper rifle',
      'RPG-29',
      'Kornet ATGM',
      'Various Western captured equipment'
    ],
    status: 'Active',
    description:
      'Spetsnaz GRU are the special purpose forces of Russia\'s military intelligence directorate (GRU). They are distinct from FSB special forces (Alpha, Vympel). Spetsnaz GRU units specialize in deep reconnaissance behind enemy lines, sabotage, and unconventional warfare. They played key roles in the annexation of Crimea (the "little green men") and have been heavily involved in Ukraine.',
    combatHistory: [
      'Soviet-Afghan War (1979–1989)',
      'First & Second Chechen Wars',
      'Annexation of Crimea (2014) – "Little Green Men"',
      'War in Donbas (2014–2022)',
      'Syrian Civil War',
      'Russo-Ukrainian War (2022–present)'
    ],
    parentId: 'ru-mod'
  },

  {
    id: 'ru-alpha',
    country: 'Russia',
    branch: 'sof',
    name: 'Alpha Group',
    nativeName: 'Группа «Альфа» / Управление «А» ФСБ',
    motto: '',
    founded: '1974-07-29',
    headquarters: 'Moscow',
    strength: '~700 (estimated)',
    type: 'Tier 1 Counter-Terrorism Unit',
    role: 'Counter-terrorism, hostage rescue, VIP protection, special operations',
    commander: 'Classified (FSB Special Purpose Center)',
    bases: ['Moscow', 'Regional detachments'],
    equipment: [
      'AK-12',
      'AS Val',
      'PP-2000 submachine gun',
      'SIG Sauer P226',
      'Orsis T-5000 sniper rifle',
      'Specialized breaching equipment',
      'Advanced body armor systems'
    ],
    status: 'Active',
    description:
      'Alpha Group (Directorate "A" of the FSB Special Purpose Center) is Russia\'s premier counter-terrorism unit, equivalent to the British SAS or American Delta Force. Created during the Soviet era by the KGB, Alpha has been involved in nearly every major Russian counter-terrorism operation. They stormed the Beslan school and the Moscow theater during hostage crises.',
    combatHistory: [
      'Soviet-Afghan War',
      'Moscow White House crisis (1993)',
      'First Chechen War – Budyonnovsk hostage crisis (1995)',
      'Moscow theater hostage crisis (2002)',
      'Beslan school siege (2004)',
      'Various counter-terrorism operations'
    ],
    parentId: 'ru-mod'
  },

  // ═══════════════════════════════════════════
  // ───────────────── CHINA ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'cn-cmc',
    country: 'China',
    branch: 'strategic',
    name: 'Central Military Commission',
    nativeName: '中央军事委员会 (中央军委)',
    motto: 'Serve the People',
    founded: '1949-10-01',
    headquarters: 'Bayi Building, Beijing',
    strength: '2,035,000 active; 510,000 reserve; 660,000 People\'s Armed Police',
    type: 'Supreme Military Command',
    role: 'Supreme command authority of the People\'s Liberation Army and all Chinese armed forces',
    commander: 'Chairman of the Central Military Commission',
    currentCommander: 'Xi Jinping (2012–present)',
    bases: ['Bayi Building, Beijing'],
    equipment: [],
    budget: '$296 billion (2024 estimate, SIPRI; official figure: $231 billion)',
    status: 'Active',
    description:
      'The Central Military Commission (CMC) is the highest military command authority in China, controlling the People\'s Liberation Army (PLA), People\'s Armed Police, and militia forces. Under Xi Jinping, the PLA has undergone the most significant restructuring since the 1950s, reorganizing from seven military regions into five theater commands in 2016.',
    combatHistory: [
      'Chinese Civil War (1927–1949)',
      'Korean War (1950–1953)',
      'First Taiwan Strait Crisis (1954–1955)',
      'Sino-Indian War (1962)',
      'Sino-Soviet border conflict (1969)',
      'Sino-Vietnamese War (1979)'
    ],
    parentId: null
  },

  {
    id: 'cn-pla-ground',
    country: 'China',
    branch: 'army',
    name: 'PLA Ground Force',
    nativeName: '中国人民解放军陆军',
    motto: '',
    founded: '1927-08-01',
    headquarters: 'Beijing',
    strength: '975,000',
    type: 'Ground Warfare Branch',
    role: 'Land warfare, territorial defense, combined arms maneuver, amphibious operations support',
    commander: 'Commander of the PLA Ground Force',
    bases: ['Distributed across five theater commands'],
    equipment: [
      'Type 99A MBT',
      'Type 96B MBT',
      'Type 15 light tank',
      'ZBD-04A IFV',
      'ZBL-09 IFV (8x8)',
      'Type 05 amphibious IFV',
      'PLZ-05 155mm SPH',
      'PHL-03 MLRS',
      'PHL-16 MLRS',
      'HJ-10 anti-tank missile',
      'HQ-17A SHORAD',
      'Z-10 attack helicopter',
      'Z-19 armed reconnaissance helicopter',
      'Z-20 utility helicopter',
      'WZ-7 Soaring Dragon UAV',
      'GJ-11 stealth combat drone'
    ],
    status: 'Active',
    description:
      'The PLA Ground Force is the largest standing army in the world by personnel. It has undergone extensive modernization, transitioning from a quantity-focused infantry army to a mechanized and information-enabled force. The PLAGF is organized into 13 combined arms group armies across five theater commands.',
    combatHistory: [
      'Chinese Civil War',
      'Korean War',
      'Sino-Indian War (1962)',
      'Sino-Vietnamese War (1979)'
    ],
    parentId: 'cn-cmc'
  },

  {
    id: 'cn-plan',
    country: 'China',
    branch: 'navy',
    name: 'PLA Navy',
    nativeName: '中国人民解放军海军',
    motto: '',
    founded: '1949-04-23',
    headquarters: 'Beijing',
    strength: '260,000',
    type: 'Naval Warfare Branch',
    role: 'Maritime defense, power projection, sea control, anti-access/area denial (A2/AD), nuclear deterrence (submarine)',
    commander: 'Commander of the PLA Navy',
    currentCommander: 'Adm. Dong Jun (2021–2023), successor pending',
    bases: ['Qingdao (North Sea Fleet)', 'Ningbo (East Sea Fleet)', 'Zhanjiang (South Sea Fleet)', 'Yulin Naval Base (Hainan – submarine base)'],
    equipment: [
      'Fujian (Type 003) aircraft carrier (EMALS catapults, fitting out)',
      'Shandong (Type 002) aircraft carrier',
      'Liaoning (Type 001) aircraft carrier',
      'Type 055 Renhai-class cruiser/destroyer (12,000 tons)',
      'Type 052D Luyang III-class destroyer',
      'Type 054A/B Jiangkai-class frigate',
      'Type 056A Jiangdao-class corvette',
      'Type 075 Yushen-class LHD (amphibious assault)',
      'Type 071 Yuzhao-class LPD',
      'Type 094A Jin-class SSBN (JL-3 SLBM)',
      'Type 096 SSBN (in development)',
      'Type 093B Shang-class SSN',
      'Type 095 SSN (in development)',
      'Type 039C Yuan-class SSK (AIP)',
      'J-15 carrier fighter',
      'J-35 (FC-31) stealth carrier fighter (entering service)',
      'Z-20F naval helicopter',
      'YJ-21 hypersonic anti-ship ballistic missile',
      'YJ-18 anti-ship cruise missile',
      'HQ-9B naval air defense'
    ],
    status: 'Active',
    description:
      'The PLA Navy has undergone the most rapid naval expansion in modern history. By hull count, it is now the world\'s largest navy (~370 combat ships). China has launched three aircraft carriers and is building a massive fleet of advanced destroyers, frigates, and submarines. The PLAN is focused on potential operations around Taiwan and control of the South China Sea.',
    combatHistory: [
      'Battle of Yijiangshan Islands (1955)',
      'Paracel Islands skirmish (1974)',
      'Johnson South Reef skirmish with Vietnam (1988)',
      'Third Taiwan Strait Crisis (1995–1996)'
    ],
    parentId: 'cn-cmc'
  },

  {
    id: 'cn-plaaf',
    country: 'China',
    branch: 'air',
    name: 'PLA Air Force',
    nativeName: '中国人民解放军空军',
    motto: '',
    founded: '1949-11-11',
    headquarters: 'Beijing',
    strength: '395,000',
    type: 'Air Warfare Branch',
    role: 'Air superiority, ground attack, strategic bombing, airborne operations, air defense',
    commander: 'Commander of the PLAAF',
    bases: ['Multiple air bases across China'],
    equipment: [
      'J-20 Mighty Dragon (5th gen stealth fighter)',
      'J-16 multirole fighter',
      'J-10C Vigorous Dragon',
      'J-11B/D Flanker variant',
      'Su-35S (imported from Russia)',
      'Su-30MKK',
      'H-6K/N strategic bomber (can carry CJ-20 ALCM, DF-21 ASBM)',
      'H-20 stealth bomber (in development)',
      'Y-20 Kunpeng transport',
      'KJ-500 AWACS',
      'KJ-2000 AWACS',
      'GJ-11 Sharp Sword stealth UCAV',
      'WZ-7 Soaring Dragon HALE UAV',
      'CH-7 stealth drone',
      'HQ-9B SAM',
      'S-400 (imported from Russia)',
      'PL-15 beyond-visual-range AAM',
      'PL-21 very-long-range AAM',
      'CJ-10 cruise missile'
    ],
    status: 'Active',
    description:
      'The PLA Air Force is the largest air force in Asia and third largest in the world. It is rapidly modernizing with 5th-generation stealth fighters (J-20), advanced UAVs, and long-range precision strike capabilities. The PLAAF is transitioning from a territorial defense force to one capable of offensive operations and power projection, with a focus on a potential Taiwan contingency.',
    combatHistory: [
      'Korean War – MiG Alley',
      'First Taiwan Strait Crisis (1954)',
      'Second Taiwan Strait Crisis (1958)',
      'Sino-Vietnamese border conflicts (1979)'
    ],
    parentId: 'cn-cmc'
  },

  {
    id: 'cn-pla-marines',
    country: 'China',
    branch: 'marines',
    name: 'PLA Marine Corps',
    nativeName: '中国人民解放军海军陆战队',
    motto: '',
    founded: '1953',
    headquarters: 'Zhanjiang, Guangdong',
    strength: '40,000',
    type: 'Amphibious / Expeditionary Force',
    role: 'Amphibious assault, island seizure, expeditionary operations, overseas base security',
    commander: 'Commander of the PLAN Marine Corps',
    bases: ['Zhanjiang', 'Djibouti (overseas base)'],
    equipment: [
      'Type 05 amphibious IFV',
      'ZBD-05 amphibious assault vehicle',
      'Type 15 light tank',
      'PLZ-07B SPH',
      'HJ-10 ATGM',
      'Z-8/Z-20 helicopters'
    ],
    status: 'Active',
    description:
      'The PLA Marine Corps was massively expanded from ~10,000 to ~40,000 troops in 2017 as part of China\'s military reforms. They are trained for amphibious assault operations and are considered critical for any potential Taiwan invasion scenario. They also guard China\'s first overseas military base in Djibouti.',
    combatHistory: [],
    parentId: 'cn-cmc'
  },

  {
    id: 'cn-rocket-force',
    country: 'China',
    branch: 'missile',
    name: 'PLA Rocket Force',
    nativeName: '中国人民解放军火箭军 (PLARF)',
    motto: '',
    founded: '2015-12-31 (successor to Second Artillery Corps, est. 1966)',
    headquarters: 'Qinghe, Beijing',
    strength: '120,000',
    type: 'Strategic & Conventional Missile Force',
    role: 'Nuclear deterrence, conventional precision strike, anti-ship ballistic missiles, strategic missile operations',
    commander: 'Commander PLARF',
    currentCommander: 'Gen. Wang Houbin (2023–present)',
    bases: ['Multiple missile bases across China (6 base-level units)'],
    equipment: [
      'DF-41 ICBM (MIRV capable, 12,000-15,000 km range)',
      'DF-5B ICBM (silo-based, MIRV)',
      'DF-31AG ICBM (road-mobile)',
      'DF-26 IRBM ("Guam Killer" / anti-ship capable)',
      'DF-21D MRBM ("Carrier Killer" anti-ship ballistic missile)',
      'DF-17 hypersonic glide vehicle',
      'DF-27 hypersonic missile (reported)',
      'CJ-100 cruise missile',
      'DF-16 SRBM',
      'DF-15B SRBM'
    ],
    budget: 'Classified',
    status: 'Active',
    description:
      'The PLA Rocket Force controls China\'s land-based nuclear and conventional missile forces. China is undergoing the most rapid nuclear buildup in its history, with an estimated 500+ nuclear warheads (projected to reach 1,000+ by 2030 per U.S. DoD estimates). The PLARF has been rocked by a corruption scandal in 2023-2024, leading to the purge of senior leaders including former commanders.',
    combatHistory: [
      'Third Taiwan Strait Crisis (1995–1996) – missile tests'
    ],
    parentId: 'cn-cmc'
  },

  {
    id: 'cn-ssf',
    country: 'China',
    branch: 'cyber',
    name: 'PLA Information Support Force',
    nativeName: '信息支援部队 (formerly Strategic Support Force 战略支援部队)',
    motto: '',
    founded: '2024-04-19 (successor to SSF, est. 2015)',
    headquarters: 'Beijing',
    strength: '175,000+ (estimated)',
    type: 'Cyber / Electronic Warfare / Information Operations',
    role: 'Cyber warfare, electronic warfare, information operations, psychological operations',
    commander: 'Commander, Information Support Force',
    bases: ['Multiple classified facilities'],
    equipment: [
      'Cyber warfare platforms',
      'Electronic warfare systems',
      'Information operations capabilities',
      'AI-enabled systems'
    ],
    status: 'Active',
    description:
      'In April 2024, the PLA Strategic Support Force was dissolved and reorganized into three new entities: the Information Support Force, the Cyberspace Force, and the Aerospace Force. The Information Support Force handles network information systems and data support. This restructuring was partly driven by the anti-corruption campaign that affected the SSF\'s leadership.',
    combatHistory: [],
    parentId: 'cn-cmc'
  },

  // ═══════════════════════════════════════════
  // ───────────────── UK ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'uk-mod',
    country: 'UK',
    branch: 'strategic',
    name: 'Ministry of Defence',
    nativeName: 'MOD',
    motto: '',
    founded: '1964',
    headquarters: 'Whitehall, London',
    strength: '148,000 active; 37,000 reserve; 62,000 civilian',
    type: 'Military Administration',
    role: 'Defense policy, command of Her Majesty\'s Armed Forces',
    commander: 'Secretary of State for Defence',
    currentCommander: 'John Healey (2024–present)',
    bases: ['Main Building, Whitehall'],
    equipment: [],
    budget: '£54.2 billion (~$68 billion, FY2024-25)',
    status: 'Active',
    description:
      'The UK Ministry of Defence is responsible for implementing the defence policy set by His Majesty\'s Government and is the headquarters of the British Armed Forces. The UK is a nuclear-armed NATO member and one of the five permanent members of the UN Security Council.',
    combatHistory: [],
    parentId: null
  },

  {
    id: 'uk-army',
    country: 'UK',
    branch: 'army',
    name: 'British Army',
    nativeName: 'British Army',
    motto: 'Be The Best',
    founded: '1660',
    headquarters: 'Andover, Hampshire',
    strength: '75,000 regular; 26,000 reserve',
    type: 'Ground Warfare Branch',
    role: 'Land warfare, peacekeeping, humanitarian operations',
    commander: 'Chief of the General Staff',
    currentCommander: 'Gen. Sir Roly Walker (2024–present)',
    bases: ['Catterick Garrison', 'Bulford Camp', 'Tidworth Camp', 'Aldershot', 'BFG (Germany)'],
    equipment: [
      'Challenger 3 MBT (entering service, replacing Challenger 2)',
      'Ajax IFV family (entering service)',
      'Warrior IFV (being retired)',
      'Boxer 8x8 MIV',
      'Mastiff/Ridgeback MRAP',
      'Jackal/Coyote patrol vehicles',
      'AS-90 SPH',
      'GMLRS/M270 MLRS',
      'Apache AH Mk.1 (AH-64E)',
      'Wildcat AH.1 helicopter',
      'Chinook HC.6',
      'Starstreak HVM',
      'Sky Sabre air defense',
      'NLAW (provided to Ukraine)',
      'Javelin ATGM'
    ],
    status: 'Active',
    description:
      'The British Army is the principal land warfare force of the United Kingdom. It is undergoing significant transformation under the "Future Soldier" programme, restructuring into a more deployable and technologically advanced force. The British Army has been a leading provider of military aid to Ukraine.',
    combatHistory: [
      'Napoleonic Wars',
      'Crimean War',
      'Boer Wars',
      'World War I',
      'World War II',
      'Korean War',
      'Falklands War (1982)',
      'Gulf War (1991)',
      'The Troubles – Northern Ireland',
      'War in Afghanistan (2001–2014)',
      'Iraq War (2003–2009)'
    ],
    parentId: 'uk-mod'
  },

  {
    id: 'uk-sas',
    country: 'UK',
    branch: 'sof',
    name: 'Special Air Service',
    nativeName: '22 SAS Regiment',
    motto: 'Who Dares Wins',
    founded: '1941-07-01',
    headquarters: 'Stirling Lines, Credenhill, Hereford',
    strength: '~500 (estimated)',
    type: 'Tier 1 Special Forces',
    role: 'Counter-terrorism, hostage rescue, direct action, special reconnaissance, unconventional warfare',
    commander: 'Commanding Officer, 22 SAS (Colonel)',
    bases: ['Stirling Lines, Credenhill, Hereford'],
    equipment: [
      'C8 SFW (Colt Canada)',
      'HK416',
      'HK MP5 (CT role)',
      'L115A3/L135A1 sniper rifles',
      'Glock 17/19',
      'SIG Sauer P226/P320',
      'Land Rover WMIK',
      'Supacat Jackal',
      'Agusta A109 helicopters (support)'
    ],
    status: 'Active',
    description:
      'The Special Air Service (SAS) is the principal special forces unit of the British Army and one of the most renowned special operations forces in the world. Founded in 1941 during World War II by David Stirling, the SAS pioneered modern special forces tactics. The regiment gained worldwide fame during the 1980 Iranian Embassy siege. Many countries have modeled their special forces on the SAS, including Delta Force.',
    combatHistory: [
      'World War II – North Africa, Italy, France',
      'Malayan Emergency (1948–1960)',
      'Borneo Confrontation (1962–1966)',
      'The Troubles – Northern Ireland',
      'Falklands War (1982) – Pebble Island raid',
      'Gulf War (1991) – Bravo Two Zero',
      'Sierra Leone (2000) – Operation Barras',
      'War in Afghanistan',
      'Iraq War – Task Force Black',
      'Operation Shader (vs. ISIS)',
      'Iranian Embassy siege (1980)'
    ],
    parentId: 'uk-mod'
  },

  {
    id: 'uk-sbs',
    country: 'UK',
    branch: 'sof',
    name: 'Special Boat Service',
    nativeName: 'SBS',
    motto: 'By Strength and Guile',
    founded: '1940',
    headquarters: 'RM Poole, Dorset',
    strength: '~300 (estimated)',
    type: 'Tier 1 Naval Special Forces',
    role: 'Maritime counter-terrorism, amphibious reconnaissance, direct action, underwater operations',
    commander: 'Commanding Officer SBS',
    bases: ['RM Poole, Dorset'],
    equipment: [
      'C8 SFW',
      'HK416',
      'Klepper canoes',
      'Swimmer Delivery Vehicles',
      'Rigid Inflatable Boats',
      'Diving equipment'
    ],
    status: 'Active',
    description:
      'The Special Boat Service is the Royal Navy\'s elite special forces unit, equivalent to the U.S. Navy SEALs. The SBS specializes in maritime counter-terrorism, ship boarding, beach reconnaissance, and underwater demolitions. They work closely with the SAS and are part of UK Special Forces (UKSF).',
    combatHistory: [
      'World War II – beach reconnaissance, Mediterranean',
      'Falklands War (1982)',
      'Gulf War (1991)',
      'Sierra Leone (2000)',
      'War in Afghanistan',
      'Iraq War'
    ],
    parentId: 'uk-mod'
  },

  {
    id: 'uk-royal-navy',
    country: 'UK',
    branch: 'navy',
    name: 'Royal Navy',
    nativeName: 'Royal Navy',
    motto: 'Si vis pacem, para bellum (If you wish for peace, prepare for war)',
    founded: '1546',
    headquarters: 'Portsmouth, Hampshire',
    strength: '33,000 regular; 4,000 reserve',
    type: 'Naval Warfare Branch',
    role: 'Maritime defense, power projection, nuclear deterrence, sea control',
    commander: 'First Sea Lord',
    currentCommander: 'Adm. Sir Ben Key (2021–present)',
    bases: ['HMNB Portsmouth', 'HMNB Devonport', 'HMNB Clyde (Faslane – nuclear submarines)'],
    equipment: [
      'Queen Elizabeth-class aircraft carriers (2) – HMS Queen Elizabeth, HMS Prince of Wales',
      'Daring-class (Type 45) destroyers (6)',
      'Type 26 City-class frigates (building)',
      'Type 31 Inspiration-class frigates (building)',
      'Astute-class SSN (7 planned, 5 in service)',
      'Vanguard-class SSBN (4) – Trident D5 SLBM (UK nuclear deterrent)',
      'Dreadnought-class SSBN (under construction – replacement)',
      'F-35B Lightning II',
      'Merlin HM.2 helicopter',
      'Wildcat HMA.2',
      'Harpoon anti-ship missile (being replaced)',
      'Sea Ceptor (CAMM) air defense'
    ],
    status: 'Active',
    description:
      'The Royal Navy is one of the world\'s most capable blue-water navies. It operates two Queen Elizabeth-class aircraft carriers (the largest warships in British history) and maintains the UK\'s continuous at-sea nuclear deterrent through the Vanguard-class submarines armed with Trident missiles.',
    combatHistory: [
      'Battle of Trafalgar (1805)',
      'World War I – Battle of Jutland',
      'World War II – Battle of the Atlantic, Pacific',
      'Falklands War (1982)',
      'Gulf War (1991)',
      'Iraq War (2003)',
      'Libya intervention (2011)'
    ],
    parentId: 'uk-mod'
  },

  {
    id: 'uk-raf',
    country: 'UK',
    branch: 'air',
    name: 'Royal Air Force',
    nativeName: 'RAF',
    motto: 'Per Ardua ad Astra (Through Adversity to the Stars)',
    founded: '1918-04-01',
    headquarters: 'RAF High Wycombe, Buckinghamshire',
    strength: '33,000 regular; 3,000 reserve',
    type: 'Air Warfare Branch',
    role: 'Air superiority, strategic bombing, air defense, ISR, strategic airlift',
    commander: 'Chief of the Air Staff',
    bases: ['RAF Coningsby', 'RAF Lossiemouth', 'RAF Marham', 'RAF Brize Norton', 'RAF Waddington', 'RAF Akrotiri (Cyprus)'],
    equipment: [
      'F-35B Lightning II',
      'Eurofighter Typhoon FGR.4',
      'GCAP/Tempest (6th gen – in development with Japan & Italy)',
      'C-17A Globemaster III',
      'A400M Atlas',
      'C-130J Hercules (retired 2023)',
      'Voyager KC2/KC3 (A330 MRTT)',
      'P-8A Poseidon',
      'E-7 Wedgetail AEW (entering service)',
      'Protector RG.1 (MQ-9B SkyGuardian) RPAS',
      'RC-135W Rivet Joint',
      'Shadow R1 ISTAR',
      'Chinook HC.6',
      'Puma HC.2',
      'Storm Shadow/SCALP cruise missile',
      'Meteor BVRAAM',
      'SPEAR 3 air-to-ground missile'
    ],
    status: 'Active',
    description:
      'The Royal Air Force is the world\'s oldest independent air force. It is collaborating with Japan and Italy on the Global Combat Air Programme (GCAP), a 6th-generation combat aircraft expected to enter service in the mid-2030s. The RAF plays a key role in NATO air policing and has provided Storm Shadow missiles to Ukraine.',
    combatHistory: [
      'World War I',
      'World War II – Battle of Britain, strategic bombing campaign',
      'Korean War',
      'Falklands War (1982) – Black Buck raids',
      'Gulf War (1991)',
      'Kosovo War (1999)',
      'War in Afghanistan',
      'Iraq War',
      'Libya intervention (2011)',
      'Operation Shader (vs. ISIS)'
    ],
    parentId: 'uk-mod'
  },

  // ═══════════════════════════════════════════
  // ───────────────── FRANCE ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'fr-mod',
    country: 'France',
    branch: 'strategic',
    name: 'Ministry of the Armed Forces',
    nativeName: 'Ministère des Armées',
    motto: '',
    founded: '1589 (current form: 2017)',
    headquarters: 'Hôtel de Brienne, Paris',
    strength: '205,000 active; 40,000 reserve',
    type: 'Military Administration',
    role: 'Defense policy and command of the French Armed Forces',
    commander: 'Minister of the Armed Forces',
    currentCommander: 'Sébastien Lecornu (2022–present)',
    bases: [],
    equipment: [],
    budget: '€47.2 billion (~$51 billion, 2024)',
    status: 'Active',
    description:
      'France maintains the largest military in Western Europe and is a nuclear-armed state with independent deterrent capability. France has significant overseas military presence in Africa, the Middle East, and the Indo-Pacific through its overseas territories.',
    combatHistory: [],
    parentId: null
  },

  {
    id: 'fr-army',
    country: 'France',
    branch: 'army',
    name: 'French Army',
    nativeName: 'Armée de Terre',
    motto: '',
    founded: '1445',
    headquarters: 'Paris',
    strength: '115,000 active; 24,000 reserve',
    type: 'Ground Warfare Branch',
    role: 'Land warfare, expeditionary operations, foreign interventions',
    commander: 'Chief of Staff of the Army',
    bases: ['Various garrisons across France and overseas'],
    equipment: [
      'Leclerc MBT',
      'VBCI IFV',
      'Griffon MRAP/IFV (SCORPION programme)',
      'Jaguar armored reconnaissance (SCORPION programme)',
      'Serval 4x4 armored vehicle (SCORPION programme)',
      'CAESAR 155mm wheeled SPH',
      'LRU MLRS',
      'Tigre HAD attack helicopter',
      'NH90 Caïman helicopter',
      'Mistral MANPADS',
      'FELIN infantry system',
      'MMP (Missile Moyenne Portée) ATGM',
      'Aster 30 air defense (SAMP/T)'
    ],
    status: 'Active',
    description:
      'The French Army is undergoing a major modernization program called SCORPION, replacing its armored vehicle fleet with networked, digitally-connected platforms (Griffon, Jaguar, Serval). France is one of the few European nations with significant combat experience, having conducted operations in Mali, Central African Republic, and the Sahel region.',
    combatHistory: [
      'Napoleonic Wars',
      'Franco-Prussian War',
      'World War I – Verdun, Somme',
      'World War II',
      'First Indochina War – Dien Bien Phu',
      'Algerian War',
      'Gulf War (1991)',
      'Kosovo (1999)',
      'Afghanistan (2001–2014)',
      'Operation Serval / Barkhane – Mali/Sahel (2013–2022)',
      'Libya intervention (2011)'
    ],
    parentId: 'fr-mod'
  },

  {
    id: 'fr-foreign-legion',
    country: 'France',
    branch: 'army',
    name: 'French Foreign Legion',
    nativeName: 'Légion étrangère',
    motto: 'Legio Patria Nostra (The Legion is Our Fatherland)',
    founded: '1831-03-10',
    headquarters: 'Aubagne, France',
    strength: '8,900',
    type: 'Expeditionary Infantry / Combined Arms',
    role: 'Expeditionary operations, rapid intervention, infantry combat, engineering',
    commander: 'General commanding the French Foreign Legion (COMLE)',
    bases: ['Aubagne (HQ)', 'Castelnaudary (training)', 'Calvi (Corsica – 2e REP)', 'Kourou (French Guiana – 3e REI)', 'Nîmes', 'Orange', 'Laudun', 'Mayotte (DLEM)'],
    equipment: [
      'FAMAS / HK416F assault rifle',
      'FN Minimi LMG',
      'VBCI IFV',
      'Griffon',
      'VAB APC',
      'CAESAR SPH (1er REC)',
      'AMX-10RC (being replaced)',
      'Milan/MMP ATGM'
    ],
    status: 'Active',
    description:
      'The French Foreign Legion is one of the most iconic military units in the world. It is unique in that it accepts foreign nationals who wish to serve in the French military. Legionnaires serve under French officers and earn French citizenship after completing their service. The Legion is organized into 11 regiments and is known for its extremely rigorous training, esprit de corps, and willingness to accept the toughest missions.',
    combatHistory: [
      'French conquest of Algeria (1830s–1847)',
      'Crimean War',
      'Franco-Prussian War',
      'World War I – Gallipoli, Western Front',
      'World War II – Bir Hakeim',
      'First Indochina War – Dien Bien Phu (1954)',
      'Algerian War (1954–1962)',
      'Gulf War (1991)',
      'Afghanistan',
      'Operation Serval / Barkhane – Mali/Sahel',
      'Numerous African interventions'
    ],
    parentId: 'fr-mod'
  },

  {
    id: 'fr-marine-nationale',
    country: 'France',
    branch: 'navy',
    name: 'French Navy',
    nativeName: 'Marine nationale',
    motto: 'Honneur, Patrie, Valeur, Discipline',
    founded: '1624',
    headquarters: 'Paris (HQ) / Toulon & Brest (main bases)',
    strength: '44,000',
    type: 'Naval Warfare Branch',
    role: 'Maritime defense, power projection, nuclear deterrence, overseas protection',
    commander: 'Chief of Staff of the Navy (CEMM)',
    bases: ['Toulon', 'Brest', 'Cherbourg', 'Lorient', 'Île Longue (SSBN base)'],
    equipment: [
      'Charles de Gaulle nuclear aircraft carrier (R91)',
      'PANG (next-gen carrier – under construction)',
      'Horizon-class destroyers (2)',
      'FREMM-class frigates (8)',
      'FDI Amiral Ronarc\'h-class frigates (building)',
      'Suffren-class (Barracuda) SSN (6 planned)',
      'Le Triomphant-class SSBN (4) – M51 SLBM (nuclear deterrent)',
      'Rafale M carrier fighter',
      'E-2C Hawkeye',
      'NH90 Caïman Marine',
      'Atlantique 2 maritime patrol',
      'Exocet MM40 Block 3 anti-ship missile',
      'SCALP Naval cruise missile',
      'Aster 15/30 air defense'
    ],
    status: 'Active',
    description:
      'The French Navy operates the only nuclear-powered aircraft carrier outside the U.S. Navy (Charles de Gaulle). France maintains a continuous at-sea nuclear deterrent with its SSBN fleet and is building the next-generation carrier PANG. The Marine nationale has a significant presence in the Mediterranean, Indo-Pacific, and the Gulf.',
    combatHistory: [
      'World War I',
      'World War II',
      'First Indochina War',
      'Suez Crisis (1956)',
      'Gulf War (1991)',
      'Kosovo (1999)',
      'Libya (2011)',
      'Operation Chammal (vs. ISIS)'
    ],
    parentId: 'fr-mod'
  },

  {
    id: 'fr-armee-air',
    country: 'France',
    branch: 'air',
    name: 'French Air and Space Force',
    nativeName: 'Armée de l\'Air et de l\'Espace',
    motto: 'Faire face (To Face)',
    founded: '1909-10-22',
    headquarters: 'Paris',
    strength: '40,000',
    type: 'Air & Space Warfare Branch',
    role: 'Air superiority, nuclear strike, air defense, strategic airlift, space surveillance',
    commander: 'Chief of Staff of the Air and Space Force',
    bases: ['BA 113 Saint-Dizier', 'BA 118 Mont-de-Marsan', 'BA 125 Istres', 'BA 942 Lyon-Mont Verdun', 'BA 104 Al Dhafra (UAE)', 'BA 188 Djibouti'],
    equipment: [
      'Dassault Rafale (multirole – nuclear capable)',
      'Mirage 2000-5F/D (being retired)',
      'SCAF/FCAS 6th gen (in development with Germany & Spain)',
      'A400M Atlas transport',
      'C-130J Super Hercules',
      'A330 MRTT Phénix',
      'E-3F Sentry AWACS (being replaced)',
      'MQ-9 Reaper',
      'ASMP-A nuclear cruise missile',
      'SCALP-EG cruise missile',
      'Meteor BVRAAM',
      'MICA NG air-to-air missile',
      'SAMP/T Mamba air defense (Aster 30)'
    ],
    status: 'Active',
    description:
      'The French Air and Space Force was renamed in 2020 to reflect its expanded space mission. It operates the Rafale multirole fighter, which carries France\'s airborne nuclear deterrent (ASMP-A missile). France is developing the Future Combat Air System (FCAS/SCAF) 6th-generation fighter with Germany and Spain.',
    combatHistory: [
      'World War I',
      'World War II',
      'First Indochina War',
      'Algeria',
      'Gulf War (1991)',
      'Kosovo (1999)',
      'Afghanistan',
      'Libya (2011) – Operation Harmattan',
      'Mali/Sahel – Operation Serval/Barkhane',
      'Operation Chammal (vs. ISIS)'
    ],
    parentId: 'fr-mod'
  },

  {
    id: 'fr-gign',
    country: 'France',
    branch: 'sof',
    name: 'National Gendarmerie Intervention Group',
    nativeName: 'GIGN (Groupe d\'intervention de la Gendarmerie nationale)',
    motto: 'S\'engager pour la vie (Commit for Life)',
    founded: '1974-03-01',
    headquarters: 'Satory, Versailles',
    strength: '400+',
    type: 'Tier 1 Counter-Terrorism / Law Enforcement',
    role: 'Counter-terrorism, hostage rescue, VIP protection, high-risk arrests',
    commander: 'Commander GIGN (Colonel)',
    bases: ['Satory, Versailles'],
    equipment: [
      'HK416F',
      'HK MP5',
      'FN SCAR-H PR',
      'PGM Hécate II sniper rifle',
      'Glock 17/19',
      'Flash-bang and breaching equipment',
      'Armored vehicles',
      'EC145 helicopters (support)'
    ],
    status: 'Active',
    description:
      'The GIGN is France\'s elite counter-terrorism and hostage rescue unit within the National Gendarmerie. It gained worldwide fame in 1994 when it stormed a hijacked Air France aircraft in Marseille, freeing all passengers. The GIGN has conducted over 1,800 missions and freed more than 600 hostages with a near-zero hostage fatality rate.',
    combatHistory: [
      'Grand Mosque seizure – Mecca (1979, advisory)',
      'Air France Flight 8969 – Marseille hijacking (1994)',
      'Multiple embassy rescues in Africa',
      'Afghanistan (advisory)',
      'Paris attacks response (2015)',
      'Various high-risk arrest operations'
    ],
    parentId: 'fr-mod'
  },

  // ═══════════════════════════════════════════
  // ───────────────── GERMANY ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'de-mod',
    country: 'Germany',
    branch: 'strategic',
    name: 'Federal Ministry of Defence',
    nativeName: 'Bundesministerium der Verteidigung (BMVg)',
    motto: '',
    founded: '1955-06-07',
    headquarters: 'Berlin & Bonn',
    strength: '181,000 active',
    type: 'Military Administration',
    role: 'Command and administration of the Bundeswehr',
    commander: 'Federal Minister of Defence',
    currentCommander: 'Boris Pistorius (2023–present)',
    bases: [],
    equipment: [],
    budget: '€51.8 billion (~$56 billion, 2024)',
    status: 'Active',
    description:
      'Germany\'s Bundeswehr is undergoing a "Zeitenwende" (turning point) rearmament following Russia\'s invasion of Ukraine in 2022. A special fund of €100 billion was created for military modernization. Germany aims to build the largest conventional army in NATO Europe.',
    combatHistory: [],
    parentId: null
  },

  {
    id: 'de-heer',
    country: 'Germany',
    branch: 'army',
    name: 'German Army',
    nativeName: 'Deutsches Heer',
    motto: 'Schützen – Helfen – Vermitteln – Kämpfen',
    founded: '1955-11-12',
    headquarters: 'Strausberg, Brandenburg',
    strength: '62,000',
    type: 'Ground Warfare Branch',
    role: 'Land warfare, NATO collective defense, international crisis management',
    commander: 'Inspector of the Army',
    bases: ['Multiple garrisons across Germany'],
    equipment: [
      'Leopard 2A7V MBT',
      'Puma IFV',
      'Boxer 8x8 MRAV',
      'Marder 1A5 IFV (being replaced)',
      'PzH 2000 SPH',
      'MARS II MLRS',
      'Fennek reconnaissance vehicle',
      'Wiesel AWC',
      'Tiger UHT attack helicopter',
      'NH90 helicopter',
      'CH-47F Chinook (on order)',
      'IRIS-T SLM/SLS air defense',
      'Patriot PAC-3',
      'Gepard SPAAG (donated to Ukraine)',
      'PUMA S1 (upgraded)'
    ],
    status: 'Active',
    description:
      'The German Army (Heer) is the largest army in Central Europe and serves as the backbone of NATO\'s eastern defense. Following the Zeitenwende, Germany is rapidly modernizing with new Leopard 2A8 tanks on order, additional Puma IFVs, and massive procurement of ammunition and air defense systems. Germany is the framework nation for NATO\'s Lithuania-based brigade.',
    combatHistory: [
      'ISAF Afghanistan (2002–2014) – Kunduz',
      'KFOR Kosovo',
      'Mali – MINUSMA',
      'Enhanced Forward Presence – Lithuania'
    ],
    parentId: 'de-mod'
  },

  {
    id: 'de-ksk',
    country: 'Germany',
    branch: 'sof',
    name: 'Special Forces Command',
    nativeName: 'Kommando Spezialkräfte (KSK)',
    motto: 'Facit Omnia Voluntas (The Will Conquers All)',
    founded: '1996-09-20',
    headquarters: 'Graf-Zeppelin-Kaserne, Calw, Baden-Württemberg',
    strength: '1,100',
    type: 'Special Forces',
    role: 'Counter-terrorism, special reconnaissance, direct action, hostage rescue, military assistance',
    commander: 'Commander KSK (Brigadier General)',
    bases: ['Calw, Baden-Württemberg'],
    equipment: [
      'HK G95 (HK416A7)',
      'HK MP7A2',
      'HK G28 DMR',
      'G82 (Barrett M82) sniper rifle',
      'HK P30',
      'Serval special operations vehicle',
      'Various specialized equipment'
    ],
    status: 'Active',
    description:
      'The KSK is the Bundeswehr\'s premier special forces unit. It was formed in 1996 after the Rwandan crisis exposed Germany\'s lack of special operations capability. In 2020, one KSK company was disbanded due to right-wing extremism concerns, and the unit underwent significant reforms.',
    combatHistory: [
      'ISAF Afghanistan (2001–2014)',
      'Various classified operations'
    ],
    parentId: 'de-mod'
  },

  // ═══════════════════════════════════════════
  // ───────────────── ISRAEL ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'il-idf',
    country: 'Israel',
    branch: 'strategic',
    name: 'Israel Defense Forces',
    nativeName: 'צבא ההגנה לישראל (צה״ל / Tzahal)',
    motto: '',
    founded: '1948-05-26',
    headquarters: 'HaKirya, Tel Aviv',
    strength: '169,500 active; 465,000 reserve (can mobilize 600,000+)',
    type: 'Unified Defense Force',
    role: 'Defense of Israel, deterrence, military operations',
    commander: 'Chief of the General Staff',
    currentCommander: 'Lt. Gen. Herzi Halevi (2023–present)',
    bases: ['HaKirya (Tel Aviv)'],
    equipment: [],
    budget: '$23.4 billion (2024, excluding U.S. aid)',
    status: 'Active',
    description:
      'The IDF is the military force of Israel, comprising ground, air, and naval components under a unified command. Israel has mandatory conscription for most citizens. The IDF is one of the most combat-experienced militaries in the world and is a leader in military technology, cyber warfare, and intelligence. Following the October 7, 2023 Hamas attack, the IDF launched a major military operation in Gaza.',
    combatHistory: [
      '1948 Arab-Israeli War',
      'Suez Crisis (1956)',
      'Six-Day War (1967)',
      'War of Attrition (1967–1970)',
      'Yom Kippur War (1973)',
      'Operation Litani – Lebanon (1978)',
      'First Lebanon War (1982)',
      'First Intifada (1987–1993)',
      'Second Intifada (2000–2005)',
      'Second Lebanon War (2006)',
      'Operation Cast Lead – Gaza (2008–2009)',
      'Operation Protective Edge – Gaza (2014)',
      'Operation Swords of Iron – Gaza (2023–present)'
    ],
    parentId: null
  },

  {
    id: 'il-ground',
    country: 'Israel',
    branch: 'army',
    name: 'Israeli Ground Forces',
    nativeName: 'זרוע היבשה',
    motto: '',
    founded: '1948',
    headquarters: 'Tel Aviv',
    strength: '126,000 active; 400,000 reserve',
    type: 'Ground Warfare Branch',
    role: 'Land warfare, border defense, counterterrorism, urban warfare',
    commander: 'GOC Army HQ',
    bases: ['Multiple bases across Israel'],
    equipment: [
      'Merkava Mk 4M (Barak) MBT with Trophy APS',
      'Namer heavy IFV (Merkava-based)',
      'Eitan 8x8 APC (entering service)',
      'M113 APC variants',
      'D9 armored bulldozer',
      'Spike ATGM family (Spike NLOS, MR, LR, ER)',
      'Iron Fist APS',
      'ATMOS 2000 155mm SPH',
      'M109A5 Doher SPH',
      'LYNX MLRS',
      'Iron Dome (battery defense)',
      'David\'s Sling (medium-range)',
      'Arrow 2/3 (ballistic missile defense)',
      'Iron Beam (laser defense – entering service)',
      'Hermes 450/900 UAV',
      'Heron TP UAV'
    ],
    status: 'Active',
    description:
      'The Israeli Ground Forces are among the most experienced armies in urban and asymmetric warfare. Israel pioneered active protection systems (Trophy) for tanks and operates the world\'s most advanced multi-layered air defense system. The Merkava Mk 4 is one of the best-protected tanks in the world.',
    combatHistory: [
      'All Arab-Israeli Wars',
      'Lebanon Wars',
      'Intifadas',
      'Gaza operations (2008, 2012, 2014, 2021, 2023–present)'
    ],
    parentId: 'il-idf'
  },

  {
    id: 'il-iaf',
    country: 'Israel',
    branch: 'air',
    name: 'Israeli Air Force',
    nativeName: 'חיל האוויר הישראלי',
    motto: 'The Best for Flight',
    founded: '1948-05-28',
    headquarters: 'Tel Aviv',
    strength: '34,000',
    type: 'Air Warfare Branch',
    role: 'Air superiority, strategic strike, close air support, air defense, ISR',
    commander: 'Commander of the IAF',
    bases: ['Nevatim', 'Ramon', 'Ramat David', 'Hatzor', 'Tel Nof', 'Palmachim'],
    equipment: [
      'F-35I Adir (Israeli variant of F-35A)',
      'F-15I Ra\'am (Strike Eagle variant)',
      'F-15D Baz',
      'F-16I Sufa',
      'F-16C/D Barak',
      'AH-64D Saraf (Apache)',
      'CH-53 Yasur',
      'UH-60 Yanshuf (Black Hawk)',
      'Heron TP (Eitan) MALE UAV',
      'Hermes 900 UAV',
      'Hermes 450 UAV',
      'G550 Eitam AEW',
      'KC-707 tanker',
      'Arrow 2/3 ABM system',
      'Iron Dome batteries',
      'David\'s Sling'
    ],
    status: 'Active',
    description:
      'The Israeli Air Force is widely considered one of the most capable air forces in the world, with extensive combat experience. The IAF has conducted long-range strikes in Iraq (Osirak, 1981), Syria, Sudan, and Iran-linked targets. It was the first non-U.S. operator of the F-35. The IAF also operates Israel\'s multi-layered missile defense system.',
    combatHistory: [
      'Six-Day War (1967) – preemptive strike destroyed Egyptian Air Force',
      'Yom Kippur War (1973)',
      'Operation Opera – Osirak reactor strike (1981)',
      'First Lebanon War (1982) – Bekaa Valley air battle',
      'Second Lebanon War (2006)',
      'Operation Orchard – Syrian reactor strike (2007)',
      'Multiple Gaza operations',
      'Operation Swords of Iron (2023–present)',
      'Strikes against Houthis in Yemen (2024)'
    ],
    parentId: 'il-idf'
  },

  {
    id: 'il-sayeret-matkal',
    country: 'Israel',
    branch: 'sof',
    name: 'Sayeret Matkal',
    nativeName: 'סיירת מטכ״ל (Unit 269)',
    motto: 'Who Dares Wins (adopted from SAS)',
    founded: '1957',
    headquarters: 'Classified',
    strength: '~300 (estimated)',
    type: 'Tier 1 Special Forces',
    role: 'Deep reconnaissance, counter-terrorism, hostage rescue, intelligence gathering',
    commander: 'Classified (Lieutenant Colonel)',
    bases: ['Classified'],
    equipment: [
      'CTAR-21 (Tavor variant)',
      'M4A1 SOPMOD',
      'Negev LMG',
      'Various sniper systems',
      'Specialized reconnaissance equipment'
    ],
    status: 'Active',
    description:
      'Sayeret Matkal is the IDF\'s most elite special forces unit, directly subordinate to the Military Intelligence Directorate (Aman). It is the Israeli equivalent of the British SAS and was modeled after it. Many Israeli prime ministers served in Sayeret Matkal, including Ehud Barak and Benjamin Netanyahu. The unit conducted the legendary Operation Entebbe hostage rescue in 1976.',
    combatHistory: [
      'Operation Isotope – Sabena Flight 571 hijacking (1972)',
      'Operation Spring of Youth – Beirut (1973)',
      'Operation Entebbe – Uganda (1976)',
      'Multiple classified operations',
      'Second Lebanon War (2006)',
      'Gaza operations'
    ],
    parentId: 'il-idf'
  },

  {
    id: 'il-shayetet-13',
    country: 'Israel',
    branch: 'sof',
    name: 'Shayetet 13',
    nativeName: 'שייטת 13 (Flotilla 13)',
    motto: 'As the Bat',
    founded: '1949',
    headquarters: 'Atlit Naval Base',
    strength: '~300 (estimated)',
    type: 'Tier 1 Naval Special Forces',
    role: 'Maritime counter-terrorism, amphibious assault, sabotage, hostage rescue',
    commander: 'Classified',
    bases: ['Atlit Naval Base'],
    equipment: [
      'Various assault rifles',
      'Combat diving equipment',
      'Swimmer delivery vehicles',
      'Rigid-hull inflatable boats',
      'Specialized maritime equipment'
    ],
    status: 'Active',
    description:
      'Shayetet 13 (Flotilla 13) is the Israeli Navy\'s elite naval commando unit, comparable to the U.S. Navy SEALs or British SBS. It is one of the three Tier 1 special forces units of the IDF. Shayetet 13 specializes in sea-to-land raids, underwater demolitions, maritime counter-terrorism, and intelligence gathering.',
    combatHistory: [
      '1948 Arab-Israeli War – sabotage operations',
      'Six-Day War (1967)',
      'Operation Spring of Youth – Beirut (1973)',
      'Yom Kippur War (1973)',
      'Second Lebanon War (2006)',
      'Gaza flotilla raid (2010)',
      'Operation Swords of Iron (2023–present)'
    ],
    parentId: 'il-idf'
  },

  {
    id: 'il-unit-8200',
    country: 'Israel',
    branch: 'cyber',
    name: 'Unit 8200',
    nativeName: 'יחידה 8200',
    motto: '',
    founded: '1952',
    headquarters: 'Classified (Negev region)',
    strength: '~5,000–10,000 (estimated)',
    type: 'Signals Intelligence / Cyber Warfare Unit',
    role: 'SIGINT, cyber warfare, code-breaking, electronic intelligence, cyber offense/defense',
    commander: 'Classified',
    bases: ['Multiple classified locations'],
    equipment: [
      'Advanced SIGINT collection systems',
      'Cyber offensive platforms',
      'AI and machine learning systems',
      'Classified surveillance systems'
    ],
    status: 'Active',
    description:
      'Unit 8200 is the IDF\'s signals intelligence and cyber warfare unit, comparable to the U.S. NSA or UK GCHQ. It is considered one of the most capable cyber and intelligence units in the world. Many veterans of Unit 8200 have gone on to found major Israeli tech companies and cybersecurity firms, making it a cornerstone of Israel\'s "Startup Nation" reputation. The unit was reportedly involved in creating the Stuxnet virus that targeted Iran\'s nuclear program.',
    combatHistory: [
      'Ongoing intelligence operations',
      'Stuxnet (attributed, 2010)',
      'Various cyber operations against Iran, Hezbollah, Hamas',
      'Operation Swords of Iron – intelligence support'
    ],
    parentId: 'il-idf'
  },

  // ═══════════════════════════════════════════
  // ───────────────── INDIA ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'in-mod',
    country: 'India',
    branch: 'strategic',
    name: 'Ministry of Defence of India',
    nativeName: 'रक्षा मंत्रालय',
    motto: '',
    founded: '1947',
    headquarters: 'South Block, New Delhi',
    strength: '1,455,550 active; 1,155,000 reserve/paramilitary',
    type: 'Military Administration',
    role: 'Defense policy and command of the Indian Armed Forces',
    commander: 'Minister of Defence / Chief of Defence Staff',
    currentCommander: 'Rajnath Singh (Minister, 2019–present)',
    bases: [],
    equipment: [],
    budget: '$75 billion (FY2024-25)',
    status: 'Active',
    description:
      'India has the second largest active military in the world and is a nuclear-armed state. The Indian military faces security challenges on two fronts: the Line of Control with Pakistan and the Line of Actual Control with China. India is the world\'s largest arms importer and is transitioning toward indigenous defense production under the "Make in India" initiative.',
    combatHistory: [],
    parentId: null
  },

  {
    id: 'in-army',
    country: 'India',
    branch: 'army',
    name: 'Indian Army',
    nativeName: 'भारतीय थलसेना',
    motto: 'Service Before Self',
    founded: '1895-04-01',
    headquarters: 'New Delhi',
    strength: '1,237,000 active',
    type: 'Ground Warfare Branch',
    role: 'Land warfare, border defense, counterinsurgency, humanitarian assistance',
    commander: 'Chief of the Army Staff',
    bases: ['Multiple command HQs across India'],
    equipment: [
      'T-90S Bhishma MBT',
      'Arjun Mk 1A MBT (indigenous)',
      'T-72M1 Ajeya MBT',
      'BMP-2 Sarath IFV',
      'K9 Vajra-T 155mm SPH',
      'Dhanush 155mm howitzer (indigenous)',
      'M777A2 ultralight howitzer',
      'Pinaka MLRS (indigenous)',
      'BrahMos supersonic cruise missile',
      'HAL Rudra attack helicopter',
      'HAL Light Combat Helicopter (Prachand)',
      'AH-64E Apache',
      'CH-47F Chinook',
      'Akash air defense system',
      'DRDO Nag ATGM',
      'Spike ATGM'
    ],
    status: 'Active',
    description:
      'The Indian Army is one of the largest standing armies in the world. It guards the world\'s highest battlefield at the Siachen Glacier and maintains deployments along the Line of Actual Control (LAC) with China following the 2020 Galwan Valley clashes. The army is undergoing significant modernization with both imported and indigenous systems.',
    combatHistory: [
      'Indo-Pakistani War (1947)',
      'Sino-Indian War (1962)',
      'Indo-Pakistani War (1965)',
      'Indo-Pakistani War (1971) – Liberation of Bangladesh',
      'Kargil War (1999)',
      'Siachen conflict (1984–present)',
      'Sri Lanka IPKF (1987–1990)',
      'Galwan Valley clashes (2020)',
      'Multiple counterinsurgency operations – Kashmir, Northeast India'
    ],
    parentId: 'in-mod'
  },

  {
    id: 'in-marcos',
    country: 'India',
    branch: 'sof',
    name: 'MARCOS',
    nativeName: 'Marine Commandos (MCF)',
    motto: 'The Few The Fearless',
    founded: '1987-02',
    headquarters: 'INS Abhimanyu, Mumbai',
    strength: '~2,000',
    type: 'Naval Special Forces',
    role: 'Maritime special operations, counter-terrorism, direct action, special reconnaissance, asymmetric warfare',
    commander: 'Commanding Officer MARCOS',
    bases: ['INS Abhimanyu (Mumbai)', 'Visakhapatnam', 'Kochi'],
    equipment: [
      'SIG Sauer SIG716',
      'Tavor TAR-21',
      'MP5 submachine gun',
      'Corner Shot system',
      'Combat diving equipment',
      'SDVs (Swimmer Delivery Vehicles)',
      'Rigid-hull inflatable boats'
    ],
    status: 'Active',
    description:
      'MARCOS (Marine Commandos) are the special operations unit of the Indian Navy, comparable to U.S. Navy SEALs. They are qualified in airborne, combat diving, and direct action operations. MARCOS played a key role in the 2008 Mumbai attacks response, neutralizing terrorists at the Taj Mahal Palace Hotel and Nariman House.',
    combatHistory: [
      'Sri Lanka IPKF (1987–1990)',
      'Kargil War (1999)',
      '2008 Mumbai attacks – counter-terrorism response',
      'Anti-piracy operations – Gulf of Aden',
      'Counter-insurgency – Kashmir'
    ],
    parentId: 'in-mod'
  },

  // ═══════════════════════════════════════════
  // ───────────────── PAKISTAN ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'pk-mod',
    country: 'Pakistan',
    branch: 'strategic',
    name: 'Pakistan Armed Forces',
    nativeName: 'پاکستان مسلح افواج',
    motto: 'Faith, Unity, Discipline (Iman, Ittehad, Nazm)',
    founded: '1947-08-14',
    headquarters: 'Joint Staff HQ, Rawalpindi',
    strength: '654,000 active; 550,000 reserve',
    type: 'Unified Military Command',
    role: 'Defense of Pakistan, nuclear deterrence',
    commander: 'Chairman Joint Chiefs of Staff Committee',
    bases: ['GHQ Rawalpindi'],
    equipment: [],
    budget: '$10.3 billion (FY2024)',
    status: 'Active',
    description:
      'Pakistan\'s military is the 6th largest in the world and possesses nuclear weapons. The military has played a dominant role in Pakistan\'s politics, having conducted multiple coups. The Pakistan Armed Forces have extensive counter-terrorism experience from operations against the Taliban and other militant groups in the tribal areas.',
    combatHistory: [
      'Indo-Pakistani War (1947)',
      'Indo-Pakistani War (1965)',
      'Indo-Pakistani War (1971)',
      'Kargil War (1999)',
      'War on Terror – FATA operations',
      'Operation Zarb-e-Azb (2014)',
      'Operation Radd-ul-Fasaad (2017–present)'
    ],
    parentId: null
  },

  {
    id: 'pk-ssg',
    country: 'Pakistan',
    branch: 'sof',
    name: 'Special Service Group',
    nativeName: 'SSG (Zarrar Company – tier 1 element)',
    motto: '',
    founded: '1956-03-23',
    headquarters: 'Tarbela, Khyber Pakhtunkhwa',
    strength: '~5,600',
    type: 'Special Forces',
    role: 'Counter-terrorism, unconventional warfare, direct action, special reconnaissance',
    commander: 'Major General',
    bases: ['Tarbela', 'Cherat'],
    equipment: [
      'M4A1 SOPMOD',
      'HK MP5',
      'HK G3 variants',
      'Barrett M82 sniper rifle',
      'SIG Sauer P226'
    ],
    status: 'Active',
    description:
      'The SSG is Pakistan\'s premier special operations force, nicknamed the "Maroon Berets." Zarrar Company is the Tier 1 counter-terrorism element. The SSG has extensive experience in operations in the Federally Administered Tribal Areas (FATA) and conducted the operation to recapture the GHQ from militants in 2009.',
    combatHistory: [
      'Indo-Pakistani Wars',
      'Soviet-Afghan War (covert support)',
      'Kargil War (1999)',
      'War on Terror – Waziristan operations',
      'Operation Zarb-e-Azb',
      'GHQ attack response (2009)',
      'PNS Mehran attack response (2011)'
    ],
    parentId: 'pk-mod'
  },

  // ═══════════════════════════════════════════
  // ───────────────── TURKEY ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'tr-tsk',
    country: 'Turkey',
    branch: 'strategic',
    name: 'Turkish Armed Forces',
    nativeName: 'Türk Silahlı Kuvvetleri (TSK)',
    motto: '',
    founded: '1920-05-03',
    headquarters: 'Ankara',
    strength: '355,200 active; 378,700 reserve',
    type: 'Unified Military Command',
    role: 'Defense of Turkey, NATO collective defense, power projection',
    commander: 'Chief of the General Staff',
    bases: ['Turkish General Staff HQ, Ankara'],
    equipment: [],
    budget: '$16.4 billion (2024)',
    status: 'Active',
    description:
      'Turkey has the second largest military in NATO after the United States. The Turkish military has been highly active in Syria, Iraq, Libya, and the South Caucasus (supporting Azerbaijan). Turkey has become a major defense exporter, particularly with its Bayraktar TB2 drone, which gained fame in the 2020 Nagorno-Karabakh war and the Russo-Ukrainian War.',
    combatHistory: [
      'Turkish War of Independence (1919–1923)',
      'Korean War (1950–1953)',
      'Cyprus intervention (1974)',
      'Kurdish-Turkish conflict (1984–present)',
      'Operation Euphrates Shield – Syria (2016–2017)',
      'Operation Olive Branch – Afrin (2018)',
      'Operation Peace Spring – NE Syria (2019)',
      'Libya intervention (2019–2020)',
      'Support to Azerbaijan – Nagorno-Karabakh (2020)'
    ],
    parentId: null
  },

  {
    id: 'tr-army',
    country: 'Turkey',
    branch: 'army',
    name: 'Turkish Land Forces',
    nativeName: 'Türk Kara Kuvvetleri',
    motto: '',
    founded: '1920',
    headquarters: 'Ankara',
    strength: '260,200 active',
    type: 'Ground Warfare Branch',
    role: 'Land warfare, counter-insurgency, border defense',
    commander: 'Commander of the Turkish Land Forces',
    bases: ['Multiple across Turkey and northern Syria/Iraq'],
    equipment: [
      'Altay MBT (entering production – indigenous)',
      'Leopard 2A4 MBT',
      'M60T Sabra MBT',
      'ACV-15 AAPC',
      'FNSS Kaplan MT (medium tank – export)',
      'BMC Kirpi MRAP',
      'Otokar Cobra II',
      'T-155 Fırtına SPH',
      'T-122 Sakarya MLRS',
      'TRLG-230 guided MLRS',
      'UMTAS ATGM',
      'T-129 ATAK helicopter (indigenous)',
      'T-625 Gökbey utility helicopter',
      'Bayraktar TB2 UCAV',
      'Bayraktar Akıncı UCAV',
      'Anka-S UCAV',
      'HISAR-A/O air defense',
      'SIPER long-range air defense (in development)',
      'S-400 (purchased from Russia, not integrated into NATO)'
    ],
    status: 'Active',
    description:
      'The Turkish Land Forces Command has extensive combat experience from counter-insurgency operations against the PKK and military operations in Syria and Iraq. Turkey has invested heavily in its indigenous defense industry, producing its own MBT (Altay), attack helicopters (T-129 ATAK), and armed drones (Bayraktar TB2/Akıncı).',
    combatHistory: [
      'Korean War (1950–1953)',
      'Cyprus (1974)',
      'Kurdish-Turkish conflict (1984–present)',
      'Syria operations (2016–present)',
      'Iraq cross-border operations'
    ],
    parentId: 'tr-tsk'
  },

  {
    id: 'tr-okg',
    country: 'Turkey',
    branch: 'sof',
    name: 'Maroon Berets (Bordo Bereliler)',
    nativeName: 'Özel Kuvvetler Komutanlığı (ÖKK)',
    motto: '',
    founded: '1952',
    headquarters: 'Ankara',
    strength: '~3,000',
    type: 'Special Forces Command',
    role: 'Unconventional warfare, counter-terrorism, direct action, special reconnaissance',
    commander: 'Commander of Special Forces',
    bases: ['Ankara (HQ)', 'Multiple forward operating bases in Syria/Iraq'],
    equipment: [
      'MPT-76 battle rifle (indigenous)',
      'HK416',
      'JNG-90 sniper rifle (indigenous)',
      'Various specialized equipment'
    ],
    status: 'Active',
    description:
      'The Bordo Bereliler (Maroon Berets) are Turkey\'s elite special forces, operating under the Special Forces Command. They have been heavily engaged in counter-PKK operations in southeastern Turkey, northern Iraq, and Syria. They also played a key role in resisting the 2016 coup attempt.',
    combatHistory: [
      'Cyprus (1974)',
      'Kurdish-Turkish conflict',
      'Syria operations',
      'Iraq cross-border operations',
      '2016 coup attempt – resistance operations'
    ],
    parentId: 'tr-tsk'
  },

  // ═══════════════════════════════════════════
  // ───────────────── JAPAN ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'jp-jsdf',
    country: 'Japan',
    branch: 'strategic',
    name: 'Japan Self-Defense Forces',
    nativeName: '自衛隊 (Jieitai)',
    motto: '',
    founded: '1954-07-01',
    headquarters: 'Ichigaya, Tokyo',
    strength: '247,000 active; 56,000 reserve',
    type: 'Unified Defense Force',
    role: 'Self-defense, disaster relief, international peacekeeping, Indo-Pacific security',
    commander: 'Minister of Defense / Chief of Staff, Joint Staff',
    bases: ['Ichigaya (Tokyo)'],
    equipment: [],
    budget: '$56 billion (FY2024 – record increase under new National Security Strategy)',
    status: 'Active',
    description:
      'The Japan Self-Defense Forces are constitutionally limited to self-defense but have been undergoing a historic transformation under the 2022 National Security Strategy. Japan is doubling its defense budget to 2% of GDP by 2027, acquiring counterstrike (long-range strike) capabilities for the first time, and building up its forces to counter the growing Chinese military threat.',
    combatHistory: [
      'International peacekeeping missions',
      'Disaster relief operations'
    ],
    parentId: null
  },

  {
    id: 'jp-jgsdf',
    country: 'Japan',
    branch: 'army',
    name: 'Japan Ground Self-Defense Force',
    nativeName: '陸上自衛隊',
    motto: '',
    founded: '1954',
    headquarters: 'Camp Ichigaya, Tokyo',
    strength: '150,000',
    type: 'Ground Defense Force',
    role: 'Ground defense, amphibious operations, island defense, disaster relief',
    commander: 'Chief of Staff, JGSDF',
    bases: ['Camp Asaka', 'Camp Fuji', 'Camp Naha (Okinawa)'],
    equipment: [
      'Type 10 MBT',
      'Type 90 MBT',
      'Type 16 MCV (wheeled tank destroyer)',
      'Type 89 IFV',
      'Type 96 APC',
      'Type 19 155mm wheeled SPH',
      'Type 99 155mm SPH',
      'MLRS M270',
      'Type 12 anti-ship missile (upgraded for land attack)',
      'AH-64D Apache',
      'AH-1S Cobra (retiring)',
      'UH-60JA Black Hawk',
      'CH-47JA Chinook',
      'Type 03 Chu-SAM',
      'Type 93 SAM',
      'Amphibious Rapid Deployment Brigade (ARDB)'
    ],
    status: 'Active',
    description:
      'The JGSDF is being restructured to focus on island defense in the East China Sea, with the creation of the Amphibious Rapid Deployment Brigade (Japan\'s first marine-type force since WWII). Japan is acquiring long-range strike missiles (modified Type 12, Tomahawk) and plans to deploy forces to the southwestern islands chain facing Taiwan.',
    combatHistory: [
      'Disaster relief – Great Hanshin Earthquake (1995), Tōhoku earthquake/tsunami (2011)',
      'International peacekeeping – Cambodia, Iraq, South Sudan'
    ],
    parentId: 'jp-jsdf'
  },

  // ═══════════════════════════════════════════
  // ───────────────── SOUTH KOREA ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'kr-mod',
    country: 'South Korea',
    branch: 'strategic',
    name: 'Republic of Korea Armed Forces',
    nativeName: '대한민국 국군',
    motto: '',
    founded: '1948-08-15',
    headquarters: 'Seoul',
    strength: '500,000 active; 3,100,000 reserve',
    type: 'Unified Military Command',
    role: 'Defense against North Korea, territorial defense, peacekeeping',
    commander: 'Minister of National Defense / Chairman of the Joint Chiefs of Staff',
    bases: ['Seoul (Ministry of National Defense)'],
    equipment: [],
    budget: '$47.8 billion (2024)',
    status: 'Active',
    description:
      'South Korea maintains one of the most powerful militaries in Asia, driven by the existential threat from North Korea. South Korea has mandatory conscription and can mobilize over 3.5 million troops. It has become a major global defense exporter, selling K2 tanks, K9 howitzers, FA-50 jets, and Redback IFVs to multiple countries including Poland, Australia, and Norway.',
    combatHistory: [
      'Korean War (1950–1953)',
      'Vietnam War (1964–1973)',
      'Gulf War (1991)',
      'Iraq War – Zaytun Division',
      'Various UN peacekeeping missions'
    ],
    parentId: null
  },

  {
    id: 'kr-army',
    country: 'South Korea',
    branch: 'army',
    name: 'Republic of Korea Army',
    nativeName: '대한민국 육군 (ROKA)',
    motto: '',
    founded: '1948-09-05',
    headquarters: 'Gyeryong, South Chungcheong Province',
    strength: '365,000 active',
    type: 'Ground Warfare Branch',
    role: 'Ground defense against North Korea, counterattack, combined operations with U.S. Forces Korea',
    commander: 'Chief of Staff, ROK Army',
    bases: ['Multiple bases along the DMZ and nationwide'],
    equipment: [
      'K2 Black Panther MBT',
      'K1A2 MBT',
      'K21 IFV',
      'K200 APC',
      'K9 Thunder 155mm SPH (world-leading export)',
      'K239 Chunmoo MLRS',
      'K10 ARV (ammunition resupply)',
      'Spike ATGM',
      'Hyunmoo-2/3/4/5 ballistic/cruise missiles',
      'KF-21 Boramae (4.5 gen fighter – shared with Air Force)',
      'AH-64E Apache',
      'KUH-1 Surion utility helicopter',
      'LAH (Light Armed Helicopter)',
      'Cheongung (M-SAM) air defense',
      'L-SAM (long-range air defense – in development)',
      'Haegung anti-drone system'
    ],
    status: 'Active',
    description:
      'The ROK Army is one of the largest and most capable armies in the world, organized primarily for defense against a North Korean invasion. The army maintains extensive fortifications along the DMZ and operates in close coordination with U.S. Forces Korea. South Korea\'s defense industry, particularly the K9 howitzer and K2 tank, has become a global export success.',
    combatHistory: [
      'Korean War (1950–1953)',
      'Vietnam War (1964–1973)',
      'Various peacekeeping operations'
    ],
    parentId: 'kr-mod'
  },

  // ═══════════════════════════════════════════
  // ───────────────── NORTH KOREA ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'kp-kpa',
    country: 'North Korea',
    branch: 'strategic',
    name: 'Korean People\'s Army',
    nativeName: '조선인민군 (KPA)',
    motto: '',
    founded: '1948-02-08',
    headquarters: 'Pyongyang',
    strength: '1,280,000 active; 600,000 reserve; 5,700,000 paramilitary',
    type: 'Unified Military Command',
    role: 'Defense of DPRK, nuclear deterrence, regime protection',
    commander: 'Supreme Commander of the KPA',
    currentCommander: 'Kim Jong-un',
    bases: ['Pyongyang (Supreme Command)'],
    equipment: [],
    budget: '~$4–7 billion (estimated, 15-25% of GDP)',
    status: 'Active',
    description:
      'North Korea has the 4th largest military in the world by active personnel but relies heavily on outdated equipment. It has developed nuclear weapons and ballistic missiles capable of reaching the United States. In 2024, North Korea deployed troops to Russia to support the Russo-Ukrainian War, marking its first major foreign military deployment in decades.',
    combatHistory: [
      'Korean War (1950–1953)',
      'DMZ incidents and provocations',
      'Blue House Raid (1968)',
      'Axe Murder Incident (1976)',
      'Bombardment of Yeonpyeong (2010)',
      'Troops deployed to Russia/Ukraine (2024–present)'
    ],
    parentId: null
  },

  // ═══════════════════════════════════════════
  // ───────────────── IRAN ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'ir-mod',
    country: 'Iran',
    branch: 'strategic',
    name: 'Armed Forces of the Islamic Republic of Iran',
    nativeName: 'نیروهای مسلح جمهوری اسلامی ایران',
    motto: '',
    founded: '1979',
    headquarters: 'Tehran',
    strength: '580,000 active; 350,000 reserve',
    type: 'Unified Military Command (dual structure: Artesh + IRGC)',
    role: 'Defense of Iran, regional influence, nuclear program protection',
    commander: 'Supreme Leader (Commander-in-Chief)',
    currentCommander: 'Ayatollah Ali Khamenei',
    bases: ['Tehran'],
    equipment: [],
    budget: '$7 billion (official, actual estimated higher)',
    status: 'Active',
    description:
      'Iran has a unique dual military structure: the regular military (Artesh) and the Islamic Revolutionary Guard Corps (IRGC). The IRGC is the more politically powerful force and controls Iran\'s missile program, nuclear activities, and proxy forces across the Middle East. Iran has invested heavily in ballistic missiles, drones, and asymmetric warfare capabilities.',
    combatHistory: [
      'Iran-Iraq War (1980–1988)',
      'Regional proxy conflicts – Lebanon, Syria, Iraq, Yemen',
      'Tanker War (1984–1988)',
      'Direct strikes on Israel (April 2024)',
      'Houthi support (Yemen civil war)'
    ],
    parentId: null
  },

  {
    id: 'ir-irgc',
    country: 'Iran',
    branch: 'army',
    name: 'Islamic Revolutionary Guard Corps',
    nativeName: 'سپاه پاسداران انقلاب اسلامی (IRGC / Sepah)',
    motto: '',
    founded: '1979-05-05',
    headquarters: 'Tehran',
    strength: '190,000 (including Basij militia: 90,000 active, millions more reservists)',
    type: 'Parallel Military / Ideological Armed Force',
    role: 'Regime protection, asymmetric warfare, proxy force management, missile operations, nuclear program security',
    commander: 'Commander-in-Chief of the IRGC',
    currentCommander: 'Maj. Gen. Hossein Salami (2019–present)',
    bases: ['Multiple bases across Iran'],
    equipment: [
      'Fateh-313 SRBM',
      'Shahab-3 MRBM',
      'Emad MRBM',
      'Khorramshahr MRBM',
      'Sejjil MRBM (solid fuel)',
      'Haj Qasem hypersonic missile (claimed)',
      'Shahed-136 loitering munition (widely used in Ukraine by Russia)',
      'Mohajer-6 UCAV',
      'Ababil-3 UAV',
      'Fateh-class submarine (midget sub)',
      'Fast attack boats',
      'Anti-ship cruise missiles'
    ],
    status: 'Active',
    description:
      'The IRGC is Iran\'s most powerful military organization, designated a terrorist organization by the United States. It controls Iran\'s ballistic missile program, conducts asymmetric naval operations in the Persian Gulf, and manages proxy forces including Hezbollah, Hamas, the Houthis, and various Iraqi Shia militias (the "Axis of Resistance"). The Quds Force, the IRGC\'s external operations branch, was led by Qasem Soleimani until his assassination by the U.S. in January 2020.',
    combatHistory: [
      'Iran-Iraq War (1980–1988)',
      'Lebanon – Hezbollah creation and support',
      'Syrian Civil War – ground forces deployed',
      'Iraq – militia support',
      'Yemen – Houthi support',
      'Proxy war with Israel',
      'Direct missile/drone strikes on Israel (April 2024)',
      'Persian Gulf incidents'
    ],
    parentId: 'ir-mod'
  },

  {
    id: 'ir-quds-force',
    country: 'Iran',
    branch: 'sof',
    name: 'Quds Force',
    nativeName: 'نیروی قدس (Niruye Qods)',
    motto: '',
    founded: '1988',
    headquarters: 'Tehran',
    strength: '~15,000–20,000 (estimated)',
    type: 'External Operations / Unconventional Warfare Force',
    role: 'Foreign operations, proxy force management, intelligence, unconventional warfare, assassinations',
    commander: 'Commander of the Quds Force',
    currentCommander: 'Brig. Gen. Esmail Qaani (2020–present)',
    bases: ['Tehran (HQ)', 'Multiple covert facilities'],
    equipment: [
      'Various small arms',
      'Explosively formed penetrators (EFPs)',
      'IED systems',
      'Drone systems for proxy forces',
      'Encrypted communications'
    ],
    status: 'Active',
    description:
      'The Quds Force is the external operations branch of the IRGC, responsible for extraterritorial military and intelligence operations. It manages Iran\'s network of proxy forces across the Middle East, including Hezbollah (Lebanon), Hamas and Palestinian Islamic Jihad (Gaza), Houthi rebels (Yemen), and various Iraqi and Syrian Shia militias. Its former commander, Qasem Soleimani, was killed in a U.S. drone strike in Baghdad in January 2020.',
    combatHistory: [
      'Lebanon – Hezbollah operations',
      'Iraq – militia operations against U.S. forces',
      'Syrian Civil War – directing ground forces',
      'Yemen – Houthi support',
      'Various assassinations and covert operations globally'
    ],
    parentId: 'ir-mod'
  },

  // ═══════════════════════════════════════════
  // ───────────────── AUSTRALIA ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'au-adf',
    country: 'Australia',
    branch: 'strategic',
    name: 'Australian Defence Force',
    nativeName: 'ADF',
    motto: '',
    founded: '1901',
    headquarters: 'Russell Offices, Canberra',
    strength: '59,000 active; 28,000 reserve',
    type: 'Unified Defense Force',
    role: 'Defense of Australia, Indo-Pacific security, AUKUS partnership',
    commander: 'Chief of the Defence Force',
    bases: ['Russell Offices, Canberra'],
    equipment: [],
    budget: 'A$55.7 billion (~$36 billion, FY2024-25)',
    status: 'Active',
    description:
      'Australia is a key U.S. ally in the Indo-Pacific and a member of the AUKUS trilateral security partnership (with the U.S. and UK). Under AUKUS, Australia will acquire nuclear-powered attack submarines (SSN-AUKUS). Australia is significantly increasing defense spending in response to the growing Chinese military buildup.',
    combatHistory: [
      'World War I – Gallipoli, Western Front',
      'World War II – North Africa, Pacific',
      'Korean War',
      'Vietnam War',
      'Gulf War',
      'East Timor (1999–2013)',
      'War in Afghanistan (2001–2021)',
      'Iraq War (2003–2009)'
    ],
    parentId: null
  },

  {
    id: 'au-sasr',
    country: 'Australia',
    branch: 'sof',
    name: 'Special Air Service Regiment',
    nativeName: 'SASR',
    motto: 'Who Dares Wins',
    founded: '1957-07-25',
    headquarters: 'Campbell Barracks, Perth, Western Australia',
    strength: '~600',
    type: 'Tier 1 Special Forces',
    role: 'Counter-terrorism, special reconnaissance, direct action, unconventional warfare',
    commander: 'Commanding Officer SASR (Colonel)',
    bases: ['Campbell Barracks, Swanbourne (WA)'],
    equipment: [
      'M4A1 SOPMOD',
      'HK416',
      'F89 Minimi LMG',
      'SR-25 sniper system',
      'SIG Sauer P320-M17',
      'Supacat special operations vehicle',
      'Specialized diving and climbing equipment'
    ],
    status: 'Active',
    description:
      'The SASR is Australia\'s premier special forces unit, modeled after the British SAS. It has been one of the most deployed special operations units in the world since 2001. The SASR faced a major scandal after the Brereton Report (2020) revealed allegations of war crimes by some members in Afghanistan, leading to significant reforms.',
    combatHistory: [
      'Borneo Confrontation (1963–1966)',
      'Vietnam War',
      'Gulf War (1991)',
      'East Timor (1999)',
      'War in Afghanistan (2001–2021)',
      'Iraq War (2003)'
    ],
    parentId: 'au-adf'
  },

  // ═══════════════════════════════════════════
  // ───────────────── CANADA ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'ca-caf',
    country: 'Canada',
    branch: 'strategic',
    name: 'Canadian Armed Forces',
    nativeName: 'Forces armées canadiennes (FAC)',
    motto: '',
    founded: '1968-02-01',
    headquarters: 'National Defence Headquarters, Ottawa',
    strength: '68,000 active; 27,000 reserve',
    type: 'Unified Defense Force',
    role: 'Defense of Canada, NATO commitments, NORAD, peacekeeping',
    commander: 'Chief of the Defence Staff',
    bases: ['CFB Petawawa', 'CFB Edmonton', 'CFB Esquimalt', 'CFB Halifax', 'CFB Gagetown'],
    equipment: [
      'Leopard 2A6M CAN MBT',
      'LAV 6.0 ACSV',
      'CC-177 Globemaster III (C-17)',
      'CF-188 Hornet (being replaced by F-35A)',
      'F-35A Lightning II (on order – 88 aircraft)',
      'CP-140 Aurora (being replaced by P-8A)',
      'CH-148 Cyclone',
      'CH-147F Chinook',
      'Halifax-class frigate',
      'Canadian Surface Combatant (CSC – Type 26, under construction)'
    ],
    budget: 'C$40.4 billion (~$30 billion, FY2024-25)',
    status: 'Active',
    description:
      'The Canadian Armed Forces are a unified force (Army, Navy, Air Force combined in 1968). Canada is a founding NATO member and operates NORAD jointly with the United States. Canada has committed to purchasing 88 F-35A fighters and 15 Type 26 frigates (Canadian Surface Combatant program).',
    combatHistory: [
      'World War I – Vimy Ridge, Passchendaele',
      'World War II – D-Day (Juno Beach), Italy, Netherlands liberation',
      'Korean War',
      'Gulf War (1991)',
      'Somalia (1992–1993)',
      'Kosovo (1999)',
      'War in Afghanistan (2001–2014) – Kandahar',
      'Numerous UN peacekeeping missions'
    ],
    parentId: null
  },

  {
    id: 'ca-jtf2',
    country: 'Canada',
    branch: 'sof',
    name: 'Joint Task Force 2',
    nativeName: 'JTF2 / FOI 2',
    motto: 'Facta Non Verba (Deeds Not Words)',
    founded: '1993-04-01',
    headquarters: 'Dwyer Hill Training Centre, Ottawa',
    strength: '~600 (estimated)',
    type: 'Tier 1 Special Forces',
    role: 'Counter-terrorism, hostage rescue, direct action, close personal protection',
    commander: 'Commanding Officer (Colonel)',
    bases: ['Dwyer Hill Training Centre, Ottawa'],
    equipment: [
      'HK416',
      'C8 SFW (Colt Canada)',
      'SIG Sauer P226/P320',
      'C14 Timberwolf sniper rifle',
      'McMillan TAC-50 sniper rifle (world record long-range kill)',
      'Specialized equipment (classified)'
    ],
    status: 'Active',
    description:
      'JTF2 is Canada\'s elite Tier 1 special operations force, comparable to Delta Force or the SAS. A JTF2 sniper holds the world record for the longest confirmed sniper kill at 3,540 meters in Iraq (2017). JTF2\'s operations are largely classified, and the unit is rarely acknowledged publicly.',
    combatHistory: [
      'Bosnia – SFOR',
      'War in Afghanistan (2001–2014)',
      'Iraq – Operation Impact (2014–present)',
      'Various classified operations'
    ],
    parentId: 'ca-caf'
  },

  // ═══════════════════════════════════════════
  // ───────────────── ITALY ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'it-mod',
    country: 'Italy',
    branch: 'strategic',
    name: 'Italian Armed Forces',
    nativeName: 'Forze armate italiane',
    motto: '',
    founded: '1946',
    headquarters: 'Rome',
    strength: '165,000 active; 20,000 reserve',
    type: 'Unified Military Command',
    role: 'Defense of Italy, NATO commitments, Mediterranean security, peacekeeping',
    commander: 'Minister of Defence / Chief of Defence Staff',
    bases: ['Palazzo Baracchini, Rome'],
    equipment: [],
    budget: '€29 billion (~$31 billion, 2024)',
    status: 'Active',
    description:
      'Italy has the third largest military in Europe and is a NATO founding member. The Italian military has a significant Mediterranean focus and maintains the largest European peacekeeping deployment (UNIFIL in Lebanon). Italy is collaborating with the UK and Japan on the GCAP 6th-generation fighter aircraft.',
    combatHistory: [
      'World War I',
      'World War II',
      'Lebanon – UNIFIL',
      'Gulf War (1991)',
      'Somalia (1992–1994)',
      'Kosovo (1999)',
      'War in Afghanistan (2001–2014)',
      'Iraq (2003–2006)',
      'Libya (2011)'
    ],
    parentId: null
  },

  {
    id: 'it-col-moschin',
    country: 'Italy',
    branch: 'sof',
    name: '9th Parachute Assault Regiment "Col Moschin"',
    nativeName: '9º Reggimento d\'assalto paracadutisti "Col Moschin"',
    motto: 'Ad Maiora (Towards Greater Things)',
    founded: '1917',
    headquarters: 'Livorno, Tuscany',
    strength: '~500',
    type: 'Tier 1 Special Forces',
    role: 'Direct action, special reconnaissance, counter-terrorism, military assistance',
    commander: 'Regimental Commander (Colonel)',
    bases: ['Caserma Vannucci, Livorno'],
    equipment: [
      'Beretta ARX-200',
      'HK416',
      'Beretta PMX',
      'Accuracy International AW50',
      'Beretta APX pistol'
    ],
    status: 'Active',
    description:
      'The 9th "Col Moschin" is Italy\'s premier special forces unit and one of the oldest special operations units in the world, tracing its lineage to the "Arditi" (daring ones) assault troops of World War I. The regiment is part of Italy\'s COFS (Comando Interforze per le Operazioni delle Forze Speciali).',
    combatHistory: [
      'World War I – Arditi operations',
      'World War II',
      'Lebanon – UNIFIL',
      'Somalia (1993)',
      'War in Afghanistan',
      'Iraq'
    ],
    parentId: 'it-mod'
  },

  // ═══════════════════════════════════════════
  // ───────────────── EGYPT ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'eg-mod',
    country: 'Egypt',
    branch: 'strategic',
    name: 'Egyptian Armed Forces',
    nativeName: 'القوات المسلحة المصرية',
    motto: '',
    founded: '1922',
    headquarters: 'Cairo',
    strength: '438,500 active; 479,000 reserve',
    type: 'Unified Military Command',
    role: 'Defense of Egypt, regional security, Suez Canal defense',
    commander: 'Minister of Defence and Commander-in-Chief',
    bases: ['Cairo'],
    equipment: [
      'M1A1 Abrams MBT (1,130+)',
      'T-90S MBT',
      'M2A2 Bradley IFV',
      'Rafale multirole fighter',
      'F-16C/D Fighting Falcon',
      'MiG-29M/M2',
      'Ka-52 Alligator attack helicopter',
      'AH-64D Apache',
      'Mistral-class LHD (2)',
      'FREMM frigate',
      'Type 209/1400 submarine',
      'S-300VM air defense'
    ],
    budget: '$5.4 billion (official, actual estimated higher)',
    status: 'Active',
    description:
      'Egypt has the largest military in the Arab world and Africa. It is a major non-NATO ally of the United States and one of the largest recipients of U.S. military aid. The Egyptian military also plays a significant role in the country\'s economy and politics.',
    combatHistory: [
      'Arab-Israeli War (1948)',
      'Suez Crisis (1956)',
      'North Yemen Civil War (1962–1967)',
      'Six-Day War (1967)',
      'War of Attrition (1969–1970)',
      'Yom Kippur War (1973)',
      'Gulf War (1991)',
      'Sinai insurgency (2011–present)'
    ],
    parentId: null
  },

  // ═══════════════════════════════════════════
  // ───────────────── SAUDI ARABIA ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'sa-mod',
    country: 'Saudi Arabia',
    branch: 'strategic',
    name: 'Saudi Arabian Armed Forces',
    nativeName: 'القوات المسلحة السعودية',
    motto: '',
    founded: '1902',
    headquarters: 'Riyadh',
    strength: '227,000 active; 100,000 National Guard',
    type: 'Unified Military Command',
    role: 'Defense of Saudi Arabia, regional power projection, holy site protection',
    commander: 'Minister of Defense / Chief of the General Staff',
    bases: ['Riyadh (Ministry of Defense)'],
    equipment: [
      'M1A2S Abrams MBT',
      'F-15SA Strike Eagle (most advanced export variant)',
      'F-15S Strike Eagle',
      'Eurofighter Typhoon',
      'AH-64E Apache Guardian',
      'Patriot PAC-3 MSE',
      'THAAD',
      'Various naval vessels'
    ],
    budget: '$75 billion (2024 – one of the highest in the world)',
    status: 'Active',
    description:
      'Saudi Arabia has one of the largest defense budgets in the world and operates some of the most advanced Western military equipment. The Saudi military has been leading the intervention in the Yemeni Civil War since 2015. Despite massive spending, the Saudi military has faced operational challenges in Yemen.',
    combatHistory: [
      'Gulf War (1991) – Battle of Khafji',
      'Yemeni Civil War intervention (2015–present)',
      'Border skirmishes with Houthi rebels'
    ],
    parentId: null
  },

  // ═══════════════════════════════════════════
  // ───────────────── UKRAINE ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'ua-mod',
    country: 'Ukraine',
    branch: 'strategic',
    name: 'Armed Forces of Ukraine',
    nativeName: 'Збройні сили України (ЗСУ)',
    motto: '',
    founded: '1991-12-06',
    headquarters: 'Kyiv',
    strength: '900,000+ (wartime mobilized, 2024)',
    type: 'Unified Military Command',
    role: 'Defense of Ukraine against Russian invasion, territorial integrity',
    commander: 'Commander-in-Chief of the Armed Forces of Ukraine',
    currentCommander: 'Gen. Oleksandr Syrskyi (2024–present)',
    bases: ['General Staff HQ, Kyiv'],
    equipment: [
      'Leopard 2A6/2A4 MBT (donated)',
      'M1A1 Abrams (donated)',
      'Challenger 2 (donated)',
      'T-64BV/BM MBT (indigenous)',
      'T-72 variants',
      'M2A2 Bradley ODS-SA IFV (donated)',
      'CV90 IFV (donated)',
      'Marder IFV (donated)',
      'Stryker APC (donated)',
      'M109A6 Paladin SPH (donated)',
      'PzH 2000 SPH (donated)',
      'CAESAR SPH (donated)',
      'HIMARS (donated – critical weapon system)',
      'M270 MLRS (donated)',
      'IRIS-T SLM air defense (donated)',
      'NASAMS air defense (donated)',
      'Patriot PAC-3 (donated)',
      'Gepard SPAAG (donated)',
      'F-16AM/BM Fighting Falcon (donated, entering service)',
      'Storm Shadow/SCALP cruise missiles (donated)',
      'ATACMS (donated)',
      'Bayraktar TB2 UCAV',
      'Indigenous FPV drones (mass produced)',
      'Naval drones / USVs (indigenous – game-changing)',
      'Neptune anti-ship missile (sank Moskva)'
    ],
    budget: '$42+ billion (2024, including Western aid)',
    status: 'Active – at war',
    description:
      'The Armed Forces of Ukraine have been engaged in a full-scale war with Russia since February 24, 2022, following a conflict in eastern Ukraine that began in 2014. Despite being significantly outmanned and outgunned initially, Ukraine has received massive Western military aid and has demonstrated remarkable battlefield innovation, particularly in drone warfare, electronic warfare, and naval drone operations. Ukraine successfully sank the Russian Black Sea Fleet flagship Moskva and has effectively pushed the Russian Navy out of the western Black Sea using indigenous naval drones.',
    combatHistory: [
      'War in Donbas (2014–2022)',
      'Russo-Ukrainian War (2022–present) – Battle of Kyiv, Kharkiv counteroffensive, Kherson liberation, Bakhmut, Kursk incursion (2024)',
      'Various UN peacekeeping missions (pre-2014)',
      'Iraq War – support mission'
    ],
    parentId: null
  },

  // ═══════════════════════════════════════════
  // ───────────────── POLAND ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'pl-mod',
    country: 'Poland',
    branch: 'strategic',
    name: 'Polish Armed Forces',
    nativeName: 'Siły Zbrojne Rzeczypospolitej Polskiej',
    motto: 'Bóg, Honor, Ojczyzna (God, Honour, Fatherland)',
    founded: '1918-11-11',
    headquarters: 'Warsaw',
    strength: '164,000 active; 36,000 reserve; 40,000 Territorial Defence',
    type: 'Unified Military Command',
    role: 'Defense of Poland, NATO eastern flank security',
    commander: 'Minister of National Defence',
    bases: ['Warsaw'],
    equipment: [
      'K2 Black Panther MBT (ordering 1,000)',
      'Leopard 2A5/2PL MBT',
      'PT-91 Twardy MBT (retiring)',
      'M1A2 SEPv3 Abrams MBT (250 ordered)',
      'Borsuk IFV (indigenous, entering service)',
      'KTO Rosomak 8x8 IFV',
      'K9 Thunder SPH (672 ordered)',
      'Krab 155mm SPH',
      'K239 Chunmoo MLRS (ordered)',
      'HIMARS',
      'F-35A Lightning II (32 ordered)',
      'FA-50 Fighting Eagle (48 ordered)',
      'F-16C/D Block 52+',
      'AW149 helicopter (32 ordered)',
      'AH-64E Apache (96 ordered)',
      'Patriot PAC-3',
      'CAMM air defense',
      'NAREW SHORAD (under development)'
    ],
    budget: '$34.5 billion (2024 – 4.12% of GDP, highest in NATO)',
    status: 'Active',
    description:
      'Poland is undergoing the most massive military buildup in Europe, spending over 4% of GDP on defense (the highest in NATO). Driven by the Russian threat, Poland is acquiring K2 tanks, M1 Abrams, K9 howitzers, F-35s, Apache helicopters, and HIMARS in quantities that will make the Polish military one of the most powerful in Europe by 2030.',
    combatHistory: [
      'Polish-Soviet War (1919–1921)',
      'World War II – September Campaign, Monte Cassino, Market Garden, Berlin',
      'War in Afghanistan (2002–2014)',
      'Iraq War (2003–2008)',
      'NATO Enhanced Forward Presence'
    ],
    parentId: null
  },

  // ═══════════════════════════════════════════
  // ───────────────── BRAZIL ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'br-mod',
    country: 'Brazil',
    branch: 'strategic',
    name: 'Brazilian Armed Forces',
    nativeName: 'Forças Armadas do Brasil',
    motto: '',
    founded: '1822',
    headquarters: 'Brasília',
    strength: '366,500 active; 1,340,000 reserve',
    type: 'Unified Military Command',
    role: 'Defense of Brazil, Amazon protection, regional stability',
    commander: 'Minister of Defence',
    bases: ['Brasília'],
    equipment: [
      'Leopard 1A5 MBT (aging)',
      'VBTP-MR Guarani 6x6 APC (indigenous)',
      'ASTROS II MLRS (indigenous)',
      'Saab Gripen E/F multirole fighter (36)',
      'A-1 AMX (being retired)',
      'KC-390 Millennium transport (indigenous by Embraer)',
      'Super Lynx Mk.21B helicopter',
      'AH-2 Sabre (Mi-35M)',
      'FREMM-based Tamandaré-class frigate (under construction)',
      'Scorpène-class submarine (conventional)',
      'Álvaro Alberto SSN (nuclear submarine – under construction)'
    ],
    budget: '$22.9 billion (2024)',
    status: 'Active',
    description:
      'Brazil has the largest military in Latin America. It is building its first nuclear-powered submarine (the only Latin American country to do so) and operates the Gripen E/F as its primary combat aircraft. Brazil\'s defense industry produces the KC-390 transport aircraft, ASTROS MLRS, and Guarani armored vehicles.',
    combatHistory: [
      'Paraguayan War (1864–1870)',
      'World War I',
      'World War II – Italian Campaign (FEB)',
      'UN peacekeeping – Haiti (MINUSTAH)',
      'Various internal operations – Amazon defense'
    ],
    parentId: null
  },

  // ═══════════════════════════════════════════
  // ───────────────── TAIWAN ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'tw-mod',
    country: 'Taiwan',
    branch: 'strategic',
    name: 'Republic of China Armed Forces',
    nativeName: '中華民國國軍',
    motto: '',
    founded: '1947',
    headquarters: 'Taipei',
    strength: '169,000 active; 1,657,000 reserve',
    type: 'Unified Defense Force',
    role: 'Defense of Taiwan against PRC invasion, deterrence',
    commander: 'President of the ROC (Commander-in-Chief) / Chief of the General Staff',
    bases: ['Ministry of National Defense, Taipei'],
    equipment: [
      'M1A2T Abrams MBT (108 on order)',
      'CM-11 Brave Tiger MBT',
      'CM-34 Clouded Leopard IFV',
      'F-16V Viper (142 – most advanced F-16 variant)',
      'Mirage 2000-5',
      'F-CK-1 Ching-kuo (indigenous)',
      'Hsiung Feng II/III anti-ship missiles (indigenous)',
      'HF-2E Wan Chien cruise missile',
      'Tien Kung III air defense (indigenous)',
      'HAWK SAM',
      'Patriot PAC-3',
      'Harpoon coastal defense system (400 ordered)',
      'HIMARS (on order)',
      'MQ-9B SeaGuardian (on order)',
      'Hai Kung (Sea Bow) submarine (indigenous – launched 2023)'
    ],
    budget: '$19.2 billion (2024 – increasing rapidly)',
    status: 'Active',
    description:
      'Taiwan faces an existential military threat from the People\'s Republic of China, which considers Taiwan a breakaway province. Taiwan is rapidly building up its "porcupine defense" strategy with anti-ship missiles, mines, mobile air defense, and asymmetric warfare capabilities. Taiwan launched its first indigenous submarine (Hai Kun) in 2023 and is acquiring significant U.S. weapons including M1A2 Abrams, HIMARS, and Harpoon missiles.',
    combatHistory: [
      'Chinese Civil War (1927–1949)',
      'First Taiwan Strait Crisis (1954–1955)',
      'Second Taiwan Strait Crisis (1958)',
      'Third Taiwan Strait Crisis (1995–1996)'
    ],
    parentId: null
  },

  // ═══════════════════════════════════════════
  // ───────────────── SWEDEN ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'se-mod',
    country: 'Sweden',
    branch: 'strategic',
    name: 'Swedish Armed Forces',
    nativeName: 'Försvarsmakten',
    motto: '',
    founded: '1521',
    headquarters: 'Stockholm',
    strength: '24,000 active; 11,400 Home Guard; expanding to 90,000+ total by 2030',
    type: 'Unified Defense Force',
    role: 'Defense of Sweden, NATO collective defense (joined 2024), Baltic Sea security',
    commander: 'Supreme Commander of the Swedish Armed Forces',
    bases: ['Multiple garrisons across Sweden'],
    equipment: [
      'Stridsvagn 122 (Leopard 2A5 variant) MBT',
      'CV90 IFV family (indigenous – widely exported)',
      'Archer 155mm wheeled SPH (indigenous)',
      'GRKPBV 90120 mortar carrier',
      'JAS 39E/F Gripen multirole fighter (indigenous by Saab)',
      'GlobalEye AEW&C (indigenous by Saab)',
      'RBS 15 Mk3 anti-ship missile',
      'BILL 2 ATGM',
      'Gotland-class submarine (AIP – world first)',
      'A26 Blekinge-class submarine (under construction)',
      'Visby-class stealth corvette',
      'Carl Gustaf M4 recoilless rifle (indigenous – globally used)',
      'NLAW (indigenous – provided to Ukraine)',
      'Patriot PAC-3 (on order)'
    ],
    budget: 'SEK 126 billion (~$12 billion, 2024)',
    status: 'Active',
    description:
      'Sweden ended 200 years of military non-alignment by joining NATO in March 2024, driven by Russia\'s invasion of Ukraine. Sweden has a powerful defense industry (Saab) producing the Gripen fighter, CV90 IFV, Archer SPH, Carl Gustaf recoilless rifle, and NLAW anti-tank missile. Sweden is rapidly rebuilding its military after years of post-Cold War drawdowns.',
    combatHistory: [
      'Great Northern War (1700–1721)',
      'Various peacekeeping operations – Congo, Bosnia, Afghanistan, Mali',
      'NATO Enhanced Forward Presence – Latvia (2024–present)'
    ],
    parentId: null
  },

  // ═══════════════════════════════════════════
  // ───────────────── FINLAND ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'fi-fdf',
    country: 'Finland',
    branch: 'strategic',
    name: 'Finnish Defence Forces',
    nativeName: 'Puolustusvoimat',
    motto: '',
    founded: '1918-01-25',
    headquarters: 'Helsinki',
    strength: '23,000 active; 870,000 wartime strength (one of the largest reserve forces in Europe)',
    type: 'Unified Defense Force',
    role: 'Territorial defense, NATO collective defense (joined 2023), Arctic warfare',
    commander: 'Commander of the Finnish Defence Forces',
    bases: ['Multiple garrisons across Finland'],
    equipment: [
      'Leopard 2A6 MBT',
      'CV9030FIN IFV',
      'K9 Thunder SPH (on order)',
      'AMOS 120mm mortar system',
      'F/A-18C/D Hornet (being replaced by F-35A)',
      'F-35A Lightning II (64 ordered)',
      'NH90 helicopter',
      'JASSM cruise missile',
      'NASAMS air defense',
      'IRIS-T air defense',
      'Spike ATGM',
      'Patria 6x6 APC (indigenous)',
      'Multiple mine systems and coastal defense'
    ],
    budget: '€6.8 billion (~$7.4 billion, 2024 – 2.3% of GDP)',
    status: 'Active',
    description:
      'Finland joined NATO in April 2023, bringing the alliance its longest land border with Russia (1,340 km). Finland maintains one of Europe\'s largest wartime forces through universal male conscription and an extensive reserve system. Finnish soldiers are renowned experts in Arctic warfare, forest fighting, and guerrilla tactics – capabilities developed through the legacy of the Winter War against the Soviet Union.',
    combatHistory: [
      'Finnish Civil War (1918)',
      'Winter War (1939–1940) – legendary resistance against Soviet invasion',
      'Continuation War (1941–1944)',
      'Lapland War (1944–1945)',
      'ISAF Afghanistan',
      'Various UN peacekeeping missions'
    ],
    parentId: null
  },

  // ═══════════════════════════════════════════
  // ───────────────── SPAIN ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'es-mod',
    country: 'Spain',
    branch: 'strategic',
    name: 'Spanish Armed Forces',
    nativeName: 'Fuerzas Armadas Españolas',
    motto: '',
    founded: '1492',
    headquarters: 'Madrid',
    strength: '120,000 active',
    type: 'Unified Military Command',
    role: 'Defense of Spain, NATO commitments, FCAS/SCAF development partner',
    commander: 'Minister of Defence',
    bases: ['Madrid'],
    equipment: [
      'Leopard 2E MBT',
      'Pizarro IFV',
      'VCR 8x8 Dragon (entering service)',
      'EF-18M Hornet (being replaced)',
      'Eurofighter Typhoon',
      'FCAS/SCAF 6th gen (with France & Germany – in development)',
      'A400M Atlas',
      'NH90 helicopter',
      'Tiger HAD helicopter',
      'Juan Carlos I LHD (amphibious assault carrier)',
      'F-100 Álvaro de Bazán-class frigates (Aegis)',
      'S-80 Plus submarine (indigenous – troubled program)'
    ],
    budget: '€13.2 billion (~$14.3 billion, 2024)',
    status: 'Active',
    description:
      'Spain operates a capable military with a strong naval tradition. The Spanish Navy\'s Juan Carlos I is an LHD that can operate Harriers and helicopters. Spain is a partner in the FCAS/SCAF next-generation fighter with France and Germany, and its F-100 Álvaro de Bazán-class frigates are among the most capable in Europe.',
    combatHistory: [
      'Spanish Civil War (1936–1939)',
      'Gulf War (1991)',
      'Kosovo (1999)',
      'War in Afghanistan (2002–2014)',
      'Iraq War (2003–2004)',
      'Various peacekeeping – Lebanon, Central African Republic'
    ],
    parentId: null
  },

  // ═══════════════════════════════════════════
  // ───────────────── SINGAPORE ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'sg-saf',
    country: 'Singapore',
    branch: 'strategic',
    name: 'Singapore Armed Forces',
    nativeName: 'SAF',
    motto: '',
    founded: '1965',
    headquarters: 'Ministry of Defence, Singapore',
    strength: '51,000 active; 312,500 reserve (National Service)',
    type: 'Unified Defense Force',
    role: 'Defense of Singapore, regional stability, deterrence',
    commander: 'Minister for Defence / Chief of Defence Force',
    bases: ['MINDEF complex, Singapore'],
    equipment: [
      'Leopard 2SG MBT',
      'Hunter AFV IFV (indigenous)',
      'Bionix IFV',
      'F-35B Lightning II (12 ordered)',
      'F-15SG Strike Eagle',
      'F-16D Block 52+',
      'AH-64D Apache',
      'CH-47SD Chinook',
      'Formidable-class frigate (6)',
      'Invincible-class submarine (Type 218SG, building)',
      'Archer-class submarine',
      'SSPH-1 Primus SPH (indigenous)',
      'Aster 30 SAMP/T air defense',
      'SPYDER air defense'
    ],
    budget: 'S$20.5 billion (~$15 billion, FY2024)',
    status: 'Active',
    description:
      'Despite its small size, Singapore maintains one of the most technologically advanced militaries in Southeast Asia, with a defense budget exceeding many larger countries. Singapore operates advanced equipment including F-35Bs (on order), F-15SGs, and German-designed submarines. Universal National Service provides a large trained reserve.',
    combatHistory: [
      'No major combat operations',
      'International peacekeeping – East Timor',
      'Coalition support – Gulf War, Afghanistan'
    ],
    parentId: null
  },

  // ═══════════════════════════════════════════
  // ───────────────── INDONESIA ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'id-tni',
    country: 'Indonesia',
    branch: 'strategic',
    name: 'Indonesian National Armed Forces',
    nativeName: 'Tentara Nasional Indonesia (TNI)',
    motto: 'Tri Dharma Eka Karma',
    founded: '1945-10-05',
    headquarters: 'Jakarta',
    strength: '395,500 active; 400,000 reserve',
    type: 'Unified Military Command',
    role: 'Defense of Indonesia, internal security, counter-insurgency',
    commander: 'Commander of the TNI',
    bases: ['TNI HQ, Cilangkap, Jakarta'],
    equipment: [
      'Leopard 2RI MBT (103)',
      'Marder 1A3 IFV',
      'Anoa 6x6 APC (indigenous by Pindad)',
      'Su-27/Su-30MK2 Flanker',
      'F-16C/D Block 25 (upgraded)',
      'Rafale (42 ordered)',
      'KFX/IFX (KF-21 Boramae joint with South Korea)',
      'Super Tucano A-29 COIN',
      'AH-64E Apache (8)',
      'FREMM frigate (2 ordered)',
      'Nagapasa-class submarine (Type 209/1400)',
      'Scorpène-class submarine (2 ordered)',
      'NASAMS air defense'
    ],
    budget: '$9.4 billion (2024)',
    status: 'Active',
    description:
      'Indonesia has the largest military in Southeast Asia and is undergoing significant modernization, ordering Rafale fighters, FREMM frigates, and Scorpène submarines. The TNI\'s Kopassus (Komando Pasukan Khusus) special forces are highly regarded. Indonesia is a partner in the KF-21 fighter program with South Korea.',
    combatHistory: [
      'Indonesian National Revolution (1945–1949)',
      'Confrontation with Malaysia (1963–1966)',
      'East Timor occupation (1975–1999)',
      'Various internal counter-insurgency operations',
      'Aceh conflict (1976–2005)',
      'Papua conflict'
    ],
    parentId: null
  },

  // ═══════════════════════════════════════════
  // ───────────────── SOUTH AFRICA ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'za-sandf',
    country: 'South Africa',
    branch: 'strategic',
    name: 'South African National Defence Force',
    nativeName: 'SANDF',
    motto: '',
    founded: '1994-04-27',
    headquarters: 'Pretoria',
    strength: '73,000 active; 15,000 reserve',
    type: 'Unified Defense Force',
    role: 'Defense of South Africa, African peacekeeping, border security',
    commander: 'Minister of Defence / Chief of the SANDF',
    bases: ['Defence HQ, Pretoria'],
    equipment: [
      'Olifant Mk.2 MBT (aging)',
      'Ratel IFV (aging)',
      'Rooikat armored car',
      'Badger IFV (Patria AMV, entering service)',
      'Saab Gripen C/D',
      'BAE Hawk Mk.120',
      'Rooivalk attack helicopter (indigenous)',
      'C-130BZ Hercules',
      'A400M Atlas (ordered, then canceled)',
      'Valour-class frigate (MEKO A-200)',
      'Hermes 900 UAV',
      'Denel G6 155mm SPH (indigenous)',
      'Umkhonto SAM (indigenous)'
    ],
    budget: 'R58 billion (~$3.2 billion, FY2024)',
    status: 'Active',
    description:
      'The SANDF was formed in 1994 by merging the old South African Defence Force with forces from the ANC, PAC, and homeland defense forces. South Africa has a significant defense industry (Denel) and has conducted major peacekeeping operations in the DRC, Mozambique, and other African countries. However, budget constraints have severely impacted readiness.',
    combatHistory: [
      'South African Border War (1966–1990)',
      'Peacekeeping – DRC (MONUSCO)',
      'Peacekeeping – Mozambique (2021–present)',
      'Various African Union peacekeeping missions'
    ],
    parentId: null
  },

  // ═══════════════════════════════════════════
  // ───────────────── NETHERLANDS ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'nl-mod',
    country: 'Netherlands',
    branch: 'strategic',
    name: 'Netherlands Armed Forces',
    nativeName: 'Nederlandse krijgsmacht',
    motto: '',
    founded: '1814',
    headquarters: 'The Hague',
    strength: '41,000 active; 5,500 reserve',
    type: 'Unified Defense Force',
    role: 'NATO collective defense, maritime security, international operations',
    commander: 'Minister of Defence',
    bases: ['The Hague'],
    equipment: [
      'Leopard 2A8NL MBT (on order)',
      'CV9035NL IFV',
      'Boxer IFV',
      'PzH 2000 SPH',
      'F-35A Lightning II (52 ordered)',
      'MQ-9 Reaper',
      'NH90 helicopter',
      'CH-47F Chinook',
      'AH-64E Apache',
      'De Zeven Provinciën-class frigate (Aegis)',
      'Walrus-class submarine (replacement under way)',
      'Karel Doorman-class Joint Support Ship',
      'Patriot PAC-3'
    ],
    budget: '€21.4 billion (~$23 billion, 2024)',
    status: 'Active',
    description:
      'The Netherlands has a small but highly capable military, particularly known for its naval and amphibious forces. The Royal Netherlands Army operates in a deeply integrated relationship with the German Bundeswehr. The Netherlands has been a strong supporter of Ukraine, donating F-16s and training Ukrainian pilots.',
    combatHistory: [
      'World War II',
      'Korean War',
      'Bosnia – Srebrenica (UNPROFOR)',
      'Kosovo (1999)',
      'War in Afghanistan – Uruzgan (2006–2010)',
      'Iraq',
      'Mali'
    ],
    parentId: null
  },

  // ═══════════════════════════════════════════
  // ───────────────── NORWAY ─────────────────
  // ═══════════════════════════════════════════

  {
    id: 'no-mod',
    country: 'Norway',
    branch: 'strategic',
    name: 'Norwegian Armed Forces',
    nativeName: 'Forsvaret',
    motto: 'For Alt Vi Har. Og Alt Vi Er. (For Everything We Have. And Everything We Are.)',
    founded: '1628',
    headquarters: 'Oslo',
    strength: '23,000 active; 40,000+ reserve/Home Guard',
    type: 'Unified Defense Force',
    role: 'Arctic defense, NATO northern flank, maritime security',
    commander: 'Chief of Defence',
    bases: ['Multiple across Norway, including northern Norway'],
    equipment: [
      'Leopard 2A7NO MBT (54 on order)',
      'CV9030N IFV',
      'K9 Thunder SPH (24 on order)',
      'F-35A Lightning II (52)',
      'P-8A Poseidon',
      'NH90 helicopter',
      'Fridtjof Nansen-class frigate (Aegis)',
      'Ula-class submarine (being replaced by 212CD)',
      'NSM (Naval Strike Missile – indigenous by Kongsberg, widely exported)',
      'JSM (Joint Strike Missile – F-35 compatible, indigenous)',
      'NASAMS (indigenous – provided to Ukraine)',
      'Coastal Ranger Command (Arctic naval SOF)'
    ],
    budget: 'NOK 90 billion (~$8.5 billion, 2024)',
    status: 'Active',
    description:
      'Norway shares a border with Russia in the Arctic and is a key NATO member for northern flank defense. Norway produces world-leading weapons including the Naval Strike Missile (NSM), Joint Strike Missile (JSM), and NASAMS air defense system through Kongsberg Defence. Norway operates F-35As and is acquiring new submarines jointly with Germany (Type 212CD).',
    combatHistory: [
      'World War II – resistance and liberation',
      'Korean War',
      'War in Afghanistan (2002–2014)',
      'Libya (2011)',
      'Various peacekeeping operations'
    ],
    parentId: null
  }
];

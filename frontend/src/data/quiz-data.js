// src/data/quiz-data.js
// 100+ geo-military trivia questions
// Each question: { id, category, difficulty, question, options, answer, fact }
// answer = index into options (0-based)
// fact = extra info shown after answering

export const QUIZ_CATEGORIES = [
  { id: 'nuclear',    label: '☢️ Nuclear',      color: '#a78bfa' },
  { id: 'conflicts',  label: '⚔️ Conflicts',    color: '#ff3b3b' },
  { id: 'alliances',  label: '🤝 Alliances',    color: '#00d4ff' },
  { id: 'weapons',    label: '🚀 Weapons',       color: '#ff9800' },
  { id: 'geography',  label: '🌍 Geography',     color: '#00e676' },
  { id: 'history',    label: '📜 History',       color: '#f0b429' },
  { id: 'intel',      label: '🕵️ Intelligence', color: '#f472b6' },
];

export const QUIZ_QUESTIONS = [

  // ── NUCLEAR ──────────────────────────────────────────────────────────────────
  { id:'n01', category:'nuclear', difficulty:1,
    question: 'How many countries are officially recognised as nuclear-weapon states under the NPT?',
    options: ['3', '5', '7', '9'],
    answer: 1,
    fact: 'The five NPT-recognised nuclear states are the USA, Russia, China, France and the UK — the permanent UN Security Council members.' },

  { id:'n02', category:'nuclear', difficulty:1,
    question: 'Which country has the largest nuclear warhead stockpile in the world?',
    options: ['United States', 'China', 'Russia', 'France'],
    answer: 2,
    fact: 'Russia holds approximately 5,580 nuclear warheads — the largest stockpile globally, followed by the United States with around 5,044.' },

  { id:'n03', category:'nuclear', difficulty:2,
    question: 'Which country conducted its first nuclear test in 1998, becoming the most recent declared nuclear state?',
    options: ['Iran', 'North Korea', 'Pakistan', 'Israel'],
    answer: 2,
    fact: 'Pakistan tested nuclear devices in May 1998, days after India did the same. Both remain outside the NPT.' },

  { id:'n04', category:'nuclear', difficulty:2,
    question: 'What is the name of North Korea\'s primary nuclear test site?',
    options: ['Yongbyon', 'Punggye-ri', 'Ryongsong', 'Kangson'],
    answer: 1,
    fact: 'Punggye-ri is North Korea\'s only known nuclear test site. Six underground tests were conducted there between 2006 and 2017.' },

  { id:'n05', category:'nuclear', difficulty:3,
    question: 'The Partial Nuclear Test Ban Treaty (1963) prohibited nuclear tests in all environments EXCEPT:',
    options: ['Atmosphere', 'Underwater', 'Underground', 'Space'],
    answer: 2,
    fact: 'Underground tests were exempted — they were considered less dangerous for atmospheric fallout. The CTBT (1996) aimed to ban all tests but has not entered into force.' },

  { id:'n06', category:'nuclear', difficulty:2,
    question: 'Which missile system carries the US submarine-launched nuclear warheads?',
    options: ['Minuteman III', 'Trident II D5', 'Tomahawk', 'B-2 Spirit'],
    answer: 1,
    fact: 'The Trident II D5 is the backbone of the US sea-based nuclear deterrent, carried by Ohio-class submarines.' },

  { id:'n07', category:'nuclear', difficulty:1,
    question: 'Israel\'s policy of neither confirming nor denying its nuclear weapons is known as:',
    options: ['Nuclear ambiguity', 'Strategic deterrence', 'Plausible deniability', 'Second-strike doctrine'],
    answer: 0,
    fact: 'Israel\'s "nuclear ambiguity" or "nuclear opacity" has been maintained since the 1960s. It is widely believed to possess 80–400 nuclear warheads.' },

  { id:'n08', category:'nuclear', difficulty:3,
    question: 'What is the yield of the bomb dropped on Hiroshima in 1945?',
    options: ['5 kilotons', '15 kilotons', '50 kilotons', '100 kilotons'],
    answer: 1,
    fact: 'Little Boy had a yield of approximately 15 kilotons of TNT. Modern strategic warheads can yield 100–800 kilotons.' },

  // ── CONFLICTS ─────────────────────────────────────────────────────────────────
  { id:'c01', category:'conflicts', difficulty:1,
    question: 'In what year did Russia launch its full-scale invasion of Ukraine?',
    options: ['2014', '2020', '2022', '2023'],
    answer: 2,
    fact: 'Russia\'s full-scale invasion began on 24 February 2022. Russia had first seized Crimea and supported separatists in Donbas since 2014.' },

  { id:'c02', category:'conflicts', difficulty:1,
    question: 'Which armed group controls Gaza and triggered the October 2023 conflict with Israel?',
    options: ['Fatah', 'Palestinian Authority', 'Hamas', 'Islamic Jihad'],
    answer: 2,
    fact: 'Hamas has governed Gaza since 2007. Its attack on 7 October 2023 killed approximately 1,200 Israelis and triggered the ongoing conflict.' },

  { id:'c03', category:'conflicts', difficulty:2,
    question: 'The Houthis are a militant group based in which country?',
    options: ['Somalia', 'Yemen', 'Sudan', 'Libya'],
    answer: 1,
    fact: 'The Houthis (Ansar Allah) control much of northwestern Yemen including the capital Sanaa. They have attacked Red Sea shipping since late 2023.' },

  { id:'c04', category:'conflicts', difficulty:2,
    question: 'What does RSF stand for in the Sudan conflict?',
    options: ['Republican Security Force', 'Rapid Support Forces', 'Regional Strike Formation', 'Revolutionary Sudan Front'],
    answer: 1,
    fact: 'The Rapid Support Forces, led by Mohamed Hamdan Dagalo (Hemedti), have been fighting the Sudanese Armed Forces since April 2023.' },

  { id:'c05', category:'conflicts', difficulty:1,
    question: 'Which rebel group, backed by Rwanda, seized Goma in eastern DRC in early 2025?',
    options: ['FDLR', 'ADF', 'M23', 'CNDP'],
    answer: 2,
    fact: 'M23 (March 23 Movement) captured Goma in January 2025. The UN and DRC accuse Rwanda of directly supporting M23.' },

  { id:'c06', category:'conflicts', difficulty:2,
    question: 'The Tatmadaw is the military of which country?',
    options: ['Thailand', 'Cambodia', 'Myanmar', 'Laos'],
    answer: 2,
    fact: 'The Tatmadaw seized power in a coup on 1 February 2021. Since then, resistance forces have captured significant territory.' },

  { id:'c07', category:'conflicts', difficulty:3,
    question: 'Which conflict is known as "Africa\'s World War" due to the number of nations involved?',
    options: ['Sudanese Civil War', 'Second Congo War', 'Sahel Insurgency', 'Libyan Civil War'],
    answer: 1,
    fact: 'The Second Congo War (1998–2003) involved nine African nations and dozens of armed groups. It remains the deadliest conflict since World War II.' },

  { id:'c08', category:'conflicts', difficulty:2,
    question: 'JNIM is the jihadist coalition operating across the Sahel. What does it stand for?',
    options: ['Jamaat Nusrat al-Islam wal Muslimeen', 'Jihad Network in Mali', 'Joint Northern Islamic Movement', 'Jamaat al-Nusra Islamic Militants'],
    answer: 0,
    fact: 'JNIM (Group for the Support of Islam and Muslims) was formed in 2017 and is affiliated with al-Qaeda. It operates across Mali, Burkina Faso and Niger.' },

  { id:'c09', category:'conflicts', difficulty:1,
    question: 'Which strait did Houthi attacks threaten, disrupting global shipping?',
    options: ['Strait of Hormuz', 'Strait of Gibraltar', 'Bab el-Mandeb', 'Malacca Strait'],
    answer: 2,
    fact: 'Bab el-Mandeb connects the Red Sea to the Gulf of Aden. Around 15% of global maritime trade passes through it.' },

  { id:'c10', category:'conflicts', difficulty:3,
    question: 'The Minsk agreements were ceasefires related to which conflict?',
    options: ['Georgia–Russia war', 'Armenia–Azerbaijan', 'Donbas conflict', 'Kosovo crisis'],
    answer: 2,
    fact: 'Minsk I (2014) and Minsk II (2015) attempted to end fighting in Donbas. Both ultimately failed before Russia\'s 2022 full-scale invasion.' },

  { id:'c11', category:'conflicts', difficulty:2,
    question: 'Al-Shabaab is affiliated with which global jihadist network?',
    options: ['ISIS / ISIL', 'Al-Qaeda', 'Taliban', 'Boko Haram'],
    answer: 1,
    fact: 'Al-Shabaab pledged allegiance to al-Qaeda in 2012. It controls significant territory in southern Somalia and conducts attacks in East Africa.' },

  { id:'c12', category:'conflicts', difficulty:2,
    question: 'Which country hosts the largest US military base in the Middle East — Al Udeid Air Base?',
    options: ['Saudi Arabia', 'UAE', 'Qatar', 'Bahrain'],
    answer: 2,
    fact: 'Al Udeid in Qatar hosts approximately 10,000 US military personnel and serves as the forward headquarters of CENTCOM.' },

  // ── ALLIANCES ─────────────────────────────────────────────────────────────────
  { id:'a01', category:'alliances', difficulty:1,
    question: 'How many countries are currently members of NATO?',
    options: ['28', '30', '32', '35'],
    answer: 2,
    fact: 'NATO has 32 members as of 2024 after Sweden joined in March 2024, becoming the most recent addition.' },

  { id:'a02', category:'alliances', difficulty:1,
    question: 'Which article of the NATO treaty is the collective defence clause?',
    options: ['Article 3', 'Article 5', 'Article 7', 'Article 10'],
    answer: 1,
    fact: 'Article 5 states that an attack on one member is an attack on all. It has only been formally invoked once — after the September 11, 2001 attacks.' },

  { id:'a03', category:'alliances', difficulty:2,
    question: 'The AUKUS security pact involves Australia, the UK and which other country?',
    options: ['Canada', 'Japan', 'United States', 'New Zealand'],
    answer: 2,
    fact: 'AUKUS was announced in September 2021. Its centrepiece is providing Australia with nuclear-powered (not nuclear-armed) submarines.' },

  { id:'a04', category:'alliances', difficulty:2,
    question: 'The Shanghai Cooperation Organisation (SCO) was founded primarily by Russia and which other major power?',
    options: ['India', 'China', 'Iran', 'Pakistan'],
    answer: 1,
    fact: 'The SCO was founded in 2001 by Russia, China and four Central Asian states. India and Pakistan joined in 2017; Iran joined in 2023.' },

  { id:'a05', category:'alliances', difficulty:3,
    question: 'Which country is a member of the EU but NOT a member of NATO?',
    options: ['Poland', 'Austria', 'Romania', 'Czech Republic'],
    answer: 1,
    fact: 'Austria maintains constitutional neutrality and is therefore not a NATO member, despite being an EU member since 1995.' },

  { id:'a06', category:'alliances', difficulty:2,
    question: 'The Five Eyes intelligence alliance consists of the US, UK, Canada, Australia and:',
    options: ['New Zealand', 'France', 'Germany', 'Japan'],
    answer: 0,
    fact: 'Five Eyes (FVEY) is a signals intelligence alliance dating back to the UKUSA Agreement of 1946. It is the world\'s most comprehensive intelligence sharing arrangement.' },

  { id:'a07', category:'alliances', difficulty:1,
    question: 'Which military alliance did the Soviet Union lead during the Cold War?',
    options: ['SEATO', 'Warsaw Pact', 'CSTO', 'Comintern'],
    answer: 1,
    fact: 'The Warsaw Pact (1955–1991) was the Soviet counterpart to NATO. It dissolved in 1991 following the collapse of the USSR.' },

  { id:'a08', category:'alliances', difficulty:3,
    question: 'What percentage of GDP does NATO ask member states to spend on defence?',
    options: ['1%', '1.5%', '2%', '3%'],
    answer: 2,
    fact: 'The 2% GDP target was agreed at the 2014 Wales Summit. As of 2024, 23 of 32 members meet or exceed this target.' },

  // ── WEAPONS ───────────────────────────────────────────────────────────────────
  { id:'w01', category:'weapons', difficulty:1,
    question: 'What does HIMARS stand for?',
    options: ['High-Impact Missile Artillery Rocket System', 'High Mobility Artillery Rocket System', 'Heavy Infantry Mobile Artillery Range System', 'Hybrid Integrated Missile And Rocket System'],
    answer: 1,
    fact: 'HIMARS is a US-made light multiple rocket launcher. Ukraine received HIMARS in 2022 and used them to strike Russian logistics deep behind front lines.' },

  { id:'w02', category:'weapons', difficulty:2,
    question: 'The Iron Dome is an air defence system developed by which country?',
    options: ['USA', 'Germany', 'Israel', 'South Korea'],
    answer: 2,
    fact: 'Iron Dome was developed by Rafael Advanced Defense Systems and IAI. It intercepts short-range rockets and artillery shells and has a claimed interception rate above 90%.' },

  { id:'w03', category:'weapons', difficulty:2,
    question: 'Which country operates the most advanced hypersonic missile — the Avangard — capable of Mach 27?',
    options: ['China', 'USA', 'Russia', 'North Korea'],
    answer: 2,
    fact: 'Russia\'s Avangard hypersonic glide vehicle entered service in 2019 and can manoeuvre to evade missile defence systems.' },

  { id:'w04', category:'weapons', difficulty:1,
    question: 'What type of weapon is the Bayraktar TB2, widely used in recent conflicts?',
    options: ['Fighter jet', 'Armed drone (UAV)', 'Anti-tank missile', 'Naval torpedo'],
    answer: 1,
    fact: 'The Bayraktar TB2 is a Turkish-made armed drone used effectively by Ukraine, Azerbaijan and others. It gained global attention during the 2020 Nagorno-Karabakh war.' },

  { id:'w05', category:'weapons', difficulty:3,
    question: 'What is the approximate top speed of the Russian T-14 Armata main battle tank?',
    options: ['45 km/h', '60 km/h', '80 km/h', '120 km/h'],
    answer: 2,
    fact: 'The T-14 Armata can reach approximately 80 km/h on roads. It features an unmanned turret — a first for a production MBT.' },

  { id:'w06', category:'weapons', difficulty:2,
    question: 'Which country is the world\'s largest arms exporter?',
    options: ['Russia', 'France', 'United States', 'China'],
    answer: 2,
    fact: 'The USA accounts for approximately 40% of global arms exports. Its main customers are Middle Eastern states and NATO allies.' },

  { id:'w07', category:'weapons', difficulty:2,
    question: 'The F-35 Lightning II is built by which company?',
    options: ['Boeing', 'Northrop Grumman', 'Lockheed Martin', 'Raytheon'],
    answer: 2,
    fact: 'The F-35 is the world\'s most expensive weapons program at over $1.7 trillion lifetime cost. Three variants exist: F-35A (conventional), F-35B (STOVL), F-35C (carrier).' },

  { id:'w08', category:'weapons', difficulty:3,
    question: 'What does MANPADS stand for?',
    options: ['Man-Portable Air Defence System', 'Mobile Anti-Aircraft Platform Defence System', 'Multi-Axis Naval Patrol Defence Shield', 'Military Advanced Navigation and Positioning Defence System'],
    answer: 0,
    fact: 'MANPADS are shoulder-launched surface-to-air missiles. The US-made Stinger and Russian-made Igla are among the most widely used.' },

  // ── GEOGRAPHY ─────────────────────────────────────────────────────────────────
  { id:'g01', category:'geography', difficulty:1,
    question: 'Which body of water separates Europe from Africa at its narrowest point?',
    options: ['Suez Canal', 'Bosphorus Strait', 'Strait of Gibraltar', 'Dardanelles'],
    answer: 2,
    fact: 'The Strait of Gibraltar is only 14 km wide at its narrowest. It is a critical NATO choke point and the gateway to the Mediterranean.' },

  { id:'g02', category:'geography', difficulty:2,
    question: 'The Kaliningrad exclave — a strategically important Russian territory — borders which two NATO countries?',
    options: ['Poland and Lithuania', 'Estonia and Latvia', 'Finland and Sweden', 'Norway and Estonia'],
    answer: 0,
    fact: 'Kaliningrad is a Russian exclave sandwiched between Poland and Lithuania, both NATO members. It hosts significant Russian military assets.' },

  { id:'g03', category:'geography', difficulty:1,
    question: 'Through which canal does approximately 12% of global trade pass, making it a frequent conflict flashpoint?',
    options: ['Panama Canal', 'Kiel Canal', 'Corinth Canal', 'Suez Canal'],
    answer: 3,
    fact: 'The Suez Canal connects the Mediterranean to the Red Sea. The Ever Given blockage in 2021 cost the global economy ~$9.6 billion per day.' },

  { id:'g04', category:'geography', difficulty:2,
    question: 'Which island nation, claimed by China, has its own military of approximately 170,000 active personnel?',
    options: ['Hong Kong', 'Macau', 'Taiwan', 'Hainan'],
    answer: 2,
    fact: 'Taiwan\'s Republic of China Armed Forces has about 170,000 active and 1.5 million reserve personnel. Taiwan spends approximately 2.5% of GDP on defence.' },

  { id:'g05', category:'geography', difficulty:3,
    question: 'The Wakhan Corridor is a narrow strip of Afghanistan that borders which four countries?',
    options: ['Iran, Pakistan, India, China', 'Pakistan, Tajikistan, China, India', 'Tajikistan, China, Pakistan, Uzbekistan', 'Turkmenistan, Tajikistan, China, Pakistan'],
    answer: 1,
    fact: 'The Wakhan Corridor was created by the British Empire in 1893 as a buffer between British India and the Russian Empire. It borders Pakistan, Tajikistan, China, and India (through the disputed Kashmir region).' },

  { id:'g06', category:'geography', difficulty:2,
    question: 'Gotland is a strategically vital island in the Baltic Sea belonging to which country?',
    options: ['Denmark', 'Finland', 'Estonia', 'Sweden'],
    answer: 3,
    fact: 'Gotland\'s central position in the Baltic makes it strategically crucial for NATO\'s defence of the region. Sweden has significantly increased its military presence there since Russia\'s 2022 invasion of Ukraine.' },

  { id:'g07', category:'geography', difficulty:1,
    question: 'The Golan Heights is a disputed territory controlled by Israel but claimed by which country?',
    options: ['Lebanon', 'Jordan', 'Syria', 'Palestine'],
    answer: 2,
    fact: 'Israel captured the Golan Heights from Syria in 1967 and annexed it in 1981. The US recognised Israeli sovereignty in 2019 — a position most countries do not share.' },

  // ── HISTORY ───────────────────────────────────────────────────────────────────
  { id:'h01', category:'history', difficulty:1,
    question: 'Which event in 1991 marked the official end of the Cold War?',
    options: ['Fall of the Berlin Wall', 'Gulf War ended', 'Dissolution of the Soviet Union', 'German reunification'],
    answer: 2,
    fact: 'The Soviet Union was formally dissolved on 25 December 1991 when Mikhail Gorbachev resigned. 15 independent states emerged.' },

  { id:'h02', category:'history', difficulty:2,
    question: 'Operation Desert Storm (1991) was the military campaign to liberate which country?',
    options: ['Iraq', 'Kuwait', 'Saudi Arabia', 'Jordan'],
    answer: 1,
    fact: 'Iraq invaded Kuwait on 2 August 1990. Desert Storm, led by the US-led coalition, expelled Iraqi forces in just 100 hours of ground combat.' },

  { id:'h03', category:'history', difficulty:2,
    question: 'The Dayton Agreement of 1995 ended the war in which country?',
    options: ['Croatia', 'Kosovo', 'Bosnia and Herzegovina', 'Serbia'],
    answer: 2,
    fact: 'The Dayton Agreement was signed at Wright-Patterson Air Force Base in Ohio. It ended the Bosnian War (1992–1995) which killed approximately 100,000 people.' },

  { id:'h04', category:'history', difficulty:1,
    question: 'The 9/11 attacks triggered the invocation of NATO\'s Article 5. The subsequent invasion of Afghanistan was called:',
    options: ['Operation Enduring Freedom', 'Operation Iraqi Freedom', 'Operation Infinite Reach', 'Operation Noble Eagle'],
    answer: 0,
    fact: 'Operation Enduring Freedom began on 7 October 2001. The US and allies withdrew from Afghanistan in 2021 after 20 years — the longest war in US history.' },

  { id:'h05', category:'history', difficulty:3,
    question: 'In which year did China conduct its most recent nuclear weapons test?',
    options: ['1980', '1988', '1996', '2002'],
    answer: 2,
    fact: 'China conducted its last nuclear test on 29 July 1996, before signing the Comprehensive Nuclear-Test-Ban Treaty. It has since maintained a moratorium.' },

  { id:'h06', category:'history', difficulty:2,
    question: 'The Falklands War of 1982 was fought between the UK and which country?',
    options: ['Chile', 'Brazil', 'Argentina', 'Uruguay'],
    answer: 2,
    fact: 'Argentina invaded the Falkland Islands on 2 April 1982. After 74 days of fighting, British forces retook the islands. 907 people died in total.' },

  { id:'h07', category:'history', difficulty:2,
    question: 'Which treaty, signed in 1987, eliminated an entire class of US and Soviet nuclear missiles?',
    options: ['START I', 'SALT II', 'INF Treaty', 'NPT'],
    answer: 2,
    fact: 'The Intermediate-Range Nuclear Forces (INF) Treaty eliminated all ground-launched missiles with ranges of 500–5,500 km. The US withdrew in 2019, accusing Russia of violations.' },

  // ── INTELLIGENCE ──────────────────────────────────────────────────────────────
  { id:'i01', category:'intel', difficulty:1,
    question: 'What does CIA stand for?',
    options: ['Central Intelligence Agency', 'Covert Intelligence Administration', 'Combat Intelligence Authority', 'Central Investigations Agency'],
    answer: 0,
    fact: 'The CIA was established in 1947 under the National Security Act. It is the US foreign intelligence service, separate from the FBI which handles domestic intelligence.' },

  { id:'i02', category:'intel', difficulty:2,
    question: 'Mossad is the intelligence agency of which country?',
    options: ['Jordan', 'Saudi Arabia', 'Israel', 'UAE'],
    answer: 2,
    fact: 'Mossad (Institute for Intelligence and Special Operations) is Israel\'s national intelligence agency. It is widely considered one of the world\'s most effective spy agencies.' },

  { id:'i03', category:'intel', difficulty:2,
    question: 'The GRU is Russia\'s military intelligence agency. What does GRU stand for in Russian?',
    options: ['General Reconnaissance Unit', 'Main Intelligence Directorate', 'Global Russian Union', 'Government Research Unit'],
    answer: 1,
    fact: 'GRU (Glavnoye Razvedyvatelnoye Upravleniye) is Russia\'s military intelligence directorate. It is distinct from the FSB (domestic) and SVR (foreign civilian intelligence).' },

  { id:'i04', category:'intel', difficulty:1,
    question: 'SIGINT stands for which type of intelligence gathering?',
    options: ['Signal Intelligence', 'Satellite Intelligence', 'Strategic Intelligence', 'Surveillance Intelligence'],
    answer: 0,
    fact: 'SIGINT (Signals Intelligence) involves intercepting communications and electronic signals. The NSA is the primary US SIGINT agency.' },

  { id:'i05', category:'intel', difficulty:3,
    question: 'Which spy satellite program, declassified in 1995, was the first US reconnaissance satellite?',
    options: ['HEXAGON', 'GAMBIT', 'CORONA', 'KEYHOLE'],
    answer: 2,
    fact: 'CORONA (1959–1972) was the first US photoreconnaissance satellite. Its photos revealed that the "missile gap" with the USSR was overstated.' },

  { id:'i06', category:'intel', difficulty:2,
    question: 'OSINT refers to intelligence gathered from:',
    options: ['Overseas spy networks', 'Open-source publicly available information', 'Orbital satellite reconnaissance', 'Official secret intelligence transfers'],
    answer: 1,
    fact: 'OSINT (Open-Source Intelligence) uses publicly available information — news, social media, satellite imagery services like Google Earth. Bellingcat pioneered OSINT journalism.' },

  { id:'i07', category:'intel', difficulty:2,
    question: 'Which country operates Unit 8200, one of the world\'s most capable signals intelligence units?',
    options: ['USA', 'UK', 'Israel', 'China'],
    answer: 2,
    fact: 'Unit 8200 is the Israeli Defense Forces\' elite SIGINT unit. Many alumni have gone on to found major cybersecurity companies including Check Point and CyberArk.' },

  { id:'i08', category:'intel', difficulty:3,
    question: 'The "Vault 7" leak in 2017 exposed the hacking tools of which intelligence agency?',
    options: ['NSA', 'CIA', 'FBI', 'GCHQ'],
    answer: 1,
    fact: 'WikiLeaks published Vault 7 — the largest ever leak of CIA documents — in March 2017, revealing an arsenal of cyber weapons and hacking techniques.' },
];

// ── Daily question selection ───────────────────────────────────────────────────
// Uses the date as a seed so every user gets the same 5 questions on the same day

function dateToSeed(dateStr) {
  // dateStr format: "2026-03-22"
  return dateStr.split('-').reduce((acc, n) => acc * 31 + parseInt(n), 0);
}

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function getDailyQuestions(dateStr, count = 5) {
  const seed = dateToSeed(dateStr);
  const rand = seededRandom(seed);
  const pool = [...QUIZ_QUESTIONS];

  // Fisher-Yates shuffle with seeded random
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Ensure variety — try to pick from different categories
  const selected = [];
  const usedCats = new Set();
  for (const q of pool) {
    if (selected.length >= count) break;
    if (!usedCats.has(q.category) || selected.length >= QUIZ_CATEGORIES.length) {
      selected.push(q);
      usedCats.add(q.category);
    }
  }
  // Fill remaining if needed
  for (const q of pool) {
    if (selected.length >= count) break;
    if (!selected.find(s => s.id === q.id)) selected.push(q);
  }

  return selected.slice(0, count);
}

export function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}
// src/data/sanctions-data.js
// Sources: UN Security Council, OFAC SDN List, EU Consolidated List,
// UK OFSI, Arms Control Association, 2024 data

export const ISSUERS = [
  { id: 'UN',  name: 'United Nations', color: '#1a6ed8', flag: '🇺🇳' },
  { id: 'US',  name: 'United States',  color: '#c62828', flag: '🇺🇸' },
  { id: 'EU',  name: 'European Union', color: '#1565c0', flag: '🇪🇺' },
  { id: 'UK',  name: 'United Kingdom', color: '#6a1b9a', flag: '🇬🇧' },
];

export const SANCTION_TYPES = [
  { id: 'arms',      label: 'Arms Embargo',        icon: '🚫', color: '#c62828' },
  { id: 'financial', label: 'Financial/Asset Freeze', icon: '💰', color: '#e65100' },
  { id: 'travel',    label: 'Travel Ban',           icon: '✈️', color: '#6a1b9a' },
  { id: 'trade',     label: 'Trade Restrictions',   icon: '📦', color: '#2e7d32' },
  { id: 'oil',       label: 'Oil/Energy Sanctions', icon: '🛢️', color: '#558b2f' },
];

export const SANCTIONED_COUNTRIES = [

  // ── RUSSIA ──────────────────────────────────────────────────────────────────
  {
    iso3: 'RUS', name: 'Russia', flag: '🇷🇺',
    severity: 'critical',
    summary: 'Comprehensive sanctions following the 2022 full-scale invasion of Ukraine. Largest sanctions regime since WWII.',
    sanctions: [
      {
        id: 'rus-eu-arms',
        issuer: 'EU', type: 'arms',
        title: 'EU Arms Embargo on Russia',
        imposed: '2014-07-31', expanded: '2022-02-28',
        description: 'Full prohibition on export of arms, military equipment, and dual-use goods. Expanded after Feb 2022 invasion.',
        status: 'active',
        legalBasis: 'Council Decision 2014/512/CFSP; Regulation 833/2014',
      },
      {
        id: 'rus-us-financial',
        issuer: 'US', type: 'financial',
        title: 'OFAC Full Blocking Sanctions',
        imposed: '2022-02-24',
        description: 'Blocking sanctions on major Russian banks (Sberbank, VTB), sovereign debt restrictions, and asset freezes. ~$300B in Russian central bank assets frozen.',
        status: 'active',
        legalBasis: 'EO 14024, EO 13685',
      },
      {
        id: 'rus-uk-financial',
        issuer: 'UK', type: 'financial',
        title: 'UK Russia Financial Sanctions',
        imposed: '2022-02-24',
        description: 'Asset freezes on 1,500+ individuals and entities. Full banking sector restrictions.',
        status: 'active',
        legalBasis: 'Russia (Sanctions) (EU Exit) Regulations 2019',
      },
      {
        id: 'rus-eu-oil',
        issuer: 'EU', type: 'oil',
        title: 'EU Oil Price Cap & Embargo',
        imposed: '2022-12-05',
        description: 'Import ban on Russian crude oil and petroleum products. G7 price cap of $60/barrel enforced via shipping/insurance restrictions.',
        status: 'active',
        legalBasis: 'Council Regulation (EU) 2022/1854',
      },
      {
        id: 'rus-eu-trade',
        issuer: 'EU', type: 'trade',
        title: 'EU Comprehensive Trade Sanctions',
        imposed: '2022-03-01',
        description: '15 packages of sanctions. Bans on steel, luxury goods, technology exports. ~€43.9B in trade affected annually.',
        status: 'active',
        legalBasis: 'Multiple Council Regulations 2022–2024',
      },
      {
        id: 'rus-us-travel',
        issuer: 'US', type: 'travel',
        title: 'US Visa Restrictions',
        imposed: '2022-03-11',
        description: 'Travel bans on senior officials, oligarchs, Duma members, and their families. 1,000+ individuals.',
        status: 'active',
        legalBasis: 'INA Section 212(a)(3)(C)',
      },
    ],
  },

  // ── IRAN ────────────────────────────────────────────────────────────────────
  {
    iso3: 'IRN', name: 'Iran', flag: '🇮🇷',
    severity: 'critical',
    summary: 'Decades-long sanctions regime covering nuclear program, ballistic missiles, terrorism support, and human rights abuses.',
    sanctions: [
      {
        id: 'irn-un-arms',
        issuer: 'UN', type: 'arms',
        title: 'UN Arms Embargo (Partial)',
        imposed: '2006-12-23', expired: '2020-10-18',
        description: 'Conventional arms embargo expired Oct 2020 per JCPOA terms despite US opposition. Missile-related restrictions remain under UNSCR 2231.',
        status: 'partial',
        legalBasis: 'UNSCR 2231 (2015)',
      },
      {
        id: 'irn-us-financial',
        issuer: 'US', type: 'financial',
        title: 'OFAC Iran Comprehensive Sanctions',
        imposed: '1979-11-14',
        description: 'Most comprehensive bilateral sanctions regime in the world. Covers banking, oil, shipping, and virtually all trade. Re-imposed in full after 2018 JCPOA withdrawal.',
        status: 'active',
        legalBasis: 'IEEPA, ISA, CISADA, EO 13599',
      },
      {
        id: 'irn-eu-oil',
        issuer: 'EU', type: 'oil',
        title: 'EU Oil Embargo on Iran',
        imposed: '2012-07-01',
        description: 'Full ban on import of Iranian crude oil, petroleum products, petrochemical products. Prohibition on related financing and insurance.',
        status: 'active',
        legalBasis: 'Council Regulation (EU) 267/2012',
      },
      {
        id: 'irn-un-financial',
        issuer: 'UN', type: 'financial',
        title: 'UN Financial Sanctions',
        imposed: '2006-12-23',
        description: 'Asset freezes on individuals and entities linked to nuclear and ballistic missile programs. IRGC-designated entities.',
        status: 'active',
        legalBasis: 'UNSCR 1737, 1747, 1803, 1929, 2231',
      },
      {
        id: 'irn-us-travel',
        issuer: 'US', type: 'travel',
        title: 'US Travel Restrictions on Iranian Officials',
        imposed: '2019-09-24',
        description: 'Travel bans on Supreme Leader, senior IRGC commanders, government officials and families.',
        status: 'active',
        legalBasis: 'EO 13876',
      },
    ],
  },

  // ── NORTH KOREA ─────────────────────────────────────────────────────────────
  {
    iso3: 'PRK', name: 'North Korea', flag: '🇰🇵',
    severity: 'critical',
    summary: 'Most comprehensive UN sanctions regime ever imposed on a country. Covers virtually all trade in response to nuclear weapons program.',
    sanctions: [
      {
        id: 'prk-un-arms',
        issuer: 'UN', type: 'arms',
        title: 'UN Total Arms Embargo',
        imposed: '2006-10-14',
        description: 'Complete ban on all arms transfers to and from DPRK. No exceptions. Violations subject to interdiction.',
        status: 'active',
        legalBasis: 'UNSCR 1718, 1874, 2087, 2094, 2270',
      },
      {
        id: 'prk-un-trade',
        issuer: 'UN', type: 'trade',
        title: 'UN Comprehensive Trade Sanctions',
        imposed: '2017-08-05',
        description: 'Ban on coal, iron, lead, seafood exports (DPRK\'s main revenue). Cap on oil imports (500,000 barrels/year refined, 4M crude). Estimated $1B annual revenue loss.',
        status: 'active',
        legalBasis: 'UNSCR 2371, 2375, 2397',
      },
      {
        id: 'prk-un-financial',
        issuer: 'UN', type: 'financial',
        title: 'UN Financial Sanctions',
        imposed: '2006-10-14',
        description: 'Asset freezes on government, WMD programs, Korean Workers\' Party entities. Ban on joint ventures, financial services.',
        status: 'active',
        legalBasis: 'UNSCR 1718, 2270, 2321',
      },
      {
        id: 'prk-us-financial',
        issuer: 'US', type: 'financial',
        title: 'OFAC DPRK Sanctions',
        imposed: '2008-06-26',
        description: 'Blocking sanctions on DPRK government, Workers Party, military. Secondary sanctions on third-country entities transacting with DPRK.',
        status: 'active',
        legalBasis: 'EO 13551, 13687, 13722, 13810',
      },
      {
        id: 'prk-un-travel',
        issuer: 'UN', type: 'travel',
        title: 'UN Travel Ban on DPRK Officials',
        imposed: '2006-10-14',
        description: 'Travel ban on designated officials involved in nuclear and ballistic missile programs. ~80 individuals listed.',
        status: 'active',
        legalBasis: 'UNSCR 1718',
      },
    ],
  },

  // ── MYANMAR ─────────────────────────────────────────────────────────────────
  {
    iso3: 'MMR', name: 'Myanmar', flag: '🇲🇲',
    severity: 'high',
    summary: 'Sanctions imposed following the February 2021 military coup and subsequent violent crackdowns on civilians.',
    sanctions: [
      {
        id: 'mmr-us-arms',
        issuer: 'US', type: 'arms',
        title: 'US Arms Embargo on Myanmar Military',
        imposed: '2021-02-11',
        description: 'Prohibition on export of defense articles and services to Myanmar military (Tatmadaw). Expanded after coup.',
        status: 'active',
        legalBasis: 'EO 14014, BURMA Act',
      },
      {
        id: 'mmr-eu-arms',
        issuer: 'EU', type: 'arms',
        title: 'EU Arms Embargo on Myanmar',
        imposed: '2018-04-26', expanded: '2021-03-22',
        description: 'Full arms embargo significantly expanded after 2021 coup. Includes dual-use goods that could be used for repression.',
        status: 'active',
        legalBasis: 'Council Decision 2021/711/CFSP',
      },
      {
        id: 'mmr-us-financial',
        issuer: 'US', type: 'financial',
        title: 'OFAC Myanmar Sanctions',
        imposed: '2021-02-11',
        description: 'Blocking sanctions on military leadership, junta members, military-owned conglomerates MEHL and MEC.',
        status: 'active',
        legalBasis: 'EO 14014',
      },
      {
        id: 'mmr-eu-travel',
        issuer: 'EU', type: 'travel',
        title: 'EU Travel Bans on Junta Leaders',
        imposed: '2021-03-22',
        description: 'Travel bans and asset freezes on 90+ military officials including Min Aung Hlaing and senior Tatmadaw commanders.',
        status: 'active',
        legalBasis: 'Council Decision 2021/711/CFSP',
      },
    ],
  },

  // ── SYRIA ───────────────────────────────────────────────────────────────────
  {
    iso3: 'SYR', name: 'Syria', flag: '🇸🇾',
    severity: 'high',
    summary: 'Broad sanctions in response to Assad regime\'s violence against civilians during civil war. Ongoing since 2011.',
    sanctions: [
      {
        id: 'syr-us-financial',
        issuer: 'US', type: 'financial',
        title: 'Caesar Syria Civilian Protection Act',
        imposed: '2020-06-17',
        description: 'Sweeping secondary sanctions targeting anyone doing business with Assad government. Named after defected military photographer.',
        status: 'active',
        legalBasis: 'Caesar Act, EO 13894',
      },
      {
        id: 'syr-eu-oil',
        issuer: 'EU', type: 'oil',
        title: 'EU Oil Embargo on Syria',
        imposed: '2011-09-02',
        description: 'Full ban on import of Syrian petroleum products. Prohibition on related financing, insurance.',
        status: 'active',
        legalBasis: 'Council Regulation (EU) 36/2012',
      },
      {
        id: 'syr-us-arms',
        issuer: 'US', type: 'arms',
        title: 'US Arms Embargo on Syria',
        imposed: '1986-01-01',
        description: 'Long-standing arms embargo. Expanded significantly since 2011 civil war.',
        status: 'active',
        legalBasis: 'EAR, AECA, EO 13894',
      },
      {
        id: 'syr-eu-travel',
        issuer: 'EU', type: 'travel',
        title: 'EU Travel Bans — Assad Regime',
        imposed: '2011-05-09',
        description: 'Travel bans on 316 individuals and 81 entities linked to Assad regime, including family members.',
        status: 'active',
        legalBasis: 'Council Decision 2011/273/CFSP',
      },
    ],
  },

  // ── BELARUS ─────────────────────────────────────────────────────────────────
  {
    iso3: 'BLR', name: 'Belarus', flag: '🇧🇾',
    severity: 'high',
    summary: 'Sanctions following stolen 2020 election, violent crackdown on protesters, and support for Russia\'s Ukraine invasion.',
    sanctions: [
      {
        id: 'blr-eu-financial',
        issuer: 'EU', type: 'financial',
        title: 'EU Belarus Financial Sanctions',
        imposed: '2020-10-02',
        description: 'Asset freezes on Lukashenko, family, and 200+ officials. Expanded after Ryanair flight forced landing.',
        status: 'active',
        legalBasis: 'Council Decision 2020/1388/CFSP',
      },
      {
        id: 'blr-eu-trade',
        issuer: 'EU', type: 'trade',
        title: 'EU Belarus Potash & Trade Sanctions',
        imposed: '2021-06-24',
        description: 'Bans on potash (Belarus\' main export), petroleum, steel, tobacco. Estimated €2.8B annual trade impact.',
        status: 'active',
        legalBasis: 'Council Regulation (EU) 2021/1030',
      },
      {
        id: 'blr-us-financial',
        issuer: 'US', type: 'financial',
        title: 'OFAC Belarus Sanctions',
        imposed: '2021-08-09',
        description: 'Blocking sanctions on Lukashenko, state-owned enterprises, potash producer Belaruskali.',
        status: 'active',
        legalBasis: 'EO 14038',
      },
      {
        id: 'blr-eu-arms',
        issuer: 'EU', type: 'arms',
        title: 'EU Arms Embargo on Belarus',
        imposed: '2020-10-02',
        description: 'Full arms embargo. Extended to cover internal repression equipment.',
        status: 'active',
        legalBasis: 'Council Decision 2020/1388/CFSP',
      },
    ],
  },

  // ── CHINA ───────────────────────────────────────────────────────────────────
  {
    iso3: 'CHN', name: 'China', flag: '🇨🇳',
    severity: 'medium',
    summary: 'Targeted sanctions on human rights abuses (Xinjiang, Hong Kong), military-linked entities, and technology controls.',
    sanctions: [
      {
        id: 'chn-us-trade',
        issuer: 'US', type: 'trade',
        title: 'US Technology Export Controls',
        imposed: '2022-10-07',
        description: 'Sweeping semiconductor and advanced chip export controls. Entity list restrictions on 1,000+ Chinese companies including Huawei, SMIC.',
        status: 'active',
        legalBasis: 'EAR, Entity List (15 CFR Part 744)',
      },
      {
        id: 'chn-eu-arms',
        issuer: 'EU', type: 'arms',
        title: 'EU Arms Embargo — Tiananmen',
        imposed: '1989-06-27',
        description: 'Arms embargo imposed after Tiananmen Square massacre. Oldest major EU arms embargo still in force. China lobbies annually for removal.',
        status: 'active',
        legalBasis: 'EU Council Declaration 1989',
      },
      {
        id: 'chn-us-financial',
        issuer: 'US', type: 'financial',
        title: 'OFAC Xinjiang Sanctions',
        imposed: '2020-07-31',
        description: 'Sanctions on Xinjiang Production and Construction Corps (XPCC) and officials over Uyghur human rights abuses. Uyghur Forced Labor Prevention Act import bans.',
        status: 'active',
        legalBasis: 'EO 13818, Uyghur Human Rights Policy Act',
      },
      {
        id: 'chn-us-travel',
        issuer: 'US', type: 'travel',
        title: 'US Visa Restrictions — Xinjiang Officials',
        imposed: '2020-07-09',
        description: 'Visa restrictions on CCP officials responsible for Xinjiang human rights abuses. Chen Quanguo and subordinates designated.',
        status: 'active',
        legalBasis: 'INA Section 212(a)(3)(C)',
      },
    ],
  },

  // ── SUDAN ────────────────────────────────────────────────────────────────────
  {
    iso3: 'SDN', name: 'Sudan', flag: '🇸🇩',
    severity: 'high',
    summary: 'Sanctions dating to 1990s over terrorism and Darfur genocide. Partially lifted 2017 but expanded after 2023 RSF conflict.',
    sanctions: [
      {
        id: 'sdn-un-arms',
        issuer: 'UN', type: 'arms',
        title: 'UN Darfur Arms Embargo',
        imposed: '2004-07-30',
        description: 'Arms embargo on non-governmental entities in Darfur. Violations widely reported — both SAF and RSF receive weapons through third parties.',
        status: 'active',
        legalBasis: 'UNSCR 1556, 1591, 1945',
      },
      {
        id: 'sdn-us-financial',
        issuer: 'US', type: 'financial',
        title: 'OFAC Sudan Sanctions',
        imposed: '1997-11-03', updated: '2023-10-12',
        description: 'Blocking sanctions on SAF leadership, RSF commander Hemedti, and military-linked entities following 2023 civil war.',
        status: 'active',
        legalBasis: 'EO 13067, EO 13400, EO 14098',
      },
    ],
  },

  // ── VENEZUELA ────────────────────────────────────────────────────────────────
  {
    iso3: 'VEN', name: 'Venezuela', flag: '🇻🇪',
    severity: 'high',
    summary: 'Targeted and sectoral sanctions on Maduro government, military leadership, oil sector, and financial transactions.',
    sanctions: [
      {
        id: 'ven-us-oil',
        issuer: 'US', type: 'oil',
        title: 'OFAC Venezuela Oil Sector Sanctions',
        imposed: '2019-01-28',
        description: 'Blocking sanctions on PDVSA (state oil company). Secondary sanctions on third-country buyers. Partially eased 2023 after Maduro election deal.',
        status: 'partial',
        legalBasis: 'EO 13850, EO 13884',
      },
      {
        id: 'ven-us-financial',
        issuer: 'US', type: 'financial',
        title: 'US Venezuela Financial Sanctions',
        imposed: '2017-08-24',
        description: 'Blocking sanctions on government debt, gold sector. Maduro, family, military officials designated.',
        status: 'active',
        legalBasis: 'EO 13808, EO 13827, EO 13835',
      },
      {
        id: 'ven-eu-travel',
        issuer: 'EU', type: 'travel',
        title: 'EU Venezuela Travel Bans',
        imposed: '2017-11-13',
        description: 'Travel bans and asset freezes on 55 Venezuelan officials including Maduro cabinet and senior military.',
        status: 'active',
        legalBasis: 'Council Decision 2017/2074/CFSP',
      },
    ],
  },

  // ── CUBA ─────────────────────────────────────────────────────────────────────
  {
    iso3: 'CUB', name: 'Cuba', flag: '🇨🇺',
    severity: 'medium',
    summary: 'US embargo in place since 1962 — the world\'s longest-running trade embargo. Partially eased under Obama, re-tightened under Trump.',
    sanctions: [
      {
        id: 'cub-us-trade',
        issuer: 'US', type: 'trade',
        title: 'US Cuba Embargo (EMBARGO/BLOQUEO)',
        imposed: '1962-02-07',
        description: 'Comprehensive trade embargo since 1962. Helms-Burton Act extraterritorial reach. Estimated $130B in damages claimed by Cuba. No third-country bank can process USD Cuba transactions.',
        status: 'active',
        legalBasis: 'TSRA, CACR, Helms-Burton Act (22 USC 6021)',
      },
      {
        id: 'cub-us-financial',
        issuer: 'US', type: 'financial',
        title: 'OFAC Cuba Sanctions',
        imposed: '1963-07-08',
        description: 'Comprehensive financial sanctions. Cuban government assets in US blocked. US persons prohibited from financial transactions with Cuba.',
        status: 'active',
        legalBasis: 'CACR (31 CFR Part 515)',
      },
    ],
  },

  // ── SOMALIA ──────────────────────────────────────────────────────────────────
  {
    iso3: 'SOM', name: 'Somalia', flag: '🇸🇴',
    severity: 'medium',
    summary: 'Partial arms embargo in place since 1992. Significant exemptions for government forces fighting Al-Shabaab.',
    sanctions: [
      {
        id: 'som-un-arms',
        issuer: 'UN', type: 'arms',
        title: 'UN Somalia Arms Embargo (Partial)',
        imposed: '1992-01-23',
        description: 'World\'s longest-running arms embargo. Significantly modified — Somali federal government exempt. Non-state actors, Al-Shabaab targeted. Lifted for government in 2023.',
        status: 'partial',
        legalBasis: 'UNSCR 733, 751, 2662',
      },
    ],
  },

  // ── HAITI ────────────────────────────────────────────────────────────────────
  {
    iso3: 'HTI', name: 'Haiti', flag: '🇭🇹',
    severity: 'medium',
    summary: 'Targeted sanctions on gang leaders and those undermining Haiti\'s stability following President Moïse assassination.',
    sanctions: [
      {
        id: 'hti-un-arms',
        issuer: 'UN', type: 'arms',
        title: 'UN Haiti Arms Embargo',
        imposed: '2022-10-21',
        description: 'Targeted arms embargo on gang leaders and enablers. Jimmy Chérizier "Barbecue" and Viv Ansanm leaders designated.',
        status: 'active',
        legalBasis: 'UNSCR 2653',
      },
      {
        id: 'hti-us-financial',
        issuer: 'US', type: 'financial',
        title: 'OFAC Haiti Gang Sanctions',
        imposed: '2022-10-21',
        description: 'Asset freezes on gang leaders controlling Port-au-Prince. Jimmy Chérizier and network designated.',
        status: 'active',
        legalBasis: 'EO 13692 (amended)',
      },
    ],
  },

  // ── AFGHANISTAN ──────────────────────────────────────────────────────────────
  {
    iso3: 'AFG', name: 'Afghanistan', flag: '🇦🇫',
    severity: 'high',
    summary: 'Sanctions targeting Taliban leadership and Al-Qaeda. Afghan central bank assets ($7B) frozen in US since 2021 Taliban takeover.',
    sanctions: [
      {
        id: 'afg-un-arms',
        issuer: 'UN', type: 'arms',
        title: 'UN Taliban Arms Embargo',
        imposed: '1999-10-15',
        description: 'Arms embargo on Taliban and associated individuals/entities. Maintained after 2021 takeover.',
        status: 'active',
        legalBasis: 'UNSCR 1267, 1988, 2255',
      },
      {
        id: 'afg-us-financial',
        issuer: 'US', type: 'financial',
        title: 'Afghan Central Bank Asset Freeze',
        imposed: '2021-08-15',
        description: '$7B in Afghan central bank reserves frozen at Federal Reserve. $3.5B allocated to 9/11 victims\' fund. Remainder in trust for Afghan humanitarian relief.',
        status: 'active',
        legalBasis: 'EO 14064',
      },
      {
        id: 'afg-un-travel',
        issuer: 'UN', type: 'travel',
        title: 'UN Travel Ban on Taliban Leaders',
        imposed: '1999-10-15',
        description: 'Travel ban on 135 Taliban leaders and associates. Includes Haibatullah Akhundzada (Supreme Leader) and cabinet.',
        status: 'active',
        legalBasis: 'UNSCR 1267, 1988',
      },
    ],
  },

  // ── MALI ─────────────────────────────────────────────────────────────────────
  {
    iso3: 'MLI', name: 'Mali', flag: '🇲🇱',
    severity: 'medium',
    summary: 'Sanctions following 2021 military coup and expulsion of French/UN forces. Junta leadership targeted.',
    sanctions: [
      {
        id: 'mli-un-arms',
        issuer: 'UN', type: 'arms',
        title: 'UN Mali Arms Embargo',
        imposed: '2013-07-05', suspended: '2023-08-30',
        description: 'Arms embargo on non-state armed groups. Exemptions for Malian government and MINUSMA. MINUSMA mandate ended 2023.',
        status: 'partial',
        legalBasis: 'UNSCR 2100, 2374, 2690',
      },
      {
        id: 'mli-eu-travel',
        issuer: 'EU', type: 'travel',
        title: 'EU Mali Junta Sanctions',
        imposed: '2022-01-28',
        description: 'Travel bans and asset freezes on coup leaders Assimi Goïta, Choguel Maïga, and junta members.',
        status: 'active',
        legalBasis: 'Council Decision 2022/155/CFSP',
      },
    ],
  },

  // ── ZIMBABWE ─────────────────────────────────────────────────────────────────
  {
    iso3: 'ZWE', name: 'Zimbabwe', flag: '🇿🇼',
    severity: 'low',
    summary: 'Targeted sanctions on Mnangagwa government and ZANU-PF officials over human rights abuses and election manipulation.',
    sanctions: [
      {
        id: 'zwe-us-financial',
        issuer: 'US', type: 'financial',
        title: 'OFAC Zimbabwe Sanctions',
        imposed: '2003-03-07',
        description: 'Targeted sanctions on Mnangagwa, senior ZANU-PF officials, military commanders. Zimbabwe Democracy and Economic Recovery Act restrictions.',
        status: 'active',
        legalBasis: 'EO 13288, ZIDERA',
      },
      {
        id: 'zwe-eu-arms',
        issuer: 'EU', type: 'arms',
        title: 'EU Zimbabwe Arms Embargo',
        imposed: '2002-02-18',
        description: 'Arms embargo and targeted sanctions on individuals. Partially lifted 2013, maintained on key figures.',
        status: 'partial',
        legalBasis: 'Council Common Position 2002/145/CFSP',
      },
    ],
  },
];

export default SANCTIONED_COUNTRIES;
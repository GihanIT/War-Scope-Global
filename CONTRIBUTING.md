# Contributing to WarScope Data

Thank you for helping build an accurate, open military intelligence database. Every contribution matters, even a single country's data helps readers understand global conflicts better.

All WarScope data lives in one folder of this repository: [`frontend/src/data`](frontend/src/data). You contribute by opening a pull request that adds or corrects entries in those files. There is no separate data repository and no web form.

---

## Which file do I edit?

| Data | File to edit | Template to copy from |
|------|--------------|-----------------------|
| Army units, personnel, branches | [`frontend/src/data/army-units-db.js`](frontend/src/data/army-units-db.js) | [`templates/army-units.template.js`](frontend/src/data/templates/army-units.template.js) |
| Vehicles and equipment | [`frontend/src/data/vehicles-data.js`](frontend/src/data/vehicles-data.js) | [`templates/vehicles.template.js`](frontend/src/data/templates/vehicles.template.js) |
| Sanctions and embargoes | [`frontend/src/data/sanctions-data.js`](frontend/src/data/sanctions-data.js) | [`templates/sanctions.template.js`](frontend/src/data/templates/sanctions.template.js) |
| Arms transfers and deals | [`frontend/src/data/arms-trade-data.js`](frontend/src/data/arms-trade-data.js) | [`templates/arms-trade.template.js`](frontend/src/data/templates/arms-trade.template.js) |
| Conflict history | [`frontend/src/data/timeline-data.js`](frontend/src/data/timeline-data.js) | [`templates/timeline.template.js`](frontend/src/data/templates/timeline.template.js) |

More help with the templates: [`templates/TEMPLATES.md`](frontend/src/data/templates/TEMPLATES.md).

`nuclear-data.js`, `alliance-data.js`, `blog-data.js` and `quiz-data.js` are maintained by the project owner. To suggest a change to those, open a GitHub Issue instead of a pull request.

Please do not edit anything outside `frontend/src/data`. Pull requests that touch `backend/`, config files or `.env` files will be closed.

---

## Easiest way: edit in your browser

You do not need Git installed.

1. Sign in to GitHub and open the data file you want to change (see the table above).
2. Click the pencil icon (**Edit this file**). GitHub creates your own fork automatically.
3. Add your entry, following the template format exactly.
4. Click **Commit changes...**, choose **Create a new branch and start a pull request**, then click **Propose changes**.
5. Fill in the pull request description (see [Writing a good pull request](#writing-a-good-pull-request)).

---

## Using Git on your computer

### Step 1: Fork the repository

Click **Fork** at the top right of the [War-Scope-Global repository](https://github.com/GihanIT/War-Scope-Global). This creates your own copy.

### Step 2: Clone your fork

```bash
git clone https://github.com/YOUR-USERNAME/War-Scope-Global.git
cd War-Scope-Global
```

### Step 3: Create a branch

```bash
git checkout -b add-thailand-army-units
```

### Step 4: Find your sources

**You must cite a source for every data point.** See [`SOURCES.md`](frontend/src/data/SOURCES.md) for the approved list. The most useful free sources are:

- [SIPRI](https://sipri.org): arms transfers and military spending
- [UCDP](https://ucdp.uu.se): conflict history
- [CIA World Factbook](https://cia.gov/the-world-factbook/): personnel and branches
- Government defence ministry websites: official figures

### Step 5: Add your data

Open the relevant file in `frontend/src/data`. Copy the matching template from `frontend/src/data/templates` and add your entry following the **exact same format** as the existing entries.

**Formatting rules:**

- Do not change a file's export structure. Only add entries to the existing arrays or objects.
- Use ISO 3166-1 alpha-3 country codes (for example `NGA` for Nigeria, `THA` for Thailand).
- Keep all strings in English unless the template says otherwise.
- Mark estimates clearly, for example `'~100,000'`, or explain them in the `notes` field.
- Put the source in the entry's `source` field.
- Do not reformat or reorder existing entries. Small, focused changes are reviewed faster.

### Step 6: Check that the site still builds

```bash
cd frontend
npm install
npm run dev
```

Open the local address shown in the terminal and check the page that uses your data. If the page goes blank or the browser console shows an error, there is usually a missing comma, quote or bracket in your entry.

### Step 7: Commit and push

```bash
cd ..
git add frontend/src/data
git commit -m "Add Thailand army units (Source: Royal Thai Army website + IISS 2025)"
git push origin add-thailand-army-units
```

### Step 8: Open a pull request

Go to your fork on GitHub and click **Compare & pull request**. The base repository must be `GihanIT/War-Scope-Global` and the base branch `main`.

### Step 9: Review

Pull requests are reviewed within 7 days. We may ask for clarification or source verification. Once merged, your name is added to [`CONTRIBUTORS.md`](CONTRIBUTORS.md) and your data goes live on the next site deployment.

By contributing, you agree that your contribution is released under this repository's [LICENSE](LICENSE).

---

## Writing a good pull request

**Good title:**

> Add Thailand army units, air force and navy data. Source: Royal Thai Army website + IISS 2025

**Good description:**

> Adding Thailand military data to `army-units-db.js`.
>
> **Sources:**
> - Personnel figures: Royal Thai Armed Forces official website (rta.mi.th), accessed March 2026
> - Equipment: IISS Military Balance 2025, p.287
>
> **Notes:**
> - Reserve figures are approximate because official numbers are not publicly released
> - Special Forces unit names are translated from Thai, with the Thai names in comments

Always include which country you are adding, which file you changed, the source URL or citation for each figure, and any caveats.

---

## Data quality rules

### We accept

| Type | Examples |
|------|----------|
| Government defence ministry websites | army.mil.ng, mod.gov.uk, defense.gov |
| Academic databases | SIPRI, UCDP, FAS Nuclear Notebook, ACLED |
| Official international sources | CIA World Factbook, UN reports, OFAC, EU sanctions |
| Manufacturer specifications | Official datasheets for vehicles, aircraft, weapons |
| News from major outlets | Reuters, AP, BBC, Al Jazeera (for recent events) |
| IISS Military Balance | Cite the page number. Do not copy text verbatim |
| Personal knowledge | If you served or work in defence: public information only |

### We do not accept

| Type | Reason |
|------|--------|
| Classified or leaked documents | Legal risk, unverifiable |
| Social media posts, forums, Reddit | Unreliable, unverifiable |
| Data with no source at all | Cannot verify accuracy |
| Paywalled content copied verbatim | Copyright violation |
| Information endangering personnel | Safety risk |
| Estimates without noting they are estimates | Misleading |

---

## ISO 3166-1 alpha-3 country codes

Use these codes in the `iso3` field. Common ones:

| Country | Code | Country | Code | Country | Code |
|---------|------|---------|------|---------|------|
| Afghanistan | AFG | Germany | DEU | Pakistan | PAK |
| Algeria | DZA | Ghana | GHA | Philippines | PHL |
| Angola | AGO | Greece | GRC | Poland | POL |
| Argentina | ARG | India | IND | Portugal | PRT |
| Australia | AUS | Indonesia | IDN | Romania | ROU |
| Austria | AUT | Iran | IRN | Russia | RUS |
| Bangladesh | BGD | Iraq | IRQ | Saudi Arabia | SAU |
| Belgium | BEL | Israel | ISR | Singapore | SGP |
| Brazil | BRA | Italy | ITA | Somalia | SOM |
| Bulgaria | BGR | Japan | JPN | South Africa | ZAF |
| Canada | CAN | Jordan | JOR | South Korea | KOR |
| Chile | CHL | Kenya | KEN | Spain | ESP |
| China | CHN | Libya | LBY | Sudan | SDN |
| Colombia | COL | Malaysia | MYS | Sweden | SWE |
| Czech Republic | CZE | Mexico | MEX | Syria | SYR |
| Denmark | DNK | Morocco | MAR | Taiwan | TWN |
| DRC | COD | Myanmar | MMR | Thailand | THA |
| Egypt | EGY | Netherlands | NLD | Turkey | TUR |
| Ethiopia | ETH | Nigeria | NGA | UAE | ARE |
| Finland | FIN | North Korea | PRK | Ukraine | UKR |
| France | FRA | Norway | NOR | United Kingdom | GBR |
| Georgia | GEO | Oman | OMN | United States | USA |
| | | | | Vietnam | VNM |

Full list: [ISO 3166-1 on Wikipedia](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3)

---

## Questions?

- Open a [GitHub Issue](https://github.com/GihanIT/War-Scope-Global/issues) with the `question` label
- Email **contact@warscopeglobal.com**
- Read the contribution guide on the site: [warscopeglobal.vercel.app/contribute](https://warscopeglobal.vercel.app/contribute)
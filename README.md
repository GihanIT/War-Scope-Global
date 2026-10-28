# WarScope — Global Conflict Intelligence Platform

An open military and conflict intelligence platform: a live 3D conflict globe, incident maps, military strength comparison, nuclear arsenals, sanctions, arms trade, a vehicle and army unit database, and more. All data comes from open, public sources.

**Live site:** https://warscopeglobal.vercel.app

---

## Features

| Page | What it does |
|---|---|
| Globe (`/`) | 3D globe with live conflict arcs, refreshed from GDELT every 15 minutes |
| Incident Feed | Live map of battles, airstrikes, explosions and protests with type filters |
| Compare | Head-to-head military strength comparison of any two countries |
| Nuclear | All nuclear-armed states, warhead counts and delivery systems |
| Sanctions | US, EU and UN sanctions regimes with entity search |
| Arms Trade | 117 major weapons transfers, mapped by era and category |
| Vehicles | Military vehicle and weapons system database with full specifications |
| Army Units | Order of battle, command structure and linked equipment |
| Timeline | Armed conflicts from 1990 to the present (UCDP) |
| Economic / War Impact | Market and economic indicators around conflicts |
| Quiz, Blog | Learning resources and analysis articles |
| Contribute | Guide for adding or correcting data through GitHub |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, react-router-dom |
| Maps and globe | globe.gl, three.js, Leaflet (CARTO basemaps) |
| Charts | recharts |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Cache | node-cache |
| Hosting | Vercel (frontend and serverless API), Neon (PostgreSQL) |

---

## Data Sources

GDELT (live events), UCDP (conflict history), SIPRI (arms transfers), FAS Nuclear Notebook, Global Firepower, OFAC, EU and UN sanctions lists. See the Data Sources and Methodology pages on the site for details.

---

## Local Setup

### Prerequisites

- Node.js 18 or newer
- PostgreSQL 14 or newer
- npm

### 1. Clone and install

```bash
git clone https://github.com/GihanIT/War-Scope-Global.git
cd War-Scope-Global

cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Configure environment

Create `backend/.env`:

```dotenv
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=warscope
```

Create `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:3001
VITE_SHOW_ADS=false
VITE_CARTO_KEY=your_carto_basemaps_key
```

`VITE_CARTO_KEY` is a free CARTO basemaps API key. Request one at https://carto.com/basemaps/apikey. Without it, Leaflet maps show an "API key required" watermark.

Never commit `.env` files.

### 3. Create the database

```bash
psql -U postgres -c "CREATE DATABASE warscope;"
psql -U postgres -d warscope -f backend/db/schema.sql
```

### 4. Import the data

The import script loads countries, military statistics and conflicts from the CSV files in `data/raw/` and from `data/conflicts.json`.

```bash
pip install psycopg2-binary pandas requests pycountry python-dotenv
python scripts/import_data.py
```

### 5. Run the app

```bash
# Terminal 1: backend
cd backend
npm run dev

# Terminal 2: frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/health

---

## API Endpoints

All endpoints are served under `/api`. See `backend/routes` for the full list of sub-routes.

| Base path | Description |
|---|---|
| `/api/countries` | Country list; `/:iso3` for one country; `/:iso3/military` for military stats with world averages |
| `/api/conflicts` | Conflict records and live GDELT conflict arcs |
| `/api/news` | News articles |
| `/api/incidents` | Live incident feed |
| `/api/economic` | Economic and market data |
| `/api/war-impact` | War impact indicators |
| `/api/conflict-intensity` | Conflict intensity data |
| `/api/card` | Shareable country cards |
| `/health` | Health check |

---

## Project Structure

```
War-Scope-Global/
├── api/
│   └── index.js               # Vercel serverless entry (loads backend/server.js)
├── backend/
│   ├── controllers/           # Request handlers
│   ├── db/                    # PostgreSQL connection and schema.sql
│   ├── routes/                # Route definitions
│   ├── services/              # Cards, economic and war impact services
│   ├── utils/                 # GDELT event parser
│   └── server.js              # Express app
├── data/
│   ├── raw/                   # Source CSV files for the import script
│   └── conflicts.json         # Manually curated conflicts
├── docker/
│   └── docker-compose.yml     # Optional Docker setup
├── frontend/
│   ├── public/                # Favicon, robots.txt, sitemap.xml, og image
│   └── src/
│       ├── blog/              # Blog components
│       ├── components/        # Shared UI components
│       ├── data/              # Open datasets (contribute here)
│       ├── globe/             # globe.gl integration
│       ├── pages/             # Route-level pages
│       ├── seo/               # SEO and structured data
│       └── utils/             # Shared helpers (map tiles, etc.)
├── scripts/
│   ├── import_data.py         # Database import pipeline
│   ├── generate_timeline_data.py
│   └── generate-sitemap.js
├── CONTRIBUTING.md
├── CONTRIBUTORS.md
├── LICENSE
└── vercel.json
```

---

## Deployment (Vercel)

1. Create a free PostgreSQL database on Neon and import your data with `pg_dump --no-owner --no-privileges` and `psql`.
2. Import the repository in Vercel. Leave the root directory as the repo root; `vercel.json` configures the build, the `/api` rewrite and the single-page-app fallback.
3. Add these environment variables in Vercel:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon connection string |
| `VITE_API_URL` | empty |
| `VITE_SHOW_ADS` | `true` or `false` |
| `VITE_CARTO_KEY` | your CARTO basemaps key |

4. Redeploy after changing any `VITE_` variable, because Vite bakes them in at build time.

---

## Contributing Data

All open datasets live in [`frontend/src/data`](frontend/src/data). You can add or correct data with a pull request, even from your browser without installing Git. Every figure needs a cited source.

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the step-by-step guide, templates and source rules.

## Reporting Issues

Found a bug or a data error? [Open a GitHub issue](https://github.com/GihanIT/War-Scope-Global/issues) or email info.warscope@gmail.com.

---

## Disclaimer

WarScope is an independent research and data visualisation project. Data is compiled from open sources, may contain errors or delays, and must not be used for operational, legal or safety decisions.

## License

See [LICENSE](LICENSE).
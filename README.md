# WarScope — Global Conflict Intelligence Platform

A real-time war and conflict intelligence visualization platform built with React, Node.js, PostgreSQL, and globe.gl.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Routing | react-router-dom v6 |
| Globe | globe.gl + three.js |
| Charts | recharts |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Cache | node-cache |

---

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm

### 1. Clone & install

```bash
git clone <repo-url>
cd war-globe-platform
npm run install:all
```

### 2. Configure environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your DB credentials

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Set up the database

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE warscope;"

# Run the schema
psql -U postgres -d warscope -f backend/db/schema.sql
```

### 4. Seed sample data (optional)

```bash
cd scripts
node seed.js
```

### 5. Start the platform

```bash
# From the root directory — starts both backend and frontend
npm start
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/health

---

## API Endpoints

### Conflicts
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/conflicts` | All conflicts (supports `?status=&intensity=&region=`) |
| GET | `/api/conflicts/geojson` | GeoJSON for globe.gl |
| GET | `/api/conflicts/:id` | Conflict detail + countries |

### Countries
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/countries` | All countries |
| GET | `/api/countries/:iso` | Country by ISO code |
| GET | `/api/countries/:iso/conflicts` | Conflicts for a country |

### News
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/news` | All articles (supports `?limit=&offset=&featured=true`) |
| GET | `/api/news/featured` | Featured articles |
| GET | `/api/news/:slug` | Article by slug |

---

## Project Structure

```
war-globe-platform/
├── backend/
│   ├── server.js              # Express entry point
│   ├── db/
│   │   ├── connection.js      # PostgreSQL pool
│   │   └── schema.sql         # DB schema
│   ├── routes/                # Route definitions
│   └── controllers/           # Business logic
├── frontend/
│   └── src/
│       ├── components/        # Shared UI components
│       ├── globe/             # globe.gl integration
│       ├── pages/             # Route-level pages
│       ├── api.js             # Axios API client
│       ├── App.jsx            # Router setup
│       └── main.jsx           # Entry point
├── data/
│   └── conflicts.json         # Seed data
├── scripts/
│   └── seed.js                # DB seed script
└── docker/
    └── docker-compose.yml     # Docker setup
```

---

## Docker (optional)

```bash
cd docker
docker compose up -d
```

---

## Adding Data

Insert conflicts, countries, and news directly via the PostgreSQL schema in `backend/db/schema.sql`, or use the seed script in `scripts/seed.js` as a template to import from JSON.

```
War-Scope-Global
├─ backend
│  ├─ controllers
│  │  ├─ conflictsController.js
│  │  ├─ countriesController.js
│  │  ├─ gdeltController.js
│  │  └─ newsController.js
│  ├─ db
│  │  ├─ connection.js
│  │  └─ schema.sql
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ conflicts.js
│  │  ├─ countries.js
│  │  └─ news.js
│  ├─ server.js
│  └─ utils
│     └─ gdeltEventParser.js
├─ data
│  ├─ conflicts.json
│  └─ raw
├─ docker
│  └─ docker-compose.yml
├─ frontend
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ src
│  │  ├─ api.js
│  │  ├─ App.jsx
│  │  ├─ blog
│  │  │  ├─ blog-data.js
│  │  │  ├─ BlogCard.jsx
│  │  │  ├─ BlogPage.jsx
│  │  │  └─ BlogPost.jsx
│  │  ├─ components
│  │  │  ├─ AdBanner.jsx
│  │  │  ├─ CountryPanel.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  └─ Skeleton.jsx
│  │  ├─ globe
│  │  │  └─ GlobeView.jsx
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ Blog.jsx
│  │  │  ├─ Compare.jsx
│  │  │  ├─ Home copy.jsx
│  │  │  ├─ Home.jsx
│  │  │  └─ NotFound.jsx
│  │  └─ utils
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ LICENSE
├─ package-lock.json
├─ package.json
├─ README.md
└─ scripts
   ├─ import_data.py
   └─ seed.js

```
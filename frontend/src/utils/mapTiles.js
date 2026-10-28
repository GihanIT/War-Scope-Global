// frontend/src/utils/mapTiles.js
// Shared CARTO basemap config for every Leaflet map.
// The key comes from VITE_CARTO_KEY (frontend/.env locally, Vercel env var in production).

const KEY = import.meta.env.VITE_CARTO_KEY || '';
const QUERY = KEY ? `?key=${KEY}` : '';
const BASE = 'https://basemaps.cartocdn.com/rastertiles';

export const CARTO_DARK    = `${BASE}/dark_all/{z}/{x}/{y}{r}.png${QUERY}`;
export const CARTO_LIGHT   = `${BASE}/light_all/{z}/{x}/{y}{r}.png${QUERY}`;
export const CARTO_VOYAGER = `${BASE}/voyager/{z}/{x}/{y}{r}.png${QUERY}`;

export const CARTO_OPTIONS = {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 20,
};
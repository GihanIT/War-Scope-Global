import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const getConflicts = (params) => api.get('/api/conflicts', { params });
export const getConflictById = (id) => api.get(`/api/conflicts/${id}`);
export const getConflictsGeoJSON = () => api.get('/api/conflicts/geojson');

export const getCountries = () => api.get('/api/countries');
export const getCountryByIso = (iso) => api.get(`/api/countries/${iso}`);
export const getCountryConflicts = (iso) => api.get(`/api/countries/${iso}/conflicts`);

export const getNews = (params) => api.get('/api/news', { params });
export const getNewsBySlug = (slug) => api.get(`/api/news/${slug}`);
export const getFeaturedNews = () => api.get('/api/news/featured');

export default api;

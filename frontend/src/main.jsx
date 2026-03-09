// src/main.jsx
// react-snap requires hydrate() instead of createRoot() when serving pre-rendered HTML.
// This handles both cases automatically.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');

// react-snap pre-renders pages and marks them with data-server-rendered
// We hydrate those, and createRoot all others (normal dev/runtime behaviour)
if (rootElement.hasChildNodes()) {
  // Hydrate the pre-rendered HTML (react-snap output)
  ReactDOM.hydrateRoot(
    rootElement,
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  );
} else {
  // Normal SPA boot (dev mode, or pages react-snap didn't pre-render)
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  );
}
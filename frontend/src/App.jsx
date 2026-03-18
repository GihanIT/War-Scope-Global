import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './blog/BlogPost.jsx';
import Compare from './pages/Compare.jsx';
import Nuclear from './pages/Nuclear.jsx';
import NotFound from './pages/NotFound.jsx';
import Sanctions from './pages/Sanctions.jsx';
import Timeline from './pages/Timeline.jsx';
import IncidentFeed from './pages/IncidentFeed.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import Terms from './pages/Terms.jsx';
import Disclaimer from './pages/Disclaimer.jsx';
import About from './pages/About.jsx';
import DataSources from './pages/DataSources.jsx';
import Methodology from './pages/Methodology.jsx';
import CookiePolicy from './pages/CookiePolicy.jsx';
import Contact from './pages/Contact.jsx';
import ArmsTrade from './pages/ArmsTrade.jsx';
import Vehicles from './pages/Vehicles.jsx';
import VehicleDetail from './pages/VehicleDetail.jsx';
import Units from './pages/Units.jsx';
import UnitsDetails from './pages/UnitsDetail.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Economic from './pages/Economic.jsx';


const SHOW_ADS = import.meta.env.VITE_SHOW_ADS === 'true';

function GlobalAds() {
  useEffect(() => {
    if (!SHOW_ADS) {
      console.log('[Ads] SHOW_ADS is false, skipping');
      return;
    }

    console.log('[Ads] GlobalAds mounted, scheduling...');

    const socialTimer = setTimeout(() => {
      console.log('[Ads] Loading social bar...');
      const socialScript = document.createElement('script');
      socialScript.src = 'https://pl28934811.effectivegatecpm.com/ae/e6/51/aee651d58365958bc7460d0e42c0f1c3.js';
      socialScript.async = true;
      socialScript.onload = () => console.log('[Ads] Social bar loaded');
      socialScript.onerror = (e) => console.error('[Ads] Social bar failed', e);
      document.head.appendChild(socialScript);
    }, 30000);

    const popTimer = setTimeout(() => {
      console.log('[Ads] Loading popunder...');
      const popScript = document.createElement('script');
      popScript.src = 'https://pl28934822.effectivegatecpm.com/08/2f/57/082f57ce7c851f8e5630d0e065b83a84.js';
      popScript.async = true;
      popScript.onload = () => console.log('[Ads] Popunder loaded');
      popScript.onerror = (e) => console.error('[Ads] Popunder failed', e);
      document.head.appendChild(popScript);
    }, 120000);

    return () => {
      clearTimeout(socialTimer);
      clearTimeout(popTimer);
    };
  }, []);

  return null;
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <GlobalAds />
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/blog"           element={<Blog />} />
        <Route path="/blog/:slug"     element={<BlogPost />} />
        <Route path="/compare"        element={<Compare />} />
        <Route path="/nuclear"        element={<Nuclear />} />
        <Route path="/sanctions"      element={<Sanctions />} />
        <Route path="/timeline"       element={<Timeline />} />
        <Route path="/incidents"      element={<IncidentFeed />} />
        <Route path="/vehicles"       element={<Vehicles />} />
        <Route path="/vehicles/:id"   element={<VehicleDetail />} />
        <Route path="/units"          element={<Units />} />
        <Route path="/units/:id"      element={<UnitsDetails />} />
        <Route path="/economic"       element={<Economic />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms"          element={<Terms />} />
        <Route path="/disclaimer"     element={<Disclaimer />} />
        <Route path="/about"          element={<About />} />
        <Route path="/data-sources"   element={<DataSources />} />
        <Route path="/methodology"    element={<Methodology />} />
        <Route path="/cookie-policy"  element={<CookiePolicy />} />
        <Route path="/contact"        element={<Contact />} />
        <Route path="/arms-trade"     element={<ArmsTrade />} />
        <Route path="*"               element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
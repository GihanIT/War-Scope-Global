import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home     from './pages/Home.jsx';
import Blog     from './pages/Blog.jsx';
import BlogPost from './blog/BlogPost.jsx';
import Compare  from './pages/Compare.jsx';
import Nuclear  from './pages/Nuclear.jsx';
import NotFound from './pages/NotFound.jsx';
import Sanctions from './pages/Sanctions.jsx';
import Timeline from './pages/Timeline.jsx';
import IncidentFeed from './pages/IncidentFeed.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import Terms        from './pages/Terms.jsx';
import Disclaimer   from './pages/Disclaimer.jsx';
import About        from './pages/About.jsx';
import DataSources  from './pages/DataSources.jsx';
import Methodology  from './pages/Methodology.jsx';
import CookiePolicy from './pages/CookiePolicy.jsx';
import Contact      from './pages/Contact.jsx';
import ArmsTrade from './pages/ArmsTrade.jsx';
import Vehicles     from './pages/Vehicles.jsx';
import VehicleDetail from './pages/VehicleDetail.jsx';
import Units     from './pages/Units.jsx';
import UnitsDetails from './pages/UnitsDetail.jsx';




export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/blog"      element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/compare"   element={<Compare />} />
        <Route path="/nuclear"    element={<Nuclear />} />
        <Route path="/sanctions" element={<Sanctions />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/incidents" element={<IncidentFeed />} />
        <Route path="/vehicles"     element={<Vehicles />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
        <Route path="/units"     element={<Units />} />
        <Route path="/units/:id" element={<UnitsDetails />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms"          element={<Terms />} />
        <Route path="/disclaimer"     element={<Disclaimer />} />
        <Route path="/about"          element={<About />} />
        <Route path="/data-sources"   element={<DataSources />} />
        <Route path="/methodology"    element={<Methodology />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/contact"       element={<Contact />} />
        <Route path="/arms-trade"    element={<ArmsTrade />} />
        <Route path="*"          element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
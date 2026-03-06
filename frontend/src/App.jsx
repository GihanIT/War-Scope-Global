import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home     from './pages/Home.jsx';
import Blog     from './pages/Blog.jsx';
import BlogPost from './blog/BlogPost.jsx';
import Compare  from './pages/Compare.jsx';
import NotFound from './pages/NotFound.jsx';


export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/blog"      element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/compare"   element={<Compare />} />
        <Route path="*"          element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
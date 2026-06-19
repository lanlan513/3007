import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import FanDetail from '@/pages/FanDetail';
import Navbar from '@/components/Navbar';
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-paper-50 font-sans-sc">
        <Navbar onSearchClick={() => setSearchOpen(!searchOpen)} />
        {searchOpen && (
          <div className="fixed top-16 md:top-20 left-0 right-0 z-40">
            <SearchBar variant="header" isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fan/:id" element={<FanDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

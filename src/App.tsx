import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import FanDetail from '@/pages/FanDetail';
import Gallery from '@/pages/Gallery';
import Workshop from '@/pages/Workshop';
import Restoration from '@/pages/Restoration';
import SchoolCollection from '@/pages/SchoolCollection';
import WindField from '@/pages/WindField';
import Figures from '@/pages/Figures';
import FigureDetail from '@/pages/FigureDetail';
import FanCultureScroll from '@/pages/FanCultureScroll';
import FanRegistry from '@/pages/FanRegistry';
import FanLanguage from '@/pages/FanLanguage';
import FanAnatomy from '@/pages/FanAnatomy';
import SolarTermCalendar from '@/pages/SolarTermCalendar';
import Yearbook from '@/pages/Yearbook';
import FanJourney from '@/pages/FanJourney';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add('animate-scroll-visible');
            el.classList.remove('opacity-0', 'translate-y-8');
            el.style.transitionDelay = `${(Math.random() * 0.2).toFixed(2)}s`;
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    const observeElements = () => {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
      });
    };

    observeElements();

    const timeout = setTimeout(observeElements, 500);
    const timeout2 = setTimeout(observeElements, 1500);

    const mutationObserver = new MutationObserver(observeElements);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      clearTimeout(timeout);
      clearTimeout(timeout2);
    };
  }, []);

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
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/workshop" element={<Workshop />} />
          <Route path="/restoration" element={<Restoration />} />
          <Route path="/schools" element={<SchoolCollection />} />
          <Route path="/windfield" element={<WindField />} />
          <Route path="/figures" element={<Figures />} />
          <Route path="/figure/:id" element={<FigureDetail />} />
          <Route path="/scroll" element={<FanCultureScroll />} />
          <Route path="/registry" element={<FanRegistry />} />
          <Route path="/fan-language" element={<FanLanguage />} />
          <Route path="/anatomy" element={<FanAnatomy />} />
          <Route path="/solar-terms" element={<SolarTermCalendar />} />
          <Route path="/yearbook" element={<Yearbook />} />
          <Route path="/journey" element={<FanJourney />} />
        </Routes>
      </div>
    </Router>
  );
}

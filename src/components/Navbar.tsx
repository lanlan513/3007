import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

interface NavbarProps {
  onSearchClick?: () => void;
}

export default function Navbar({ onSearchClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-paper-100/95 backdrop-blur-md shadow-elegant'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">扇</span>
            <span className="font-serif-sc text-xl md:text-2xl font-bold text-ink-800 group-hover:text-vermilion-500 transition-colors">
              扇韵东方
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" label="首页" />
            <NavLink to="/workshop" label="扇子工坊" />
            <NavLink to="/restoration" label="古扇修复" />
            <NavLink to="/schools" label="流派图鉴" />
            <NavLink to="/gallery" label="扇面画廊" />
            <NavLink to="/#round" label="团扇" />
            <NavLink to="/#folding" label="折扇" />
            <NavLink to="/#feather" label="羽扇" />
          </div>

          <div className="flex items-center gap-4">
            {onSearchClick && (
              <button
                onClick={onSearchClick}
                className="p-2 rounded-full hover:bg-paper-200 transition-colors text-ink-600 hover:text-vermilion-500"
                aria-label="搜索"
              >
                <Search size={20} />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-paper-200 transition-colors text-ink-600"
              aria-label="菜单"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-64 pb-4' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col gap-2 pt-2">
            <MobileNavLink to="/" label="首页" />
            <MobileNavLink to="/workshop" label="扇子工坊" />
            <MobileNavLink to="/restoration" label="古扇修复" />
            <MobileNavLink to="/schools" label="流派图鉴" />
            <MobileNavLink to="/gallery" label="扇面画廊" />
            <MobileNavLink to="/#round" label="团扇" />
            <MobileNavLink to="/#folding" label="折扇" />
            <MobileNavLink to="/#feather" label="羽扇" />
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to && !to.includes('#');

  return (
    <Link
      to={to}
      className={`font-serif-sc text-base transition-colors relative group ${
        isActive ? 'text-vermilion-500' : 'text-ink-600 hover:text-vermilion-500'
      }`}
    >
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-vermilion-500 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="font-serif-sc text-lg py-2 px-4 text-ink-600 hover:text-vermilion-500 hover:bg-paper-200 rounded-lg transition-colors"
    >
      {label}
    </Link>
  );
}

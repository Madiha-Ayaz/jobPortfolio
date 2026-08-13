import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useSearch } from '@/context/SearchContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      if (auth) await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && pathname !== '/projects') {
      navigate('/projects');
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(8,8,26,0.80)' : 'rgba(8,8,26,0.20)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: `1px solid ${scrolled ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.04)'}`,
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
        style={{
          background: scrolled
            ? 'linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.5) 30%, rgba(6,182,212,0.5) 70%, transparent 100%)'
            : 'transparent',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all duration-300 group-hover:scale-110"
              style={{
                background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(6,182,212,0.2))',
                border: '1px solid rgba(167,139,250,0.35)',
                boxShadow: '0 0 20px rgba(167,139,250,0.15)',
                color: '#c4b5fd',
              }}
            >
              MA
            </div>
            <span className="text-lg font-black hidden sm:inline-block text-heading">
              Madiha
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300"
                  style={{
                    color: isActive ? '#c4b5fd' : '#94a3b8',
                    background: isActive ? 'rgba(167,139,250,0.1)' : 'transparent',
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #a78bfa, #06b6d4)',
                        boxShadow: '0 0 8px rgba(167,139,250,0.5)',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <div
              className="relative transition-all duration-300"
              style={{ width: searchFocused ? '200px' : '150px' }}
            >
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full text-sm px-4 py-2 pr-9 rounded-xl transition-all duration-300 outline-none"
                style={{
                  background: searchFocused ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${searchFocused ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  color: '#f1f5f9',
                  boxShadow: searchFocused ? '0 0 20px rgba(167,139,250,0.1)' : 'none',
                }}
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
                fill="none" viewBox="0 0 24 24" strokeWidth={2}
                stroke={searchFocused ? '#a78bfa' : '#64748b'}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>

            {/* Auth */}
            {!loading && (
              user ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300"
                  style={{
                    color: '#94a3b8',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
                    e.currentTarget.style.color = '#fca5a5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300"
                  style={{
                    color: '#c4b5fd',
                    background: 'rgba(167,139,250,0.1)',
                    border: '1px solid rgba(167,139,250,0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(167,139,250,0.2)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(167,139,250,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(167,139,250,0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Login
                </Link>
              )
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span
                className="w-full h-0.5 rounded-full transition-all duration-300"
                style={{
                  background: '#c4b5fd',
                  transform: isMobileMenuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
                }}
              />
              <span
                className="w-full h-0.5 rounded-full transition-all duration-300"
                style={{ background: '#94a3b8', opacity: isMobileMenuOpen ? 0 : 1 }}
              />
              <span
                className="w-full h-0.5 rounded-full transition-all duration-300"
                style={{
                  background: '#c4b5fd',
                  transform: isMobileMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
                }}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className="md:hidden overflow-hidden transition-all duration-400"
          style={{ maxHeight: isMobileMenuOpen ? '400px' : '0', opacity: isMobileMenuOpen ? 1 : 0 }}
        >
          <div className="py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                  style={{
                    color: isActive ? '#c4b5fd' : '#94a3b8',
                    background: isActive ? 'rgba(167,139,250,0.1)' : 'transparent',
                    borderLeft: isActive ? '2px solid #a78bfa' : '2px solid transparent',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="px-4 pt-3">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full text-sm px-4 py-2.5 rounded-xl outline-none"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#f1f5f9',
                }}
              />
            </div>

            {!loading && (
              <div className="px-4 pt-2">
                {user ? (
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{ color: '#fca5a5', background: 'rgba(239,68,68,0.08)' }}
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{ color: '#c4b5fd', background: 'rgba(167,139,250,0.1)' }}
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

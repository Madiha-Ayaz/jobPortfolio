import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useSearch } from '@/context/SearchContext';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import ThemeLanguageToggle from '@/components/ui/ThemeLanguageToggle';

const navLinks = [
  { href: '/', label: 'Home', tKey: 'nav.home' },
  { href: '/about', label: 'About', tKey: 'nav.about' },
  { href: '/projects', label: 'Projects', tKey: 'nav.projects' },
  { href: '/blog', label: 'Blog', tKey: 'nav.blog' },
  { href: '/dashboard', label: 'Dashboard', tKey: 'nav.dashboard' },
  { href: '/contact', label: 'Contact', tKey: 'nav.contact' },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t } = useTheme();
  const { searchQuery, setSearchQuery } = useSearch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      if (auth) await signOut(auth);
      navigate('/auth/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && pathname !== '/projects') {
      navigate('/projects');
    }
  };

  const brand = 'var(--brand)';
  const accent = 'var(--accent)';
  const brandLight = 'var(--brand-light)';

  const searchInput = (
    <input
      type="text"
      placeholder={t('nav.search')}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={handleSearch}
      onFocus={() => setSearchFocused(true)}
      onBlur={() => setSearchFocused(false)}
      className="w-full text-sm px-4 py-2 pr-9 rounded-xl transition-all duration-300 outline-none"
      style={{
        background: 'var(--input-bg)',
        border: `1px solid ${searchFocused ? 'var(--input-border-focus)' : 'var(--input-border)'}`,
        color: 'var(--text-heading)',
        boxShadow: searchFocused ? '0 0 20px var(--glow-brand)' : 'none',
      }}
      aria-label="Search projects"
    />
  );

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'var(--nav-bg)' : 'var(--nav-bg-transparent)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: `1px solid ${scrolled ? 'color-mix(in srgb, var(--brand) 14%, transparent)' : 'var(--nav-border)'}`,
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.35)' : 'none',
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500 pointer-events-none"
        style={{
          background: scrolled
            ? `linear-gradient(90deg, transparent 0%, color-mix(in srgb, ${brand} 50%, transparent) 30%, color-mix(in srgb, ${accent} 50%, transparent) 70%, transparent 100%)`
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
                background: `linear-gradient(135deg, color-mix(in srgb, ${brand} 22%, transparent), color-mix(in srgb, ${accent} 18%, transparent))`,
                border: `1px solid color-mix(in srgb, ${brand} 35%, transparent)`,
                boxShadow: `0 0 20px var(--glow-brand)`,
                color: brandLight,
              }}
            >
              MA
            </div>
            <span className="text-lg font-black hidden sm:inline-block" style={{ color: 'var(--text-heading)' }}>
              Madiha
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-300"
                  style={{
                    color: isActive ? brandLight : 'var(--text-muted)',
                    background: isActive ? `color-mix(in srgb, ${brand} 10%, transparent)` : 'transparent',
                  }}
                >
                  {t(link.tKey)}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${brand}, ${accent})`,
                        boxShadow: `0 0 8px var(--glow-brand)`,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Search */}
            <div className="relative transition-all duration-300 hidden lg:block" style={{ width: searchFocused ? '200px' : '150px' }}>
              {searchInput}
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors pointer-events-none"
                fill="none" viewBox="0 0 24 24" strokeWidth={2}
                stroke={searchFocused ? brand : 'var(--text-dim)'}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>

            {/* Bell */}
            <NotificationCenter />

            {/* Theme + language */}
            <ThemeLanguageToggle />

            {/* Auth */}
            {!loading && (
              user ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 border"
                  style={{
                    color: 'var(--text-muted)',
                    background: 'var(--surface)',
                    borderColor: 'var(--border-default)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'color-mix(in srgb, var(--danger) 10%, transparent)';
                    e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--danger) 30%, transparent)';
                    e.currentTarget.style.color = 'var(--danger)';
                  }}
onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--surface)';
                      e.currentTarget.style.borderColor = 'var(--border-default)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    {t('nav.logout')}
                  </button>
              ) : (
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 border"
                  style={{
                    color: brandLight,
                    background: `color-mix(in srgb, var(--brand) 10%, transparent)`,
                    borderColor: `color-mix(in srgb, var(--brand) 20%, transparent)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `color-mix(in srgb, var(--brand) 20%, transparent)`;
                    e.currentTarget.style.boxShadow = '0 0 15px var(--glow-brand)';
                  }}
onMouseLeave={(e) => {
                      e.currentTarget.style.background = `color-mix(in srgb, var(--brand) 10%, transparent)`;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {t('nav.login')}
                  </Link>
              )
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all border"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border-default)',
            }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span
                className="w-full h-0.5 rounded-full transition-all duration-300"
                style={{
                  background: brandLight,
                  transform: isMobileMenuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
                }}
              />
              <span
                className="w-full h-0.5 rounded-full transition-all duration-300"
                style={{ background: 'var(--text-muted)', opacity: isMobileMenuOpen ? 0 : 1 }}
              />
              <span
                className="w-full h-0.5 rounded-full transition-all duration-300"
                style={{
                  background: brandLight,
                  transform: isMobileMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
                }}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className="md:hidden overflow-hidden transition-all duration-400"
          style={{ maxHeight: isMobileMenuOpen ? '520px' : '0', opacity: isMobileMenuOpen ? 1 : 0 }}
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
                    color: isActive ? brandLight : 'var(--text-muted)',
                    background: isActive ? `color-mix(in srgb, var(--brand) 10%, transparent)` : 'transparent',
                    borderLeft: isActive ? `2px solid ${brand}` : '2px solid transparent',
                  }}
                >
                  {t(link.tKey)}
                </Link>
              );
            })}

            <div className="px-4 pt-3">
              <div className="relative">
                {searchInput}
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="var(--text-dim)"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <NotificationCenter />
                <ThemeLanguageToggle />
              </div>
            </div>

            {!loading && (
              <div className="px-4 pt-2">
                {user ? (
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border"
                    style={{ color: 'var(--danger)', background: 'color-mix(in srgb, var(--danger) 8%, transparent)', borderColor: 'color-mix(in srgb, var(--danger) 25%, transparent)' }}
                  >
                    {t('nav.logout')}
                  </button>
                ) : (
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium transition-all border"
                    style={{ color: brandLight, background: `color-mix(in srgb, var(--brand) 10%, transparent)`, borderColor: `color-mix(in srgb, var(--brand) 20%, transparent)` }}
                  >
                    {t('nav.login')}
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
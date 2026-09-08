import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Home from './pages/page';
import About from './pages/about/page';
import ForgotPassword from './pages/auth/forgot-password/page';
import Login from './pages/auth/login/page';
import Register from './pages/auth/register/page';
import Blog from './pages/blog/page';
import BlogPost from './pages/blog/[slug]/page';
import Contact from './pages/contact/page';
import Projects from './pages/projects/page';
import Dashboard from './pages/dashboard/page';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { AgentProvider } from './context/AgentContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { PortfolioProvider } from './context/PortfolioContext';
import AgentOrb from './components/agent/AgentOrb';
import PageGuide from './components/agent/PageGuide';
import ToastViewport from './components/notifications/ToastViewport';
import { trackSessionStart, trackSessionClose, trackPageView } from './utils/analytics';

// Lazy load the 3D cursor follower
const CursorFollower = lazy(() => import('./components/3d/CursorFollower'));

/** Inner component that has access to all providers */
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  // Full-bleed scenes (login, register) hide the chrome so they own the whole viewport.
  const fullscreen = location.pathname === '/auth/login' || location.pathname === '/auth/register' || location.pathname === '/auth/forgot-password';

  // If a signed-in user lands on (or returns to) an auth page, send them home.
  // This covers the Google redirect return, where the full page reloads on the
  // login route and the user is already authenticated.
  useEffect(() => {
    if (!loading && user && fullscreen) {
      navigate('/', { replace: true });
    }
  }, [user, loading, fullscreen, navigate, location.pathname]);

  // ── Neon analytics: session open/close + page views ──
  useEffect(() => {
    trackSessionStart(location.pathname);
    return () => trackSessionClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (typeof location.pathname === 'string') trackPageView(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="relative flex flex-col min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text-body)' }}>
      {/* Theme-aware background glows */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(1000px 600px at 15% -10%, var(--bg-glow-1), transparent 60%),' +
            'radial-gradient(900px 500px at 90% 10%, var(--bg-glow-2), transparent 60%),' +
            'var(--bg)',
        }}
      />

      {!fullscreen && <Navbar />}
      <main className="flex flex-1 flex-col" style={fullscreen ? { position: 'fixed', inset: 0 } : undefined}>
        <Routes>
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!fullscreen && <Footer />}

      {/* Transient toasts (top-right) */}
      <ToastViewport />

      {/* Proactive one-off guidance card (bottom-left) */}
      <PageGuide />

      {/* 3D agent orb + chat panel — the single portfolio AI assistant */}
      <AgentOrb />

      {/* 3D Cursor Follower - subtle premium effect */}
      <Suspense fallback={null}>
        <CursorFollower />
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <Router>
      <NotificationProvider>
        <ThemeProvider>
          <PortfolioProvider>
            <SearchProvider>
              <AuthProvider>
                <AgentProvider>
                  <AppContent />
                </AgentProvider>
              </AuthProvider>
            </SearchProvider>
          </PortfolioProvider>
        </ThemeProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;
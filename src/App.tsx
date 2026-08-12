import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Home from './pages/page';
import About from './pages/about/page';
import ForgotPassword from './pages/auth/forgot-password/page';
import Login from './pages/auth/login/page';
import Register from './pages/auth/register/page';
import Blog from './pages/blog/page';
import BlogPost from './pages/blog/[slug]/page';
import Contact from './pages/contact/page';
import Projects from './pages/projects/page';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { AgentProvider } from './context/AgentContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import AgentOrb from './components/agent/AgentOrb';
import { AgenticChatbot } from './components/agent/AgenticChatbot';

// Lazy load the 3D cursor follower + galaxy background
const CursorFollower = lazy(() => import('./components/3d/CursorFollower'));
const RealisticGalaxy3D = lazy(() => import('./components/3d/RealisticGalaxy3D'));

/** Inner component that has access to theme context */
function AppContent() {
  const { theme, t } = useTheme();

  // Apply dark/light class to html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  // Dynamic background gradient based on theme
  const bgGradient = theme === 'dark'
    ? 'from-slate-950 via-slate-900 to-slate-950'
    : 'from-blue-50 via-white to-blue-50';

  return (
    <div className={`flex flex-col min-h-screen relative ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
      {/* Galaxy background on ALL pages */}
      <div className={`fixed inset-0 -z-20 transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-100' : 'opacity-30'}`}>
        <Suspense fallback={null}>
          <RealisticGalaxy3D />
        </Suspense>
      </div>
      {/* Theme-aware background gradient */}
      <div className={`fixed inset-0 -z-10 bg-gradient-to-b ${bgGradient} transition-all duration-700`} />

      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </main>
      <Footer />
      
      {/* Agentic AI chatbot - standalone and in every page */}
      <AgenticChatbot 
        title="Ask Me Anything"
        placeholder="What would you like to know?"
        systemPrompt="You are Nova, a friendly AI assistant in a developer's portfolio. Provide helpful, concise responses about the portfolio, projects, web development, and AI. Be warm and encouraging."
      />
      
      {/* Agentic AI orb + chat panel (3D with tool support) */}
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
      <SearchProvider>
        <AuthProvider>
          <AgentProvider>
            <ThemeProvider>
              <AppContent />
            </ThemeProvider>
          </AgentProvider>
        </AuthProvider>
      </SearchProvider>
    </Router>
  );
}

export default App;


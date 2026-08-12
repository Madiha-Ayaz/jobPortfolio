

import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If loading is finished and there is no user, redirect to login.
    if (!loading && !user) {
      navigate('/auth/login');
    }
  }, [user, loading, navigate]);

  // While loading, you can show a loader or a blank screen.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // If there is a user, render the children.
  if (user) {
    return <>{children}</>;
  }

  // If no user and not loading (should be covered by useEffect, but as a fallback)
  return null;
};

export default ProtectedRoute;

/* 
  How to use this component:
  
  To protect a page, for example a dashboard page at `app/dashboard/page.tsx`,
  you would wrap the page's content with this component:

  // app/dashboard/page.tsx
  import ProtectedRoute from '@/components/auth/ProtectedRoute';

  export default function DashboardPage() {
    return (
      <ProtectedRoute>
        <div>
          <h1>Welcome to your Dashboard</h1>
          <p>This content is for logged-in users only.</p>
        </div>
      </ProtectedRoute>
    );
  }
*/

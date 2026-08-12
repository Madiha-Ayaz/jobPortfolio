'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { User, Auth } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  error: Error | undefined;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: undefined,
});

// This new component will contain the hook and only be rendered on the client.
const AuthProviderContent = ({ children }: { children: ReactNode }) => {
    // The non-null assertion is safe here because this component only renders on the client.
    const [user, loading, error] = useAuthState(auth as Auth);
    
    useEffect(() => {
        // You can add any side effects here, like analytics or logging,
        // when the auth state changes.
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // This effect runs only on the client, after the initial server render
        setIsClient(true);
    }, []);

    // On the server, or before the client has mounted, we provide a default
    // loading state. This prevents the `useAuthState` hook from running on the server.
    if (!isClient) {
        return (
            <AuthContext.Provider value={{ user: null, loading: true, error: undefined }}>
                {children}
            </AuthContext.Provider>
        );
    }

    // Once the client has mounted, we can safely render the component
    // that uses the `useAuthState` hook.
    return <AuthProviderContent>{children}</AuthProviderContent>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
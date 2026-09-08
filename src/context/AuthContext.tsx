'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { User, Auth, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { isFirebaseConfigured } from '@/lib/firebase';
import { trackUser } from '@/utils/analytics';

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
    // When Firebase is not configured, `auth` is null. react-firebase-hooks
    // dereferences auth.currentUser internally, which crashes on null, so we
    // skip the hook entirely and report a signed-out state instead.
    if (!isFirebaseConfigured || !auth) {
        return (
            <AuthContext.Provider value={{ user: null, loading: false, error: undefined }}>
                {children}
            </AuthContext.Provider>
        );
    }

    // Keep a manual user override so a redirect sign-in result is honoured even
    // if `onAuthStateChanged` (which `useAuthState` subscribes to) does not fire
    // for a post-redirect reload. Without this, a Google redirect return lands
    // on the login page still looking signed-out.
    const [redirectUser, setRedirectUser] = useState<User | null>(null);
    // Track whether a redirect result is still being processed. Until this
    // resolves we stay in "loading" so ProtectedRoute never redirects early.
    const [redirectHandled, setRedirectHandled] = useState(false);
    const [hookUser, hookLoading, hookError] = useAuthState(auth as Auth);

    // Effective user: prefer an explicitly-obtained redirect result, else the
    // hook's auth-state user, else whatever Firebase has cached in-memory
    // (auth.currentUser is populated synchronously after a redirect restores).
    const currentUser = hookUser ?? redirectUser ?? auth.currentUser;
    const user = currentUser;
    // Stay "loading" until both useAuthState AND getRedirectResult have settled,
    // or until a user is found. This prevents ProtectedRoute from sending the
    // user back to /auth/login after a successful Google redirect.
    const loading = (hookLoading || !redirectHandled) && !user;
    const error = hookError;

    useEffect(() => {
        // Consume a pending redirect sign-in result (Google Sign-in redirect
        // flow). The redirect flow navigates the whole page to Google and back,
        // and on a full reload `onAuthStateChanged` does not always fire with
        // the authenticated user — so read the result explicitly and use it.
        let cancelled = false;
        getRedirectResult(auth as Auth)
            .then((result) => {
                if (!cancelled) {
                    if (result && result.user) {
                        setRedirectUser(result.user);
                    }
                    setRedirectHandled(true);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setRedirectHandled(true);
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        // Link a signed-in Firebase user to Neon so analytics are per-person.
        if (user) {
            trackUser({
                uid: user.uid,
                email: user.email || undefined,
                name: user.displayName || undefined,
                provider: user.providerData?.[0]?.providerId || undefined,
            });
        }
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
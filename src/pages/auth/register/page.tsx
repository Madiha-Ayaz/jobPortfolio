// This page itself is a client component

import AnimatedSection from '@/components/ui/AnimatedSection';
import { auth as firebaseAuth } from '@/lib/firebase'; // The potentially null auth object
import RegisterForm from '@/components/auth/RegisterForm'; // New component

const RegisterPage = () => {
  // If firebaseAuth is null (e.g., during SSR), show a loading state.
  // The actual form with logic will only render when firebaseAuth is available.
  if (!firebaseAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <AnimatedSection>
          <div className="max-w-md w-full bg-surface border p-8 rounded-2xl" style={{ borderColor: 'var(--border-default)' }}>
            <p className="text-center" style={{ color: 'var(--text-muted)' }}>Loading authentication components...</p>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  // firebaseAuth is guaranteed to be non-null here, so we can pass it safely.
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <AnimatedSection>
        <div className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-xl" style={{ border: '1px solid var(--border-default)' }}>
          <RegisterForm auth={firebaseAuth} />
        </div>
      </AnimatedSection>
    </div>
  );
};

export default RegisterPage;
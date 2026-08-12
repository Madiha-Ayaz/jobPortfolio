// This page itself is a client component

import AnimatedSection from '@/components/ui/AnimatedSection';
import { auth as firebaseAuth } from '@/lib/firebase'; // The potentially null auth object
import RegisterForm from '@/components/auth/RegisterForm'; // New component

const RegisterPage = () => {
  // If firebaseAuth is null (e.g., during SSR), show a loading state.
  // The actual form with logic will only render when firebaseAuth is available.
  if (!firebaseAuth) {
    return (
      <AnimatedSection>
        <div className="max-w-md mx-auto bg-gray-800/20 p-8 rounded-lg border border-border-color">
          <p className="text-center text-text-secondary">Loading authentication components...</p>
        </div>
      </AnimatedSection>
    );
  }

  // firebaseAuth is guaranteed to be non-null here, so we can pass it safely.
  return (
    <AnimatedSection>
      <RegisterForm auth={firebaseAuth} />
    </AnimatedSection>
  );
};

export default RegisterPage;
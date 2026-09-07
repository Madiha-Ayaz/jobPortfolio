
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { Auth } from 'firebase/auth'; // Import Auth type
import { auth as firebaseAuth } from '@/lib/firebase';
import AnimatedSection from '@/components/ui/AnimatedSection';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'; // New component

const ForgotPasswordPage = () => {
  // If firebaseAuth is null (e.g., during SSR), show a loading state.
  // The actual form with hooks will only render when firebaseAuth is available.
  if (!firebaseAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <AnimatedSection>
          <div className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-xl" style={{ border: '1px solid var(--border-default)' }}>
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
        <ForgotPasswordForm auth={firebaseAuth} />
      </AnimatedSection>
    </div>
  );
};

export default ForgotPasswordPage;

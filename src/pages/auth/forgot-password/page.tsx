
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
      <ForgotPasswordForm auth={firebaseAuth} />
    </AnimatedSection>
  );
};

export default ForgotPasswordPage;

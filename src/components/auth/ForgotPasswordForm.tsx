

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { Auth } from 'firebase/auth'; // Import Auth type

interface ForgotPasswordFormProps {
  auth: Auth; // Expect a non-null Auth object
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ auth }) => {
  const [email, setEmail] = useState('');
  const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSent(false); // Reset status on new submission
    const success = await sendPasswordResetEmail(email);
    if (success) {
      setEmailSent(true);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800/20 p-8 rounded-lg border border-border-color">
      <h1 className="text-3xl font-bold text-center mb-6">Forgot Password</h1>
      
      {emailSent && (
        <p className="text-green-500 text-center mb-4">
          Password reset email sent! Please check your inbox (and spam folder).
        </p>
      )}
      {error && <p className="text-red-500 text-center mb-4">{error.message}</p>}

      {!emailSent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
              Enter your account email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background border border-border-color text-text px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-accent text-white font-bold py-3 rounded-md hover:bg-accent-dark transition-colors disabled:opacity-50"
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="text-text-secondary">You can now close this page.</p>
        </div>
      )}

      <p className="text-center text-sm text-text-secondary mt-8">
        Remember your password?{' '}
        <Link to="/auth/login" className="font-medium text-accent hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;

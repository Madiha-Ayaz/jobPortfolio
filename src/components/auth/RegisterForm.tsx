

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Auth } from 'firebase/auth'; // Import Auth type
import { useAuth } from '@/context/AuthContext';
import PhoneAuthForm from '@/components/auth/PhoneAuthForm';

interface RegisterFormProps {
  auth: Auth; // Expect a non-null Auth object
}

const RegisterForm: React.FC<RegisterFormProps> = ({ auth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneMode, setPhoneMode] = useState(false);

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      if (userCredential) {
        navigate('/'); // Redirect to home on successful registration
      }
    } catch (err: any) {
      let errorMessage = 'Registration failed. Please try again.';
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email address is already in use.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password must be at least 6 characters long.';
          break;
        default:
          // Use Firebase's error message for other cases
          errorMessage = err.message || 'An unexpected error occurred.';
          break;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-6" style={{ color: 'var(--text-heading)' }}>
        {phoneMode ? 'Sign in with phone' : 'Register'}
      </h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {phoneMode ? (
        <div className="space-y-4">
          <PhoneAuthForm
            auth={auth}
            onSuccess={() => navigate('/')}
          />
          <button
            type="button"
            onClick={() => {
              setPhoneMode(false);
              setError(null);
            }}
            className="w-full text-sm underline underline-offset-4 cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            ← Back to email registration
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-heading)' }}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-heading)' }}
              />
            </div>
            <button 
              type="submit" 
              className="w-full font-bold py-3 rounded-md transition-colors disabled:opacity-50"
              style={{ background: 'var(--accent)', color: 'var(--text-on-accent, #fff)' }}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
          </div>

          <button
            type="button"
            onClick={() => setPhoneMode(true)}
            className="w-full font-bold py-3 rounded-md transition-colors"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-default)', color: 'var(--text-heading)' }}
          >
            Sign up with phone
          </button>

          <p className="text-center text-sm mt-8" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/auth/login" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>
              Login
            </Link>
          </p>
        </>
      )}
    </>
  );
};

export default RegisterForm;

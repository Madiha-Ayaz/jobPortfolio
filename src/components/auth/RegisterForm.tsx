

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Auth } from 'firebase/auth'; // Import Auth type
import { useAuth } from '@/context/AuthContext';

interface RegisterFormProps {
  auth: Auth; // Expect a non-null Auth object
}

const RegisterForm: React.FC<RegisterFormProps> = ({ auth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
      
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleRegister} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-background border border-border-color text-text px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-background border border-border-color text-text px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-accent text-white font-bold py-3 rounded-md hover:bg-accent-dark transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-8">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-medium text-accent hover:underline">
          Login
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;

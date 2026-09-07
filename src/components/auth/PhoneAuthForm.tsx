'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Auth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import PhoneInput from 'react-phone-number-input';
import type { Value as PhoneValue } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface PhoneAuthFormProps {
  auth: Auth;
  onSuccess?: () => void;
}

const PhoneAuthForm: React.FC<PhoneAuthFormProps> = ({ auth, onSuccess }) => {
  const [phone, setPhone] = useState<PhoneValue | undefined>(undefined);
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  const appVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (!recaptchaContainerRef.current) return;
    try {
      appVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        size: 'invisible',
      });
    } catch (err) {
      console.error('[PhoneAuth] Failed to init reCAPTCHA verifier:', err);
    }
    return () => {
      appVerifierRef.current?.clear();
      appVerifierRef.current = null;
    };
  }, [auth]);

  const reset = useCallback(() => {
    setConfirmation(null);
    setOtp('');
    setError(null);
  }, []);

  const sendCode = async () => {
    setError(null);
    if (!phone) {
      setError('Please enter your phone number.');
      return;
    }
    if (!appVerifierRef.current) {
      setError('Verification is not ready yet. Please try again.');
      return;
    }
    setSending(true);
    try {
      const result = await signInWithPhoneNumber(auth, phone, appVerifierRef.current);
      setConfirmation(result);
      setOtp('');
    } catch (err: any) {
      let message = 'Failed to send verification code. Please try again.';
      switch (err.code) {
        case 'auth/operation-not-allowed':
          message = 'Phone authentication is not enabled on this project yet.';
          break;
        case 'auth/invalid-phone-number':
          message = 'Please enter a valid phone number.';
          break;
        case 'auth/quota-exceeded':
          message = 'Too many SMS requests. Please wait a while and retry.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many requests. Please try again later.';
          break;
        default:
          message = err.message || message;
          break;
      }
      setError(message);
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    setError(null);
    if (!confirmation) return;
    if (!otp.trim()) {
      setError('Please enter the verification code.');
      return;
    }
    setVerifying(true);
    try {
      await confirmation.confirm(otp);
      onSuccess?.();
    } catch (err: any) {
      let message = 'The verification code is invalid. Please check and retry.';
      switch (err.code) {
        case 'auth/invalid-verification-code':
          message = 'The verification code is incorrect or expired. Please retry.';
          break;
        case 'auth/code-expired':
          message = 'The verification code has expired. Please request a new one.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many attempts. Please try again later.';
          break;
        default:
          message = err.message || message;
          break;
      }
      setError(message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-2">
          Phone number
        </label>
        <PhoneInput
          id="phone"
          international
          defaultCountry="PK"
          value={phone}
          onChange={(value) => setPhone(value)}
          disabled={sending || verifying}
          className="w-full"
        />
      </div>

      {!confirmation ? (
        <button
          type="button"
          onClick={sendCode}
          disabled={sending || verifying || !phone}
          className="w-full bg-accent text-white font-bold py-3 rounded-md hover:bg-accent-dark transition-colors disabled:opacity-50"
        >
          {sending ? 'Sending code...' : 'Send verification code'}
        </button>
      ) : (
        <>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-text-secondary mb-2">
              Verification code
            </label>
            <input
              type="text"
              id="otp"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              className="w-full bg-background border border-border-color text-text px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            type="button"
            onClick={verifyOtp}
            disabled={verifying || !otp.trim()}
            className="w-full bg-accent text-white font-bold py-3 rounded-md hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {verifying ? 'Verifying...' : 'Verify & sign in'}
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={verifying}
            className="w-full text-sm text-text-secondary hover:text-text underline underline-offset-4 cursor-pointer disabled:opacity-50"
          >
            Change phone number
          </button>
        </>
      )}

      {error && <p className="text-red-500 text-center text-sm">{error}</p>}

      <div ref={recaptchaContainerRef} className="recaptcha-host" />
    </div>
  );
};

export default PhoneAuthForm;
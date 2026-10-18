import React, { useState } from 'react';
import { MikkysLogo } from './MikkysLogo';
import { storage } from '../services/storage';
import { UserProfile } from '../types';
import { Mail, Phone, Lock, Eye, EyeOff, User, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  onSuccess: (user: UserProfile) => void;
  onCancel?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess, onCancel }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your email or phone number.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    const res = storage.loginUser(identifier, password);
    if (res.success && res.user) {
      onSuccess(res.user);
    } else {
      setError(res.error || 'Failed to sign in.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    const user = storage.registerUser(fullName, email, phone, password);
    onSuccess(user);
  };

  const handleDemoFill = () => {
    setIdentifier('john@example.com');
    setPassword('password123');
    setError(null);
  };

  const handleGoogleDemo = () => {
    const user = storage.registerUser('John Doe', 'john.doe@gmail.com', '08031234567');
    onSuccess(user);
  };

  const handleForgotDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your registered email or phone.');
      return;
    }
    setSuccessMsg('Local Demo Mode: Password reset instructions simulated. You can sign in directly.');
    setTimeout(() => {
      setMode('signin');
      setSuccessMsg(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between p-6 overflow-y-auto">
      <div className="max-w-md w-full mx-auto py-8">
        {/* Brand header */}
        <div className="flex flex-col items-center mb-8">
          <MikkysLogo size="lg" variant="light" />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-neutral-900">
            {mode === 'signin' && 'Welcome back!'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Demo Password'}
          </h2>
          <p className="mt-1.5 text-sm text-neutral-500">
            {mode === 'signin' && 'Sign in to book your next cut.'}
            {mode === 'signup' && 'Join Mikkys for seamless VIP grooming bookings.'}
            {mode === 'forgot' && 'Enter your email or phone to reset locally.'}
          </p>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-[#F10B20] text-xs font-medium rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-3.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Email or phone number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. john@example.com or 08031234567"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20] focus:border-transparent transition-all placeholder:text-neutral-400"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20] focus:border-transparent transition-all placeholder:text-neutral-400"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-xs font-semibold text-[#F10B20] hover:underline"
              >
                Use Demo Account (John Doe)
              </button>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-800"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-4 bg-[#F10B20] hover:bg-[#d0091b] active:scale-[0.98] transition-all text-white font-bold rounded-xl shadow-lg shadow-[#F10B20]/25 text-sm font-display tracking-wide"
            >
              Sign In
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20]"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="e.g. name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20]"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Phone Number (WhatsApp)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="e.g. 08031234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20]"
                />
                <Phone className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20]"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-4 bg-[#F10B20] hover:bg-[#d0091b] active:scale-[0.98] transition-all text-white font-bold rounded-xl shadow-lg shadow-[#F10B20]/25 text-sm font-display tracking-wide"
            >
              Create Account
            </button>
          </form>
        )}

        {/* Forgot Password Flow */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotDemo} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Registered Email or Phone
              </label>
              <input
                type="text"
                placeholder="e.g. john@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-[#F10B20] text-white font-bold rounded-xl text-sm"
            >
              Simulate Password Reset
            </button>
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="w-full text-center text-xs text-neutral-600 hover:underline pt-2"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* Demo OR divider */}
        {mode === 'signin' && (
          <>
            <div className="relative my-6 flex items-center justify-center">
              <div className="border-t border-neutral-200 w-full" />
              <span className="bg-white px-3 text-xs text-neutral-400 font-semibold uppercase">
                OR
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleDemo}
              className="w-full py-3.5 px-4 bg-white border border-neutral-300 hover:bg-neutral-50 active:scale-[0.98] transition-all rounded-xl flex items-center justify-center gap-3 text-sm font-semibold text-neutral-700 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google (Demo)</span>
            </button>
          </>
        )}

        {/* Toggle sign in / sign up */}
        <div className="mt-8 text-center text-xs text-neutral-600">
          {mode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="font-bold text-[#F10B20] hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className="font-bold text-[#F10B20] hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

        {onCancel && (
          <div className="mt-6 text-center">
            <button
              onClick={onCancel}
              className="text-xs text-neutral-400 hover:text-neutral-700 underline"
            >
              Continue as guest
            </button>
          </div>
        )}
      </div>

      {/* Demo disclaimer footer */}
      <div className="text-center text-[11px] text-neutral-400 max-w-sm mx-auto pt-4 border-t border-neutral-100">
        Demo Application • Data is stored locally in your browser storage.
      </div>
    </div>
  );
};

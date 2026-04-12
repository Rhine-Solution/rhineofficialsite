import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type Tab = 'login' | 'register' | 'forgot';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: Tab;
}

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) setTab(initialTab);
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        } else if (event.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          ) as NodeListOf<HTMLElement>;

          if (!focusableElements || focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              event.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        if (previouslyFocusedElement.current) {
          previouslyFocusedElement.current.focus();
        }
      };
    } else {
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
        previouslyFocusedElement.current = null;
      }
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isValidEmail = (e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
  const isStrongPassword = (p: string) => p.length >= 8;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) return setError('Invalid email');
    if (!isStrongPassword(password)) return setError('Password must be ≥8 characters');
    setLoading(true);
    try {
      const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });
      if (authErr) throw authErr;
      onClose();
      navigate('/dashboard');
    } catch (err: unknown) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) return setError('Invalid email');
    if (!isStrongPassword(password)) return setError('Password must be ≥8 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      const { error: authErr } = await supabase.auth.signUp({ email, password });
      if (authErr) throw authErr;
      onClose();
      navigate('/dashboard');
    } catch (err: unknown) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) return setError('Invalid email');
    setLoading(true);
    try {
      const { error: authErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (authErr) throw authErr;
      setError(null);
      alert('Password reset link sent to your email!');
      onClose();
    } catch (err: unknown) {
      setError('Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setError(null);
    setLoading(true);
    try {
      const { error: authErr } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (authErr) throw authErr;
    } catch (err: unknown) {
      setError(`Failed to sign in with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] pointer-events-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      ref={modalRef}
    >
      <div
        className="relative w-full max-w-md bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <div className="flex justify-center mb-6">
          </div>

          <div className="flex justify-center gap-4 mb-6 border-b border-white/10">
            <button
              className={`pb-2 text-sm font-medium transition-colors ${tab === 'login'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/60 hover:text-white'
                }`}
              onClick={() => setTab('login')}
            >
              Login
            </button>
            <button
              className={`pb-2 text-sm font-medium transition-colors ${tab === 'register'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/60 hover:text-white'
                }`}
              onClick={() => setTab('register')}
            >
              Register
            </button>
            <button
              className={`pb-2 text-sm font-medium transition-colors ${tab === 'forgot'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/60 hover:text-white'
                }`}
              onClick={() => setTab('forgot')}
            >
              Forgot Password
            </button>
          </div>

          {error && (
            <div className="mb-4 p-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg">
              {error}
            </div>
          )}

          <form
            onSubmit={
              tab === 'login'
                ? handleLogin
                : tab === 'register'
                  ? handleRegister
                  : handleForgot
            }
          >
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                required
              />
            </div>

            {tab !== 'forgot' && (
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                  required
                />
              </div>
            )}

            {tab === 'register' && (
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
            >
              {loading
                ? 'Please wait...'
                : tab === 'login'
                  ? 'Login'
                  : tab === 'register'
                    ? 'Create Account'
                    : 'Send Reset Link'}
            </button>
          </form>

          {tab !== 'forgot' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-black/80 text-white/40">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/80 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('github')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/80 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>
            </>
          )}

          <p className="mt-4 text-center text-xs text-white/40">
            {tab === 'login'
              ? "Don't have an account? "
              : tab === 'register'
                ? 'Already have an account? '
                : 'Remembered your password? '}
            <button
              onClick={() =>
                setTab(
                  tab === 'login' ? 'register' : tab === 'register' ? 'login' : 'login'
                )
              }
              className="text-white/80 hover:text-white transition-colors"
            >
              {tab === 'login' ? 'Register' : tab === 'register' ? 'Login' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
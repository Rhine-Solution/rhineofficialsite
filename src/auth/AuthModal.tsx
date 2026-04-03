import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type Tab = 'login' | 'register' | 'forgot';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeColor?: string;
  initialTab?: Tab;
}

export default function AuthModal({ isOpen, onClose, themeColor, initialTab = 'login' }: AuthModalProps) {
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
      const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
      if (authErr) throw authErr;
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
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
      const { data, error: authErr } = await supabase.auth.signUp({ email, password });
      if (authErr) throw authErr;
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
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
      const { data, error: authErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (authErr) throw authErr;
      onClose();
    } catch (err: any) {
      setError('Password reset failed');
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
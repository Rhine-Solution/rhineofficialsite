import { useEffect, useState } from 'react';
import '../App.css';
import './Admin.css';
import WebGPU from 'three/examples/jsm/capabilities/WebGPU.js';
import { RhineLogo } from '../components/GFX';
import { Root } from '../lib/Root';
import { supabase } from "../lib/supabase";

type Tab = 'login' | 'register' | 'forgot';

export default function Admin() {
  const [hasWebGPU, setHasWebGPU] = useState(false);
  const [hue, setHue] = useState(0);
  const [displayZoom, setDisplayZoom] = useState(0);
  const [tab, setTab] = useState<Tab>('login');

  // Auth state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state (kept minimal; validate before sending)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setHasWebGPU(WebGPU.isAvailable());

    const syncHUD = () => {
      setDisplayZoom(Root.zoomPercent || 0);
      requestAnimationFrame(syncHUD);
    };
    syncHUD();

    let rafId: number;
    let lastTimestamp = 0;
    const speed = 0.5;
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = Math.min(0.03, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;
      setHue((prev) => (prev + delta * speed * 360) % 360);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const themeColor = `hsl(${hue}, 100%, 60%)`;

  // Validation helpers
  const isValidEmail = (e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
  const isStrongPassword = (p: string) => p.length >= 8; // extend with complexity rules if desired

  // Actions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) return setError('Invalid email');
    if (!isStrongPassword(password)) return setError('Password must be >= 8 chars');
    setLoading(true);
    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
      if (authErr) throw authErr;
      console.log('Signed in', data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) return setError('Invalid email');
    if (!isStrongPassword(password)) return setError('Password must be >= 8 chars');
    if (password !== confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      const { data, error: authErr } = await supabase.auth.signUp({ email, password });
      if (authErr) throw authErr;
      console.log('Registered', data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Registration failed');
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
        redirectTo: window.location.origin + '/admin',
      });
      if (authErr) throw authErr;
      console.log('Reset requested', data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="admin-app" className="relative w-full min-h-screen overflow-hidden font-rubik selection:bg-white/20">
      {/* WebGPU background remains at z-0 (LandingPage uses Root/WebGPU). We simply ensure Admin has a semi-blurred panel on top */}
      <div className="admin-panel-container">
        <div className="logo-row">
          <div className="w-12 h-12">{RhineLogo(themeColor)}</div>
          <h1 className="admin-title">Welcome, back!</h1>
        </div>

        <div className="tabs">
          <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Login</button>
          <button className={`tab-btn ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Register</button>
          <button className={`tab-btn ${tab === 'forgot' ? 'active' : ''}`} onClick={() => setTab('forgot')}>Forgot</button>
        </div>

        <div className="tab-panel">
          {error && <div className="error" role="alert">{error}</div>}

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="form">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value.trim())} required />
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="submit" disabled={loading}>{loading ? 'Signing...' : 'Sign In'}</button>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister} className="form">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value.trim())} required />
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <label>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <button type="submit" className="submit" disabled={loading}>{loading ? 'Registering...' : 'Create Account'}</button>
            </form>
          )}

          {tab === 'forgot' && (
            <form onSubmit={handleForgot} className="form">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value.trim())} required />
              <button type="submit" className="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Reset'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

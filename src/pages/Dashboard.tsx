import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import { User as UserIcon } from 'lucide-react';
import SettingsModal from '../components/SettingsModal';

// Types
type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: string; // ISO
};

// Security helpers (strict client-side sanitation only; server must re-validate)
const ALLOWED_NAME_RE = /^[\w \-\._'@*!:]{3,80}$/;
function sanitizeForDisplay(input: string | null | undefined, max = 100) {
  if (!input) return '';
  const trimmed = input.trim();
  const safe = trimmed.replace(/<[^>]*>/g, ''); // remove tags
  return safe.slice(0, max);
}

function sanitizeName(input: string | null | undefined, fallback = 'User') {
  if (!input) return fallback;
  const safe = input.trim().replace(/<[^>]*>/g, '');
  return safe.slice(0, 50) || fallback;
}

function getGreeting(displayName: string | null | undefined) {
  const hour = new Date().getUTCHours(); // UTC-based greeting per requirement
  const name = sanitizeName(displayName, 'there');
  if (hour < 12) return `Good morning, ${name}!`;
  if (hour < 18) return `Good afternoon, ${name}!`;
  return `Good evening, ${name}!`;
}

export default function Dashboard(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  // Dashboard state
  const [projects, setProjects] = useState<Project[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [notifications] = useState([
    { id: 'n1', title: 'Welcome', body: 'Welcome to Rhine Dashboard', time: new Date().toISOString() },
  ]);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  // Initialize user & demo data
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) console.error('auth.getUser error', error.message);
        if (mounted && !data?.user) {
          navigate('/', { replace: true });
          return;
        }

        if (mounted && data?.user) {
          setEmail(data.user.email ?? null);
          setDisplayName(
            (data.user.user_metadata && (data.user.user_metadata.full_name || data.user.user_metadata.fullName)) ?? null
          );
        }

        if (mounted) {
          // Demo projects: replace with secured API in production
          setProjects([
            { id: 'p1', name: 'Website Redesign', description: 'Landing + dashboard refresh', createdAt: new Date().toISOString() },
            { id: 'p2', name: 'WebGPU Prototype', description: 'Realtime GPU particles', createdAt: new Date().toISOString() },
            { id: 'p3', name: 'Internal Tools', description: 'Admin dashboards', createdAt: new Date().toISOString() },
          ]);
        }
      } catch (err) {
        console.error('init error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/', { replace: true });
      } else if (event === 'SIGNED_IN' && session?.user) {
        setEmail(session.user.email ?? null);
        setDisplayName(
          (session.user.user_metadata && (session.user.user_metadata.full_name || session.user.user_metadata.fullName)) ?? null
        );
      }
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [navigate]);

  // Click outside to close menu
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target as Node) && buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  // Actions
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setMenuOpen(false);
      navigate('/');
    } catch (err: any) {
      console.error('signOut failed', err?.message || err);
      setError('Logout failed');
    }
  };

  const handleSettings = () => {
    setMenuOpen(false);
    setSettingsOpen(true);
  };

  // Create project (client-only demo). Server-side replacement required for production.
  const validateProjectInput = (name: string) => {
    const s = name.trim();
    if (s.length < 3) return 'Project name must be at least 3 characters';
    if (s.length > 80) return 'Project name too long';
    if (!ALLOWED_NAME_RE.test(s)) return 'Project name contains invalid characters';
    return null;
  };

  const handleCreateProject = async () => {
    setError(null);
    const v = validateProjectInput(newName);
    if (v) return setError(v);
    const name = sanitizeForDisplay(newName, 80);
    const desc = sanitizeForDisplay(newDesc, 240);

    setCreating(true);
    try {
      // TODO: Replace with authenticated server API that enforces RLS/ownership.
      const newProject: Project = {
        id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name,
        description: desc || undefined,
        createdAt: new Date().toISOString(),
      };
      setProjects((prev) => [newProject, ...prev]);
      setNewName('');
      setNewDesc('');
    } catch (err) {
      console.error('createProject error', err);
      setError('Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const safeDisplay = sanitizeName(displayName, null);
  const greeting = getGreeting(safeDisplay ?? (email ? email.split('@')[0] : 'there'));
  const utcNow = new Date().toUTCString();

  // Dashboard layout
  return (
    <Layout themeColor="#60a5fa" showAuthButtons={false} disableSideMenu>
      <div className="min-h-[80vh] pt-24 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <main className="flex-1">
              {/* Greeting card: glass panel with high contrast */}
              <div className="rounded-2xl bg-gradient-to-r from-white/6 to-black/10 p-6 backdrop-blur-md border border-white/10 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md">{greeting}</h1>
                    <div className="mt-1 text-sm text-white/70">UTC time: <span className="font-medium text-white">{utcNow}</span></div>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                  </div>
                </div>

                {/* Quick stats */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/6 border border-white/10 shadow-lg">
                    <div className="text-xs text-white/60">Active projects</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{projects.length}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/6 border border-white/10 shadow-lg">
                    <div className="text-xs text-white/60">Notifications</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{notifications.length}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/6 border border-white/10 shadow-lg">
                    <div className="text-xs text-white/60">Storage</div>
                    <div className="mt-2 text-2xl font-semibold text-white">0 MB</div>
                  </div>
                </div>
              </div>

              {/* Main content: Projects & Activity */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="lg:col-span-2 space-y-6">
                  <div className="p-4 rounded-xl bg-white/6 backdrop-blur-md border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-white">Projects</h2>
                      <div className="flex items-center gap-3">
                        <button onClick={() => { setNewName(''); setNewDesc(''); setCreating(false); }} className="px-3 py-2 bg-white/5 rounded-md text-white">Refresh</button>
                        <button onClick={() => setCreating((c) => !c)} className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-sky-400 hover:from-indigo-600 hover:to-sky-500 rounded-md text-white shadow-md">New Project</button>
                      </div>
                    </div>

                    {creating && (
                      <div className="p-4 rounded-lg bg-black/20">
                        {error && <div className="text-sm text-red-300 mb-2">{error}</div>}
                        <label className="block text-xs text-white/60 mb-1">Name</label>
                        <input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-3 py-2 rounded bg-black/30 text-white" />
                        <label className="block text-xs text-white/60 mt-3 mb-1">Description</label>
                        <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full px-3 py-2 rounded bg-black/30 text-white" />
                        <div className="mt-3 flex justify-end gap-3">
                          <button onClick={() => setCreating(false)} className="px-3 py-2 bg-white/5 rounded">Cancel</button>
                          <button onClick={handleCreateProject} className="px-3 py-2 bg-blue-500/90 rounded text-white">{creating ? 'Creating...' : 'Create'}</button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {projects.map((p) => (
                        <article key={p.id} className="p-4 rounded-xl bg-white/6 backdrop-blur-md border border-white/10 flex items-start justify-between">
                          <div>
                            <time className="text-xs text-white/60">{new Date(p.createdAt).toLocaleString()}</time>
                            <h3 className="mt-1 text-lg font-medium text-white">{sanitizeForDisplay(p.name)}</h3>
                            {p.description && <p className="mt-1 text-sm text-white/60">{sanitizeForDisplay(p.description)}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-2 bg-white/5 rounded text-white/80">Open</button>
                            <button className="px-3 py-2 bg-red-600/20 rounded text-white/80">Delete</button>
                          </div>
                        </article>
                      ))}

                      {projects.length === 0 && <div className="text-white/60">No projects yet.</div>}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/6 backdrop-blur-md border border-white/10">
                    <h2 className="text-lg font-semibold text-white">Activity</h2>
                    <div className="mt-3 text-sm text-white/60">No recent activity.</div>
                  </div>
                </section>

                <aside className="space-y-6">
                  <div className="p-4 rounded-xl bg-white/6 backdrop-blur-md border border-white/10">
                    <h3 className="text-sm text-white/60">Notifications</h3>
                    <ul className="mt-3 space-y-2">
                      {notifications.map((n) => (
                        <li key={n.id} className="text-sm text-white/80">{sanitizeForDisplay(n.title)} — <span className="text-xs text-white/60">{new Date(n.time).toLocaleString()}</span></li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-white/6 backdrop-blur-md border border-white/10">
                    <h3 className="text-sm text-white/60">Recent files</h3>
                    <div className="mt-3 text-sm text-white/60">No files uploaded.</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/6 backdrop-blur-md border border-white/10">
                    <h3 className="text-sm text-white/60">Quick Actions</h3>
                    <div className="mt-3 flex flex-col gap-2">
                      <button className="px-3 py-2 bg-white/5 rounded">Invite teammate</button>
                      <button className="px-3 py-2 bg-white/5 rounded">Upload file</button>
                    </div>
                  </div>
                </aside>
              </div>
            </main>

            {/* Right column summary */}
            <aside className="w-full lg:w-80">
              <div className="p-4 rounded-xl bg-white/6 backdrop-blur-md border border-white/10">
                <div className="text-sm text-white/60">Account</div>
                <div className="text-white mt-1 font-semibold">{sanitizeName(displayName, 'User')}</div>
                <div className="text-xs text-white/60">{sanitizeForDisplay(email)}</div>

                <div className="mt-4 flex flex-col gap-2">
                  <button onClick={handleSettings} className="w-full px-3 py-2 bg-white/5 rounded">Settings</button>
                  <button onClick={handleLogout} className="w-full px-3 py-2 bg-red-600/20 rounded">Log out</button>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-white/6 backdrop-blur-md border border-white/10">
                <div className="text-sm text-white/60">Storage usage</div>
                <div className="mt-2 text-lg text-white font-semibold">0%</div>
                <div className="w-full bg-white/5 h-2 rounded mt-2 overflow-hidden">
                  <div className="bg-white h-2 w-1/4" />
                </div>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-white/6 backdrop-blur-md border border-white/10">
                <div className="text-sm text-white/60">Team</div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80">Z</div>
                  <div>
                    <div className="text-sm text-white">UserExample</div>
                    <div className="text-xs text-white/60">Owner</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </Layout>
  );
}

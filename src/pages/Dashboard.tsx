import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import SettingsModal from '../components/SettingsModal';
import { Eye, X } from 'lucide-react';

// Types
type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: string; // ISO
  owner: 'solo' | 'team';
};

type NotificationItem = {
  id: string;
  title: string;
  body?: string;
  hero_url?: string | null;
  time: string; // ISO
};

// Security helpers (strict client-side sanitation only; server must re-validate)
const ALLOWED_NAME_RE = /^[\w \-\._'@*!:]{3,80}$/;
function sanitizeForDisplay(input: string | null | undefined, max = 100) {
  if (!input) return '';
  const trimmed = input.trim();
  const safe = trimmed.replace(/<[^>]*>/g, ''); // remove tags
  return safe.slice(0, max);
}

function sanitizeFullText(input: string | null | undefined, max = 2000) {
  // remove HTML tags, collapse excessive whitespace but preserve simple structure
  if (!input) return '';
  const noTags = input.replace(/<[^>]*>/g, '');
  const collapsed = noTags.replace(/[\t\r ]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  return collapsed.slice(0, max);
}

function sanitizeFullTextPreserve(input: string | null | undefined, max = 5000) {
  // remove tags but preserve newlines for modal reading experience
  if (!input) return '';
  const noTags = input.replace(/<[^>]*>/g, '');
  const trimmed = noTags.replace(/\t+/g, ' ').replace(/\r+/g, '\n').trim();
  return trimmed.slice(0, max);
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

function formatDate(iso?: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function Dashboard(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  // Dashboard state
  const [projects, setProjects] = useState<Project[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState<string | null>(null);

  const [projectFolder, setProjectFolder] = useState<'all' | 'solo' | 'team'>('all');

  // Modal state
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);

  const navigate = useNavigate();

  // Initialize user & demo data and fetch notifications
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
          // Demo projects grouped by owner: solo (user-specific) and team (shared)
          setProjects([
            { id: 'p1', name: 'Website Redesign', description: 'Landing + dashboard refresh', createdAt: new Date().toISOString(), owner: 'solo' },
            { id: 'p2', name: 'WebGPU Prototype', description: 'Realtime GPU particles', createdAt: new Date().toISOString(), owner: 'team' },
            { id: 'p3', name: 'Internal Tools', description: 'Admin dashboards', createdAt: new Date().toISOString(), owner: 'team' },
          ]);
        }

        // fetch notifications from Supabase - read-only
        await fetchNotifications();
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
        // refetch notifications for the new session
        fetchNotifications().catch((err) => console.error('fetchNotifications', err));
      }
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Fetch notifications from Supabase - safe, read-only (no inserts from client)
  const fetchNotifications = async () => {
    setNotifLoading(true);
    setNotifError(null);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id, title, body, hero_url, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      if (!data) return setNotifications([]);

      const mapped: NotificationItem[] = data.map((r: any) => ({
        id: String(r.id),
        title: String(r.title ?? ''),
        body: r.body ?? undefined,
        hero_url: r.hero_url ?? null,
        time: r.created_at ?? new Date().toISOString(),
      }));

      setNotifications(mapped);
      if (mapped.length > 0) {
        setSelectedNotif((prev) => prev ?? mapped[0]);
      } else {
        setSelectedNotif(null);
      }
    } catch (err: any) {
      console.error('fetchNotifications failed', err?.message || err);
      setNotifError('Failed to load notifications');
      setNotifications([]);
      setSelectedNotif(null);
    } finally {
      setNotifLoading(false);
    }
  };

  // Actions
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (err: any) {
      console.error('signOut failed', err?.message || err);
      setError('Logout failed');
    }
  };

  const handleSettings = () => setSettingsOpen(true);

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
      const newProject: Project = {
        id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name,
        description: desc || undefined,
        createdAt: new Date().toISOString(),
        owner: 'solo', // default for now; UI supports folders
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

  const filteredProjects = projects.filter((p) => (projectFolder === 'all' ? true : p.owner === projectFolder));

  // Notification modal component
  const NotificationModal: React.FC = () => {
    if (!notifModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60" onClick={() => setNotifModalOpen(false)} />
        <div className="relative w-11/12 max-w-5xl max-h-[85vh] bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-lg">
          {/* Top header (close button centered vertically and spaced) */}
          <div className="w-full">
            <div className="flex justify-end items-center p-4 border-b border-white/5">
              <button
                aria-label="Close notifications"
                onClick={() => setNotifModalOpen(false)}
                className="p-2 rounded-md bg-black/20 hover:bg-black/30"
              >
                <X className="w-5 h-5 text-white/90" />
              </button>
            </div>
          </div>

          <div className="flex h-[calc(85vh-64px)]">{/* subtract header height (approx 64px) to keep modal within viewport */}
            {/* Left list */}
            <div className="w-1/3 p-4 overflow-auto border-r border-white/5 bg-black/20 min-w-[160px] max-w-[320px]">
              <h3 className="text-sm text-white/60 mb-2">All notifications</h3>
              <ul className="space-y-2">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => setSelectedNotif(n)}
                      className={`w-full text-left p-2 rounded ${selectedNotif?.id === n.id ? 'bg-white/6' : 'hover:bg-white/3'}`}
                    >
                      <div className="text-sm font-semibold text-white truncate">{sanitizeForDisplay(n.title, 120)}</div>
                      <div className="text-xs text-white/50">{formatDate(n.time)}</div>
                    </button>
                  </li>
                ))}
              </ul>

              {notifications.length === 0 && (
                <div className="mt-3 text-sm text-white/60">No, notifications yet!</div>
              )}
            </div>

            {/* Center content */}
            <div className="flex-1 p-4 overflow-auto">
              {selectedNotif ? (
                <div className="max-h-full overflow-auto pr-2">
                  <article>
                    {selectedNotif.hero_url && (
                      <div className="w-full h-40 sm:h-48 md:h-56 rounded-lg overflow-hidden mb-4 bg-white/5">
                        <img src={selectedNotif.hero_url} alt="notification banner" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <h2 className="text-2xl font-bold text-white">{sanitizeForDisplay(selectedNotif.title, 200)}</h2>
                    <div className="text-xs text-white/50 mt-1 mb-4">{formatDate(selectedNotif.time)}</div>
                    <div className="rounded-lg p-4 bg-black/20 border border-white/5 text-white/90 whitespace-pre-wrap break-words">
                      {sanitizeFullTextPreserve(selectedNotif.body)}
                    </div>
                  </article>
                </div>
              ) : (
                <div className="text-white/60">Select a notification to read</div>
              )}
            </div>

            {/* Right column: spacer (kept small to avoid overflow) */}
            <div className="w-12 p-3 flex flex-col items-center justify-start border-l border-white/5">
              {/* Intentionally empty - close button moved to header */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout themeColor="#60a5fa" showAuthButtons={false} disableSideMenu>
      {/* page-level scroll: ensures browser scrollbar appears when content height exceeds viewport */}
      <div className="min-h-screen pt-24 px-6 sm:px-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <main className="flex-1">
              {/* Greeting card */}
              <div className="rounded-2xl bg-gradient-to-r from-white/6 to-black/10 p-6 backdrop-blur-md border border-white/10 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md">{greeting}</h1>
                    <div className="mt-1 text-sm text-white/70">UTC time: <span className="font-medium text-white">{utcNow}</span></div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/6 border border-white/8">
                    <div className="text-xs text-white/60">Active projects</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{projects.length}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/6 border border-white/8">
                    <div className="text-xs text-white/60">Notifications</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{notifications.length}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/6 border border-white/8">
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

                      {/* Folder tabs */}
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setNewName(''); setNewDesc(''); setCreating(false); }} className="px-3 py-2 bg-white/5 rounded-md text-white">Refresh</button>
                        <div className="inline-flex rounded-md bg-white/5 p-1">
                          <button onClick={() => setProjectFolder('all')} className={`px-3 py-1 rounded ${projectFolder === 'all' ? 'bg-indigo-600 text-white' : 'text-white/80'}`}>All</button>
                          <button onClick={() => setProjectFolder('solo')} className={`px-3 py-1 rounded ${projectFolder === 'solo' ? 'bg-indigo-600 text-white' : 'text-white/80'}`}>Solo</button>
                          <button onClick={() => setProjectFolder('team')} className={`px-3 py-1 rounded ${projectFolder === 'team' ? 'bg-indigo-600 text-white' : 'text-white/80'}`}>Team</button>
                        </div>
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
                          <button onClick={handleCreateProject} className="px-3 py-2 bg-blue-500/90 rounded text-white">Create</button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {filteredProjects.map((p) => (
                        <article key={p.id} className="p-4 rounded-xl bg-white/6 backdrop-blur-md border border-white/10 flex items-start justify-between">
                          <div>
                            <time className="text-xs text-white/60">{new Date(p.createdAt).toLocaleString()}</time>
                            <h3 className="mt-1 text-lg font-medium text-white">{sanitizeForDisplay(p.name)}</h3>
                            {p.description && <p className="mt-1 text-sm text-white/60">{sanitizeForDisplay(p.description)}</p>}
                            <div className="mt-2 text-xs text-white/50">{p.owner === 'solo' ? 'Solo' : 'Team'}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-2 bg-white/5 rounded text-white/80">Open</button>
                            <button className="px-3 py-2 bg-red-600/20 rounded text-white/80">Delete</button>
                          </div>
                        </article>
                      ))}

                      {filteredProjects.length === 0 && <div className="text-white/60">No projects in this folder.</div>}
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

                    {/* Notifications list: show only title + date and an eye icon button that opens modal */}
                    <div role="region" aria-label="Notifications" className="mt-3 space-y-3 max-h-56 overflow-auto pr-2">
                      {notifLoading && <div className="text-sm text-white/60">Loading...</div>}
                      {notifError && <div className="text-sm text-red-400">{notifError}</div>}
                      {!notifLoading && notifications.length === 0 && <div className="text-sm text-white/60">No, notifications yet!</div>}

                      {notifications.map((n) => (
                        <div key={n.id} className="p-3 rounded-md bg-black/20 border border-white/5 flex items-center justify-between">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-white truncate max-w-[12rem]">{sanitizeForDisplay(n.title, 120)}</div>
                            <div className="text-xs text-white/50">{formatDate(n.time)}</div>
                          </div>
                          <div>
                            <button
                              aria-label={`Read notification ${sanitizeForDisplay(n.title)}`}
                              onClick={() => {
                                setSelectedNotif(n);
                                setNotifModalOpen(true);
                              }}
                              className="flex items-center justify-center w-9 h-9 rounded bg-white/5 hover:bg-white/8"
                            >
                              <Eye className="w-4 h-4 text-white/90" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button onClick={() => fetchNotifications()} className="px-3 py-2 text-xs bg-white/5 rounded">Refresh notifications</button>
                    </div>
                  </div>

                  {/* Recent files removed per request */}

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

        {/* Notification modal portal */}
        <NotificationModal />
      </div>
    </Layout>
  );
}

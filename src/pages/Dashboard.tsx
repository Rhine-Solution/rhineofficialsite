import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import SettingsModal from '../components/SettingsModal';
import { Eye, X, HardDrive, Plus, HelpCircle } from 'lucide-react';
import { Joyride, STATUS } from 'react-joyride';
import type { Step, TooltipRenderProps, Props as JoyrideProps } from 'react-joyride';

// Minimal callback data shape — don't trust upstream types. Keep only what we need and allow extras.
type JoyrideCallbackData = {
  status?: string;
  index?: number;
  type?: string;
  step?: any;
  [key: string]: any;
};

// Workaround: react-joyride types may not include `callback` on Props for your installed version.
// Create an extended props interface and cast Joyride to a component that accepts it.
interface JoyrideWithCallbackProps extends JoyrideProps {
  callback?: (data: JoyrideCallbackData) => void;
}
const JoyrideWithCallback = (Joyride as unknown) as React.ComponentType<JoyrideWithCallbackProps>;

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

// Security helpers
const ALLOWED_NAME_RE = /^[\w \-\._'@*!:]{3,80}$/;
function sanitizeForDisplay(input: string | null | undefined, max = 100) {
  if (!input) return '';
  const trimmed = input.trim();
  const safe = trimmed.replace(/<[^>]*>/g, '');
  return safe.slice(0, max);
}

function sanitizeFullText(input: string | null | undefined, max = 2000) {
  if (!input) return '';
  const noTags = input.replace(/<[^>]*>/g, '');
  const collapsed = noTags.replace(/[\t\r ]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  return collapsed.slice(0, max);
}

function sanitizeFullTextPreserve(input: string | null | undefined, max = 5000) {
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
  const hour = new Date().getUTCHours();
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

// Custom tooltip component with dark glass styling (readable, not pill-shaped)
const CustomTooltip = (props: TooltipRenderProps) => {
  const {
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    skipProps,
    tooltipProps,
  } = props;

  // Ensure content is sanitized before rendering (defense-in-depth; props come from our steps)
  const title = typeof step.title === 'string' ? step.title : String(step.title ?? '');
  const content = typeof step.content === 'string' ? step.content : String(step.content ?? '');

  return (
    <div
      {...tooltipProps}
      role="dialog"
      aria-modal="false"
      className="bg-black/85 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl p-4 max-w-sm text-white"
    >
      <div className="text-white font-semibold mb-1 truncate">{title}</div>
      <div className="text-white/80 text-sm mb-3">{content}</div>
      <div className="flex justify-between items-center gap-2">
        <div className="flex gap-2">
          {index > 0 && (
            <button
              {...backProps}
              className="px-3 py-1.5 text-xs rounded-full bg-white/8 text-white hover:bg-white/14 transition-colors"
            >
              Back
            </button>
          )}
          <button
            {...skipProps}
            className="px-3 py-1.5 text-xs rounded-full bg-white/8 text-white hover:bg-white/14 transition-colors"
          >
            Skip
          </button>
        </div>
        <button
          {...(continuous ? primaryProps : closeProps)}
          className="px-3 py-1.5 text-xs rounded-full bg-white/14 text-white hover:bg-white/22 transition-colors"
        >
          {continuous ? (index === (step as any).__joyrideStepsLength - 1 ? 'Finish' : 'Next') : 'Close'}
        </button>
      </div>
    </div>
  );
};

export default function Dashboard(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState<string | null>(null);

  const [projectFolder, setProjectFolder] = useState<'all' | 'solo' | 'team'>('all');

  const [storageUsedMB, setStorageUsedMB] = useState(512);
  const [storageLimitMB, setStorageLimitMB] = useState(1024);

  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);

  // Onboarding tour state
  const [runTour, setRunTour] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  const navigate = useNavigate();

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
          setProjects([
            { id: 'p1', name: 'Website Redesign', description: 'Landing + dashboard refresh', createdAt: new Date().toISOString(), owner: 'solo' },
            { id: 'p2', name: 'WebGPU Prototype', description: 'Realtime GPU particles', createdAt: new Date().toISOString(), owner: 'team' },
            { id: 'p3', name: 'Internal Tools', description: 'Admin dashboards', createdAt: new Date().toISOString(), owner: 'team' },
          ]);
        }

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
        fetchNotifications().catch((err) => console.error('fetchNotifications', err));
      }
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [navigate]);

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
        owner: 'solo',
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

  const handleExtendStorage = () => {
    setStorageLimitMB((prev) => prev + 1024);
    alert(`Storage limit increased to ${(storageLimitMB + 1024) / 1024} GB`);
  };

  // Tour steps
  const tourSteps: Step[] = [
    {
      target: '.greeting-card',
      content: 'Welcome to your dashboard! Here you can see an overview of your activity.',
      title: '👋 Welcome!',
      placement: 'bottom',
    },
    {
      target: '.quick-stats',
      content: 'Quick stats show your active projects, unread notifications, and current storage usage.',
      title: '📊 Key Metrics',
      placement: 'bottom',
    },
    {
      target: '.projects-section',
      content: 'Manage all your projects here. You can filter by Solo or Team, and create new projects.',
      title: '📁 Projects',
      placement: 'right',
    },
    {
      target: '.new-project-btn',
      content: 'Click this button to start a new project. Give it a name and description.',
      title: '✨ Create Project',
      placement: 'bottom',
    },
    {
      target: '.notifications-panel',
      content: 'Stay updated with the latest announcements. Click the eye icon to read full details.',
      title: '🔔 Notifications',
      placement: 'left',
    },
    {
      target: '.storage-card',
      content: 'Monitor your storage space. The progress bar changes colour at 50% (orange) and 75% (red).',
      title: '💾 Storage Usage',
      placement: 'left',
    },
    {
      target: '.account-card',
      content: 'Your profile and account settings are here. You can also log out safely.',
      title: '👤 Account',
      placement: 'left',
    },
    {
      target: '.quick-actions',
      content: 'Quick actions let you invite teammates or upload files directly.',
      title: '⚡ Quick Actions',
      placement: 'left',
    },
  ];

  const handleJoyrideCallback = (data: JoyrideCallbackData) => {
    try {
      const { status, index, type, action } = data;
      const t = String(type ?? '').toLowerCase();

      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        setRunTour(false);
        return;
      }

      // If target not found or other error, advance to next step to avoid blank overlay
      if (t.includes('target') || t.includes('error')) {
        setTourStepIndex((s) => Math.min(s + 1, tourSteps.length - 1));
        return;
      }

      // Keep controlled step index in sync. When Joyride reports an index, mirror it.
      if (typeof index === 'number') {
        // If the event indicates the step finished/after or the user action was "next", move forward
        if (t.includes('after') || action === 'next') {
          setTourStepIndex(Math.min(index + 1, tourSteps.length - 1));
        } else {
          setTourStepIndex(index);
        }
      }
    } catch (err) {
      console.error('joyride callback error', err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-black">Loading...</div>;

  const safeDisplay = sanitizeName(displayName, null);
  const greeting = getGreeting(safeDisplay ?? (email ? email.split('@')[0] : 'there'));
  const utcNow = new Date().toUTCString();

  const filteredProjects = projects.filter((p) => (projectFolder === 'all' ? true : p.owner === projectFolder));

  const usedPercentage = (storageUsedMB / storageLimitMB) * 100;
  let barColorClass = 'bg-green-500';
  if (usedPercentage >= 75) barColorClass = 'bg-red-500';
  else if (usedPercentage >= 50) barColorClass = 'bg-orange-500';

  const formatStorageLimit = () => {
    if (storageLimitMB >= 1024) {
      return `${(storageLimitMB / 1024).toFixed(1)} GB`;
    }
    return `${storageLimitMB} MB`;
  };

  const formatStorageUsed = () => {
    if (storageUsedMB >= 1024) {
      return `${(storageUsedMB / 1024).toFixed(1)} GB`;
    }
    return `${storageUsedMB} MB`;
  };

  const NotificationModal: React.FC = () => {
    if (!notifModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNotifModalOpen(false)} />
        <div className="relative w-11/12 max-w-5xl max-h-[85vh] bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
          <div className="w-full">
            <div className="flex justify-end items-center p-4 border-b border-white/10">
              <button
                aria-label="Close notifications"
                onClick={() => setNotifModalOpen(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex h-[calc(85vh-64px)]">
            <div className="w-1/3 p-4 overflow-auto border-r border-white/10 bg-black/40 min-w-[160px] max-w-[320px]">
              <h3 className="text-sm text-white/60 mb-2">All notifications</h3>
              <ul className="space-y-2">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => setSelectedNotif(n)}
                      className={`w-full text-left p-2 rounded-lg transition-colors ${selectedNotif?.id === n.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                      <div className="text-sm font-semibold text-white truncate">{sanitizeForDisplay(n.title, 120)}</div>
                      <div className="text-xs text-white/50">{formatDate(n.time)}</div>
                    </button>
                  </li>
                ))}
              </ul>
              {notifications.length === 0 && (
                <div className="mt-3 text-sm text-white/60">No notifications yet!</div>
              )}
            </div>

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
                    <div className="rounded-lg p-4 bg-white/5 border border-white/10 text-white/90 whitespace-pre-wrap break-words">
                      {sanitizeFullTextPreserve(selectedNotif.body)}
                    </div>
                  </article>
                </div>
              ) : (
                <div className="text-white/60">Select a notification to read</div>
              )}
            </div>
            <div className="w-12 p-3 flex flex-col items-center justify-start border-l border-white/10" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout themeColor="#60a5fa" showAuthButtons={false} disableSideMenu>
      <div className="min-h-screen h-screen flex flex-col bg-black">
        <main className="flex-1 overflow-y-auto pt-24 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              <main className="flex-1">
              {/* Greeting card - Dynamic Island style */}
              <div className="greeting-card rounded-2xl bg-black/80 backdrop-blur-xl p-6 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md">{greeting}</h1>
                    <div className="mt-1 text-sm text-white/70">UTC time: <span className="font-medium text-white">{utcNow}</span></div>
                  </div>
                </div>

                {/* Quick stats - matching glass cards */}
                <div className="quick-stats mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/20 shadow-lg backdrop-blur-sm">
                    <div className="text-xs text-white/60">Active projects</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{projects.length}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/20 shadow-lg backdrop-blur-sm">
                    <div className="text-xs text-white/60">Notifications</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{notifications.length}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/20 shadow-lg backdrop-blur-sm flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/60 flex items-center gap-1">
                        <HardDrive className="w-3 h-3" /> Storage
                      </div>
                      <div className="mt-2 text-xl font-semibold text-white">
                        {formatStorageUsed()} / {formatStorageLimit()}
                      </div>
                    </div>
                    <button
                      onClick={handleExtendStorage}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="Extend storage"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main content: Projects & Activity */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="projects-section lg:col-span-2 space-y-6">
                  <div className="p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <h2 className="text-lg font-semibold text-white">Projects</h2>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setNewName(''); setNewDesc(''); setCreating(false); }} className="px-3 py-2 bg-white/10 rounded-md text-white hover:bg-white/20 transition-colors">Refresh</button>
                        <div className="inline-flex rounded-md bg-white/5 p-1">
                          <button onClick={() => setProjectFolder('all')} className={`px-3 py-1 rounded text-sm ${projectFolder === 'all' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'}`}>All</button>
                          <button onClick={() => setProjectFolder('solo')} className={`px-3 py-1 rounded text-sm ${projectFolder === 'solo' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'}`}>Solo</button>
                          <button onClick={() => setProjectFolder('team')} className={`px-3 py-1 rounded text-sm ${projectFolder === 'team' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'}`}>Team</button>
                        </div>
                        <button onClick={() => setCreating((c) => !c)} className="new-project-btn px-3 py-2 bg-white/20 hover:bg-white/30 rounded-md text-white shadow-md transition-colors">New Project</button>
                      </div>
                    </div>

                    {creating && (
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
                        {error && <div className="text-sm text-red-300 mb-2">{error}</div>}
                        <label className="block text-xs text-white/60 mb-1">Name</label>
                        <input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/20" />
                        <label className="block text-xs text-white/60 mt-3 mb-1">Description</label>
                        <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/20" />
                        <div className="mt-3 flex justify-end gap-3">
                          <button onClick={() => setCreating(false)} className="px-3 py-2 bg-white/10 rounded text-white hover:bg-white/20">Cancel</button>
                          <button onClick={handleCreateProject} className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded text-white">Create</button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {filteredProjects.map((p) => (
                        <article key={p.id} className="p-4 rounded-xl bg-white/5 border border-white/20 flex items-start justify-between">
                          <div>
                            <time className="text-xs text-white/60">{new Date(p.createdAt).toLocaleString()}</time>
                            <h3 className="mt-1 text-lg font-medium text-white">{sanitizeForDisplay(p.name)}</h3>
                            {p.description && <p className="mt-1 text-sm text-white/60">{sanitizeForDisplay(p.description)}</p>}
                            <div className="mt-2 text-xs text-white/50">{p.owner === 'solo' ? 'Solo' : 'Team'}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-2 bg-white/10 rounded text-white/80 hover:bg-white/20 transition-colors">Open</button>
                            <button className="px-3 py-2 bg-red-500/20 rounded text-white/80 hover:bg-red-500/30 transition-colors">Delete</button>
                          </div>
                        </article>
                      ))}
                      {filteredProjects.length === 0 && <div className="text-white/60">No projects in this folder.</div>}
                    </div>
                  </div>
                </section>

                <aside className="space-y-6">
                  <div className="notifications-panel p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl">
                    <h3 className="text-sm text-white/60">Notifications</h3>
                    <div role="region" aria-label="Notifications" className="mt-3 space-y-3 max-h-56 overflow-auto pr-2">
                      {notifLoading && <div className="text-sm text-white/60">Loading...</div>}
                      {notifError && <div className="text-sm text-red-400">{notifError}</div>}
                      {!notifLoading && notifications.length === 0 && <div className="text-sm text-white/60">No notifications yet!</div>}
                      {notifications.map((n) => (
                        <div key={n.id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
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
                              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                              <Eye className="w-4 h-4 text-white/90" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button onClick={() => fetchNotifications()} className="px-3 py-2 text-xs bg-white/10 rounded text-white hover:bg-white/20 transition-colors">Refresh notifications</button>
                    </div>
                  </div>

                  <div className="quick-actions p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl">
                    <h3 className="text-sm text-white/60">Quick Actions</h3>
                    <div className="mt-3 flex flex-col gap-2">
                      <button className="px-3 py-2 bg-white/10 rounded text-white hover:bg-white/20 transition-colors">Invite teammate</button>
                      <button className="px-3 py-2 bg-white/10 rounded text-white hover:bg-white/20 transition-colors">Upload file</button>
                    </div>
                  </div>
                </aside>
              </div>
            </main>

            {/* Right column summary */}
            <aside className="w-full lg:w-80">
              <div className="account-card p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="text-sm text-white/60">Account</div>
                <div className="text-white mt-1 font-semibold">{sanitizeName(displayName, 'User')}</div>
                <div className="text-xs text-white/60">{sanitizeForDisplay(email)}</div>
                <div className="mt-4 flex flex-col gap-2">
                  <button onClick={handleSettings} className="w-full px-3 py-2 bg-white/10 rounded text-white hover:bg-white/20 transition-colors">Settings</button>
                  <button onClick={handleLogout} className="w-full px-3 py-2 bg-red-500/20 rounded text-white hover:bg-red-500/30 transition-colors">Log out</button>
                </div>
              </div>

              <div className="storage-card mt-4 p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="text-sm text-white/60">Storage usage</div>
                <div className="mt-2 text-lg text-white font-semibold">{usedPercentage.toFixed(0)}% used</div>
                <div className="w-full bg-white/10 h-2 rounded mt-2 overflow-hidden">
                  <div className={`h-2 rounded transition-all duration-300 ${barColorClass}`} style={{ width: `${Math.min(usedPercentage, 100)}%` }} />
                </div>
                <div className="mt-2 text-xs text-white/50 flex justify-between">
                  <span>{formatStorageUsed()}</span>
                  <span>of {formatStorageLimit()}</span>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl">
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

        </main>

        <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <NotificationModal />

        {/* Floating Help Button to start the tour */}
        <button
          onClick={() => setRunTour(true)}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black text-white shadow-2xl hover:bg-black/25 transition-all duration-200"
          aria-label="Start onboarding tour"
        >
          <HelpCircle className="w-6 h-6" />
        </button>

        {/* Joyride Tour with custom dark tooltip */}
        <JoyrideWithCallback
          steps={tourSteps}
          run={runTour}
          continuous={true}
          tooltipComponent={CustomTooltip}
          callback={handleJoyrideCallback}
          styles={{
            options: {
              zIndex: 10000,
              arrowColor: 'rgba(255, 255, 255, 0.85)',
              backgroundColor: 'rgba(0,0,0,0.85)',
              textColor: '#fff',
              primaryColor: '#ffffff',
            },
            beaconInner: { backgroundColor: '#ffffff' },
            beaconOuter: { boxShadow: '0 0 0 6px #ffffff7e' },
            overlay: { backgroundColor: 'rgba(0,0,0,0.6)' },
            beacon: { inner: { backgroundColor: '#ffffff' }, outer: { boxShadow: '0 0 0 6px rgba(255,255,255,0.06)' } },
          }}
        />
      </div>
    </Layout>
  );
}
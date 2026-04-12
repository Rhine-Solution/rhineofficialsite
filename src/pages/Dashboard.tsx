import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import SettingsModal from '../components/SettingsModal';
import TeamSettingsModal from '../components/TeamSettingsModal';
import { Eye, X, HardDrive, Plus, HelpCircle, Edit2, Copy, Clock, TrendingUp, Search, Folder, User } from 'lucide-react';
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
  status: 'active' | 'in_progress' | 'completed';
  lastUpdated?: string;
  members?: { name: string; avatar?: string }[];
};

type NotificationItem = {
  id: string;
  title: string;
  body?: string;
  hero_url?: string | null;
  time: string; // ISO
};

// Security helpers
const ALLOWED_NAME_RE = /^[\w \-._'@*!:]{3,80}$/;
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
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [teamSettingsOpen, setTeamSettingsOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
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
  const [projectSearch, setProjectSearch] = useState('');
  const [projectSort, setProjectSort] = useState<'newest' | 'name' | 'updated'>('newest');

  const [storageUsedMB, setStorageUsedMB] = useState(512);
  const [storageLimitMB, setStorageLimitMB] = useState(1024);

  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);

  // Delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Invites (requests) for current user
  const [invites, setInvites] = useState<any[]>([]);
  const [invitesLoading, setInvitesLoading] = useState(false);
  const [invitesError, setInvitesError] = useState<string | null>(null);

  // Team members shown in Dashboard (if current user belongs to a team)
  type TeamMember = { id: string; user_id: string; email: string | null; display_name: string | null; role: string; permissions: { read: boolean; write: boolean; delete: boolean } };
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamMembersLoading, setTeamMembersLoading] = useState(false);
  const [teamMembersError, setTeamMembersError] = useState<string | null>(null);

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
          setCurrentUserId(data.user.id ?? null);
        }

        if (mounted) {
          setProjects([
            { id: 'p1', name: 'Website Redesign', description: 'Landing + dashboard refresh', createdAt: new Date().toISOString(), owner: 'solo', status: 'active', lastUpdated: new Date().toISOString(), members: [{ name: 'You' }] },
            { id: 'p2', name: 'WebGPU Prototype', description: 'Realtime GPU particles', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), owner: 'team', status: 'in_progress', lastUpdated: new Date(Date.now() - 3600000).toISOString(), members: [{ name: 'You' }, { name: 'Alex' }, { name: 'Sarah' }] },
            { id: 'p3', name: 'Internal Tools', description: 'Admin dashboards', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), owner: 'team', status: 'completed', lastUpdated: new Date(Date.now() - 86400000).toISOString(), members: [{ name: 'You' }, { name: 'Mike' }] },
          ]);
          setProjectsLoading(false);
        }

        await fetchNotifications();
        await fetchInvites();
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

  // Fetch pending invites for current user (invited_email or invited_user_id)
  const fetchInvites = async () => {
    setInvitesLoading(true);
    setInvitesError(null);
    try {
      const userRes = await supabase.auth.getUser();
      const userId = userRes.data?.user?.id ?? null;
      const userEmail = userRes.data?.user?.email ?? null;
      if (!userId && !userEmail) return setInvites([]);

      // Use parameterized supabase query - check invited_user_id or invited_email
      const { data, error } = await supabase
        .from('team_invites')
        .select('id, team_id, invited_by, invited_user_id, invited_email, permissions, role, status, created_at')
        .or(`invited_user_id.eq.${userId},invited_email.eq.${userEmail}`)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setInvites(data ?? []);
    } catch (err: any) {
      console.error('fetchInvites failed', err?.message || err);
      setInvitesError('Failed to load invites');
      setInvites([]);
    } finally {
      setInvitesLoading(false);
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

  const handleAccountSettings = () => setAccountSettingsOpen(true);
  const handleTeamSettings = () => setTeamSettingsOpen(true);

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
        status: 'active',
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
    showToast(`Storage limit increased to ${(storageLimitMB + 1024) / 1024} GB`, 'success');
  };

  const handleOpenProject = (project: Project) => {
    showToast(`Opening project: ${project.name}`, 'info');
  };

  const handleDeleteProjectClick = (project: Project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setDeletingProject(true);
    try {
      // Remove from local state (in real app, would delete from Supabase)
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (err) {
      console.error('deleteProject error', err);
      setError('Failed to delete project');
    } finally {
      setDeletingProject(false);
    }
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
        <span className="text-white/60 text-sm font-mono">Loading dashboard...</span>
      </div>
    </div>
  );

  const safeDisplay = sanitizeName(displayName, null);
  const greeting = getGreeting(safeDisplay ?? (email ? email.split('@')[0] : 'there'));
  const utcNow = new Date().toUTCString();

  const filteredProjects = projects
    .filter((p) => (projectFolder === 'all' ? true : p.owner === projectFolder))
    .filter((p) => projectSearch === '' || p.name.toLowerCase().includes(projectSearch.toLowerCase()))
    .sort((a, b) => {
      if (projectSort === 'name') return a.name.localeCompare(b.name);
      if (projectSort === 'updated') return new Date(b.lastUpdated || b.createdAt).getTime() - new Date(a.lastUpdated || a.createdAt).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const usedPercentage = (storageUsedMB / storageLimitMB) * 100;
  let barColorClass = 'bg-green-500';
  if (usedPercentage >= 75) barColorClass = 'bg-red-500';
  else if (usedPercentage >= 50) barColorClass = 'bg-orange-500';

  const formatStorage = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb} MB`;
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

  const dashboardContent = (
    <>
      <div className="flex-1 overflow-y-auto pt-24 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {/* Dashboard Header with Title */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                  <p className="text-sm text-white/60">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              {/* Greeting card - Dynamic Island style */}
              <div className="greeting-card rounded-2xl bg-black/80 backdrop-blur-xl p-6 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md">{greeting}</h2>
                    <div className="mt-1 text-sm text-white/70">UTC time: <span className="font-medium text-white">{utcNow}</span></div>
                  </div>
                </div>

                {/* Quick stats - matching glass cards with trends */}
                <div className="quick-stats mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/20 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-white/60">Active Projects</div>
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-white">{projects.filter(p => p.status !== 'completed').length}</div>
                    <div className="text-xs text-green-400 mt-1">+2 this month</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/20 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-white/60">Notifications</div>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">{notifications.length} new</span>
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-white">{notifications.length}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/20 shadow-lg backdrop-blur-sm flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/60 flex items-center gap-1">
                        <HardDrive className="w-3 h-3" /> Storage
                      </div>
                      <div className="mt-2 text-xl font-semibold text-white">{formatStorage(storageUsedMB)}</div>
                      <div className="text-xs text-white/50 mt-1">of {formatStorage(storageLimitMB)}</div>
                    </div>
                    <button onClick={handleExtendStorage} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Extend storage">
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main content: Projects & Activity */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="projects-section lg:col-span-2 space-y-6">
                  <div className="p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                      <h2 className="text-lg font-semibold text-white">Projects</h2>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative w-full sm:w-auto">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 w-full sm:w-40" />
                        </div>
                        <select value={projectSort} onChange={(e) => setProjectSort(e.target.value as 'newest' | 'name' | 'updated')} className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none">
                          <option value="newest">Newest</option>
                          <option value="name">Name</option>
                          <option value="updated">Updated</option>
                        </select>
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
                          <button onClick={() => setCreating(false)} disabled={creating} className="px-3 py-2 bg-white/10 rounded text-white hover:bg-white/20 disabled:opacity-50">Cancel</button>
                          <button onClick={handleCreateProject} disabled={creating} className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded text-white disabled:opacity-50 flex items-center gap-2">
                            {creating && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                            Create
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {projectsLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/20 animate-pulse">
                              <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
                              <div className="h-3 bg-white/10 rounded w-2/3"></div>
                            </div>
                          ))}
                        </div>
                      ) : filteredProjects.length > 0 ? (
                        filteredProjects.map((p) => (
                          <article key={p.id} className="p-4 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 transition-all group">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                <Folder className="w-6 h-6 text-white/60" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="text-lg font-medium text-white truncate">{sanitizeForDisplay(p.name)}</h3>
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${p.status === 'active' ? 'bg-green-500/20 text-green-400' : p.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                    {p.status === 'active' ? 'Active' : p.status === 'in_progress' ? 'In Progress' : 'Completed'}
                                  </span>
                                </div>
                                {p.description && <p className="mt-1 text-sm text-white/60 truncate">{sanitizeForDisplay(p.description)}</p>}
                                <div className="mt-2 flex items-center gap-4 text-xs text-white/50">
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.lastUpdated ? `Updated ${new Date(p.lastUpdated).toLocaleDateString()}` : new Date(p.createdAt).toLocaleDateString()}</span>
                                  <span>{p.owner === 'solo' ? 'Solo' : 'Team'}</span>
                                  {p.members && p.members.length > 0 && (
                                    <div className="flex -space-x-2">
                                      {p.members.slice(0, 3).map((m, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-white/20 border-2 border-black/40 flex items-center justify-center" title={m.name}><User className="w-3 h-3 text-white/70" /></div>
                                      ))}
                                      {p.members.length > 3 && <div className="w-6 h-6 rounded-full bg-white/10 border-2 border-black/40 flex items-center justify-center"><span className="text-[10px] text-white/50">+{p.members.length - 3}</span></div>}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenProject(p)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Open"><Eye className="w-4 h-4 text-white/70" /></button>
                                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Edit"><Edit2 className="w-4 h-4 text-white/70" /></button>
                                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Duplicate"><Copy className="w-4 h-4 text-white/70" /></button>
                                <button onClick={() => handleDeleteProjectClick(p)} className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors" title="Delete"><X className="w-4 h-4 text-white/70" /></button>
                              </div>
                            </div>
                          </article>
                        ))
                      ) : (
                        <div className="text-center py-12 px-4">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                          </div>
                          <div className="text-white/60 mb-4">No projects in this folder</div>
                          <button onClick={() => setCreating(true)} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 transition-all border border-white/10">Create your first project</button>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <aside className="space-y-6">
                  <div className="notifications-panel p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl">
                    <h3 className="text-sm text-white/60">Notifications</h3>
                    <div role="region" aria-label="Notifications" className="mt-3 space-y-3 max-h-56 overflow-auto pr-2">
                      {notifLoading && (
                        <div className="flex items-center justify-center py-4">
                          <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                        </div>
                      )}
                      {notifError && <div className="text-sm text-red-400">{notifError}</div>}
                      {!notifLoading && notifications.length === 0 && (
                        <div className="text-center py-6">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                          </div>
                          <div className="text-sm text-white/60">No notifications yet</div>
                        </div>
                      )}
                      {notifications.map((n) => (
                        <div key={n.id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-white truncate max-w-[12rem]">{sanitizeForDisplay(n.title, 120)}</div>
                            <div className="text-xs text-white/50">{formatDate(n.time)}</div>
                          </div>
                          <button aria-label={`Read ${sanitizeForDisplay(n.title)}`} onClick={() => { setSelectedNotif(n); setNotifModalOpen(true); }} className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                            <Eye className="w-4 h-4 text-white/90" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button onClick={() => fetchNotifications()} className="px-3 py-2 text-xs bg-white/10 rounded text-white hover:bg-white/20 transition-colors">Refresh</button>
                    </div>
                  </div>
                </aside>
              </div>
            </div>

            <aside className="w-full lg:w-80">
              <div className="account-card p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="text-sm text-white/60">Account</div>
                <div className="text-white mt-1 font-semibold">{sanitizeName(displayName, 'User')}</div>
                <div className="text-xs text-white/60">{sanitizeForDisplay(email)}</div>
                <div className="mt-4 flex flex-col gap-2">
                  <button onClick={handleAccountSettings} className="w-full px-3 py-2 bg-white/10 rounded text-white hover:bg-white/20 transition-colors">Settings</button>
                  <button onClick={handleLogout} className="w-full px-3 py-2 bg-red-500/20 rounded text-white hover:bg-red-500/30 transition-colors">Log out</button>
                </div>
              </div>

              <div className="storage-card mt-4 p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="text-sm text-white/60">Storage usage</div>
                <div className="mt-2 text-lg text-white font-semibold">{usedPercentage.toFixed(0)}% used</div>
                <div className="w-full bg-white/10 h-2 rounded mt-2 overflow-hidden">
                  <div className={`h-2 rounded transition-all duration-300 ${barColorClass}`} style={{ width: `${Math.min(usedPercentage, 100)}%` }} />
                </div>
                <div className="mt-2 text-xs text-white/50 flex justify-between"><span>{formatStorage(storageUsedMB)}</span><span>of {formatStorage(storageLimitMB)}</span></div>
              </div>

              <div className="requests-panel mt-4 p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl">
                <h3 className="text-sm text-white/60">Team Requests</h3>
                <div className="mt-3 space-y-3 max-h-56 overflow-auto pr-2">
                  {invitesLoading && (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                    </div>
                  )}
                  {invitesError && <div className="text-sm text-red-400">{invitesError}</div>}
                  {!invitesLoading && invites.length === 0 && <div className="text-sm text-white/60">No pending invites</div>}
                  {invites.map((invite) => (
                    <div key={invite.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-sm text-white">{invite.email}</div>
                      <div className="text-xs text-white/50">{invite.role || 'Member'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {teamMembers.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl">
                  <h3 className="text-sm text-white/60">Team Members</h3>
                  <div className="mt-3 space-y-2">
                    {teamMembers.map((m) => (
                      <div key={m.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-medium">{m.display_name?.[0] || m.email?.[0] || '?'}</div>
                          <div>
                            <div className="text-sm text-white">{sanitizeName(m.display_name, m.email?.split('@')[0] || 'User')}</div>
                            <div className="text-xs text-white/50">{m.role}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-xs text-white/80 flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded ${m.permissions.read ? 'bg-green-600/30 text-green-200' : 'bg-white/5 text-white/60'}`}>Read</span>
                            <span className={`px-2 py-0.5 rounded ${m.permissions.write ? 'bg-green-600/30 text-green-200' : 'bg-white/5 text-white/60'}`}>Write</span>
                            <span className={`px-2 py-0.5 rounded ${m.permissions.delete ? 'bg-red-600/30 text-red-200' : 'bg-white/5 text-white/60'}`}>Delete</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={handleTeamSettings} className="mt-4 w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 transition-colors text-sm">Manage Team</button>
            </aside>
          </div>
        </div>
      </div>

      <SettingsModal isOpen={accountSettingsOpen} onClose={() => setAccountSettingsOpen(false)} />
      <TeamSettingsModal isOpen={teamSettingsOpen} onClose={() => setTeamSettingsOpen(false)} />
      <NotificationModal />

      <button onClick={() => setRunTour(true)} className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black text-white shadow-2xl hover:bg-black/25 transition-all duration-200" aria-label="Start onboarding tour">
        <HelpCircle className="w-6 h-6" />
      </button>

      <JoyrideWithCallback steps={tourSteps} run={runTour} continuous tooltipComponent={CustomTooltip} callback={handleJoyrideCallback} options={{ zIndex: 10000, arrowColor: 'rgba(255, 255, 255, 0.85)' }} styles={{ beaconInner: { backgroundColor: '#ffffff' }, beaconOuter: { boxShadow: '0 0 0 6px #ffffff7e' }, overlay: { backgroundColor: 'rgba(0,0,0,0.6)' } }} />

      {deleteModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => !deletingProject && setDeleteModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
            <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Delete Project?</h3>
              </div>
              <p className="text-white/70 mb-6">Are you sure you want to delete <strong className="text-white">{projectToDelete?.name}</strong>? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteModalOpen(false)} disabled={deletingProject} className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors disabled:opacity-50">Cancel</button>
                <button onClick={handleConfirmDelete} disabled={deletingProject} className="px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {deletingProject && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <Layout themeColor="#60a5fa" showAuthButtons={false} disableSideMenu>
      {dashboardContent}
      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2">
          <div className={`px-4 py-3 rounded-lg shadow-lg backdrop-blur-xl border ${
            toast.type === 'success' ? 'bg-green-900/90 border-green-500/50 text-green-100' :
            toast.type === 'error' ? 'bg-red-900/90 border-red-500/50 text-red-100' :
            'bg-black/90 border-white/20 text-white'
          }`}>
            {toast.message}
          </div>
        </div>
      )}
    </Layout>
  );
}
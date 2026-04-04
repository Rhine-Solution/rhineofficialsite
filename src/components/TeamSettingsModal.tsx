import React, { useEffect, useState } from 'react';
import { X, Settings as SettingsIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

type PermissionSet = {
  read: boolean;
  write: boolean;
  delete: boolean;
};

type MemberRow = {
  id: string; // team_members.id
  team_id: string;
  user_id: string;
  email: string | null;
  display_name: string | null;
  role: 'owner' | 'member' | string;
  permissions: PermissionSet | null;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

// Helper: ensure permissions shape
function normalizePermissions(p: any): PermissionSet {
  if (!p || typeof p !== 'object') return { read: false, write: false, delete: false };
  return {
    read: Boolean(p.read),
    write: Boolean(p.write),
    delete: Boolean(p.delete),
  };
}

export default function TeamSettingsModal({ isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Invite form state (embedded in this modal)
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteIdentifier, setInviteIdentifier] = useState('');
  const [inviteRole, setInviteRole] = useState<'member' | 'owner'>('member');
  const [invitePerms, setInvitePerms] = useState<PermissionSet>({ read: true, write: false, delete: false });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Get current user
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        const user = userData?.user;
        if (!user) throw new Error('Not authenticated');

        // Find a team the user belongs to (prefer owner). This is defensive: client should be given team context from server ideally.
        const { data: ownerRows, error: ownerErr } = await supabase
          .from('team_members')
          .select('team_id')
          .eq('user_id', user.id)
          .eq('role', 'owner')
          .limit(1);
        if (ownerErr) throw ownerErr;

        let tId: string | null = null;
        if (ownerRows && ownerRows.length > 0) tId = ownerRows[0].team_id;

        if (!tId) {
          // fallback: any team the user is a member of
          const { data: anyRows, error: anyErr } = await supabase
            .from('team_members')
            .select('team_id')
            .eq('user_id', user.id)
            .limit(1);
          if (anyErr) throw anyErr;
          if (anyRows && anyRows.length > 0) tId = anyRows[0].team_id;
        }

        if (!tId) {
          // If no team context is found, do NOT create a team automatically.
          // Creating teams from the client can violate RLS and security policies.
          setTeamId(null);
          setMembers([]);
          setError('No team found for the current user. Please create a team first (server-side or via the admin UI).');
          return;
        }

        setTeamId(tId);

        // Load members for the team and mark current user as owner if applicable
        // Load members for the team and mark current user as owner if applicable
        const { data: memberData, error: memberErr } = await supabase
          .from('team_members')
          .select('id, team_id, user_id, email, display_name, role, permissions')
          .eq('team_id', tId)
          .order('created_at', { ascending: true });
        if (memberErr) {
          console.error('failed to load team members', memberErr.message || memberErr);
          setMembers([]);
        } else {
          const currentUserId = user.id;

          const mapped: MemberRow[] = (memberData || []).map((r: any) => ({
            id: String(r.id),
            team_id: String(r.team_id),
            user_id: String(r.user_id),
            email: r.email ?? null,
            display_name: r.display_name ?? null,
            role: r.user_id === currentUserId ? 'owner' : (r.role ?? 'member'),
            permissions: normalizePermissions(r.permissions),
          }));

          // Sort: owner first, then role, then display_name
          mapped.sort((a, b) => {
            if (a.role === 'owner' && b.role !== 'owner') return -1;
            if (b.role === 'owner' && a.role !== 'owner') return 1;
            if (a.role === b.role) return (a.display_name || a.email || a.user_id).localeCompare(b.display_name || b.email || b.user_id);
            return a.role.localeCompare(b.role);
          });

          if (mounted) setMembers(mapped);
        }

      } catch (err: any) {
        console.error('TeamSettingsModal init error', err?.message || err);
        if (mounted) setError(String(err?.message || err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  const handleToggle = (memberId: string, key: keyof PermissionSet) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        // prevent changing owner's permissions
        if (m.role === 'owner') return m;
        const perms = normalizePermissions(m.permissions);
        perms[key] = !perms[key];
        return { ...m, permissions: perms };
      })
    );
  };

  const handleSaveMember = async (member: MemberRow) => {
    setError(null);
    try {
      // Validate member id and team
      if (!member.id || !member.team_id) throw new Error('Invalid member data');
      // Ensure owner always has all permissions server-side; client cannot change owners.
      const toSave = member.role === 'owner' ? { permissions: { read: true, write: true, delete: true } } : { permissions: normalizePermissions(member.permissions) };

      const { error: updateErr } = await supabase
        .from('team_members')
        .update({ permissions: toSave.permissions })
        .eq('id', member.id)
        .select();

      if (updateErr) throw updateErr;

      // Optionally re-fetch or optimistic update already applied
      setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, permissions: toSave.permissions } : m)));
    } catch (err: any) {
      console.error('save member error', err?.message || err);
      setError(String(err?.message || err));
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setError(null);
    try {
      const member = members.find((m) => m.id === memberId);
      if (!member) throw new Error('Member not found');
      if (member.role === 'owner') throw new Error('Cannot remove owner from team via this UI');

      const { error: delErr } = await supabase.from('team_members').delete().eq('id', memberId);
      if (delErr) throw delErr;

      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err: any) {
      console.error('remove member error', err?.message || err);
      setError(String(err?.message || err));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-11/12 max-w-3xl max-h-[85vh] bg-black/90 rounded-2xl border border-white/20 overflow-auto p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-white/80" />
            <h3 className="text-lg text-white font-semibold">Team Settings</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-2 rounded bg-white/5 hover:bg-white/10">
              <X className="w-4 h-4 text-white/80" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm text-white/60">Requests</h4>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowInviteForm((s) => !s)} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-sm">Invite teammate</button>
          </div>
        </div>

        {showInviteForm && (
          <div className="p-3 mb-3 rounded bg-white/5 border border-white/10">
            {inviteError && <div className="text-sm text-red-400 mb-2">{inviteError}</div>}
            <label className="block text-xs text-white/60 mb-1">Email or Username</label>
            <input value={inviteIdentifier} onChange={(e) => setInviteIdentifier(e.target.value)} className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white mb-2" />

            <div className="flex items-center gap-2 mb-2 text-xs text-white/80">
              <label className="flex items-center gap-2"><input type="radio" name="inviteRole" value="member" checked={inviteRole === 'member'} onChange={() => setInviteRole('member')} /> <span>Member</span></label>
              <label className="flex items-center gap-2"><input type="radio" name="inviteRole" value="owner" checked={inviteRole === 'owner'} onChange={() => setInviteRole('owner')} /> <span>Owner</span></label>
            </div>

            <div className="flex items-center gap-3 mb-2 text-xs text-white/80">
              <label className="flex items-center gap-1"><input type="checkbox" checked={invitePerms.read} onChange={() => setInvitePerms((p) => ({ ...p, read: !p.read }))} /> <span>Read</span></label>
              <label className="flex items-center gap-1"><input type="checkbox" checked={invitePerms.write} onChange={() => setInvitePerms((p) => ({ ...p, write: !p.write }))} /> <span>Write</span></label>
              <label className="flex items-center gap-1"><input type="checkbox" checked={invitePerms.delete} onChange={() => setInvitePerms((p) => ({ ...p, delete: !p.delete }))} /> <span>Delete</span></label>
            </div>

            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 rounded bg-white/10 hover:bg-white/20" onClick={() => { setShowInviteForm(false); setInviteIdentifier(''); setInvitePerms({ read: true, write: false, delete: false }); setInviteError(null); }}>Cancel</button>
              <button className="px-3 py-1 rounded bg-white/20 hover:bg-white/30" onClick={async () => {
                setInviteError(null);
                const id = inviteIdentifier.trim();
                if (!id) return setInviteError('Provide email or username.');

                setInviteLoading(true);
                try {
                  // ensure we have a team context; try to create a personal team if none exists
                  let resolvedTeamId = teamId;
                  if (!resolvedTeamId) {
                    // create personal team and insert owner if possible
                    const userRes = await supabase.auth.getUser();
                    const user = userRes.data?.user;
                    if (!user) throw new Error('Not authenticated');
                    const safeTeamName = (user.user_metadata?.full_name || user.email || 'My Team').toString().slice(0, 80);

                    const { data: insertTeam, error: insertTeamErr } = await supabase
                      .from('teams')
                      .insert({ name: `${safeTeamName} (personal)`, created_by: user.id })
                      .select('id')
                      .limit(1)
                      .maybeSingle();

                    if (insertTeamErr) throw insertTeamErr;
                    resolvedTeamId = insertTeam?.id ?? null;

                    if (resolvedTeamId) {
                      const { error: memberInsertErr } = await supabase.from('team_members').insert({
                        team_id: resolvedTeamId,
                        user_id: user.id,
                        email: user.email,
                        display_name: user.user_metadata?.full_name ?? null,
                        role: 'owner',
                        permissions: { read: true, write: true, delete: true },
                      });
                      if (memberInsertErr) console.warn('failed to insert owner member', memberInsertErr.message || memberInsertErr);
                      // update local state
                      setTeamId(resolvedTeamId);
                    }
                  }

                  if (!resolvedTeamId) return setInviteError('Unable to determine or create team context. Create a team first.');

                  // resolve username -> user id/email if necessary
                  let invited_email: string | null = null;
                  let invited_user_id: string | null = null;
                  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)) invited_email = id.toLowerCase();
                  else {
                    const { data: profileData, error: profileErr } = await supabase.from('profiles').select('id, email').eq('username', id).limit(1).maybeSingle();
                    if (profileErr) console.warn('profile lookup failed', profileErr.message);
                    if (profileData && profileData.email) { invited_email = profileData.email; invited_user_id = profileData.id; }
                    else return setInviteError('Could not resolve username. Invite by email.');
                  }

                  // insert into team_invites (RLS prevents non-owners from inserting)
                  const { error: insErr } = await supabase.from('team_invites').insert({
                    team_id: resolvedTeamId,
                    invited_by: (await supabase.auth.getUser()).data?.user?.id,
                    invited_user_id,
                    invited_email,
                    invited_username: null,
                    permissions: invitePerms,
                    role: inviteRole,
                    status: 'pending',
                  });
                  if (insErr) throw insErr;

                  setShowInviteForm(false);
                  setInviteIdentifier('');
                } catch (err: any) {
                  console.error('invite error', err?.message || err);
                  setInviteError(String(err?.message || err));
                } finally {
                  setInviteLoading(false);
                }
              }}>Send invite</button>
            </div>
          </div>
        )}

        {loading && <div className="text-white/60">Loading members...</div>}
        {error && <div className="text-sm text-red-400 mb-2">{error}</div>}

        {!loading && members.length === 0 && <div className="text-white/60">No members found for this team.</div>}

        <ul className="space-y-3">
          {members.map((m) => (
            <li key={m.id} className="p-3 rounded bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-sm font-medium text-white truncate">{m.display_name ?? m.email ?? m.user_id}</div>
                <div className="text-xs text-white/60">{m.role === 'owner' ? 'Owner' : m.email}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={!!m.permissions?.read}
                      onChange={() => handleToggle(m.id, 'read')}
                      disabled={m.role === 'owner'}
                      aria-label={`Read permission for ${m.display_name ?? m.email}`}
                    />
                    <span className="select-none">Read</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={!!m.permissions?.write}
                      onChange={() => handleToggle(m.id, 'write')}
                      disabled={m.role === 'owner'}
                      aria-label={`Write permission for ${m.display_name ?? m.email}`}
                    />
                    <span className="select-none">Write</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={!!m.permissions?.delete}
                      onChange={() => handleToggle(m.id, 'delete')}
                      disabled={m.role === 'owner'}
                      aria-label={`Delete permission for ${m.display_name ?? m.email}`}
                    />
                    <span className="select-none">Delete</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleSaveMember(m)} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-sm">Save</button>
                  {m.role !== 'owner' && (
                    <button onClick={() => handleRemoveMember(m.id)} className="px-2 py-1 rounded bg-red-600/20 hover:bg-red-600/30 text-white text-sm">Remove</button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-white">Close</button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export default function InviteModal({ isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState(''); // username or email
  const [role, setRole] = useState<'member' | 'owner'>('member');
  const [perms, setPerms] = useState({ read: true, write: false, delete: false });
  const [error, setError] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    // find a team where current user is owner
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        const user = userData?.user;
        if (!user) throw new Error('Not authenticated');

        const { data: ownerRows, error: ownerErr } = await supabase
          .from('team_members')
          .select('team_id')
          .eq('user_id', user.id)
          .eq('role', 'owner')
          .limit(1);
        if (ownerErr) throw ownerErr;
        if (mounted) setTeamId(ownerRows && ownerRows.length > 0 ? ownerRows[0].team_id : null);
      } catch (err: any) {
        console.error('InviteModal init error', err?.message || err);
        if (mounted) setError(String(err?.message || err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isOpen]);

  const reset = () => {
    setIdentifier('');
    setPerms({ read: true, write: false, delete: false });
    setRole('member');
    setError(null);
  };

  const handleInvite = async () => {
    setError(null);
    if (!teamId) return setError('You are not an owner of any team.');
    const id = identifier.trim();
    if (!id) return setError('Please provide an email or username to invite.');

    setLoading(true);
    try {
      let invitedEmail: string | null = null;
      let invitedUsername: string | null = null;
      let invitedUserId: string | null = null;

      if (isValidEmail(id)) {
        invitedEmail = id.toLowerCase();
      } else {
        // Try resolving username to an email via profiles table (common Supabase pattern). If not found, require email.
        const { data: profileData, error: profileErr } = await supabase.from('profiles').select('id, username, email').eq('username', id).limit(1).maybeSingle();
        if (profileErr) {
          console.warn('profiles lookup failed', profileErr.message);
        }
        if (profileData && profileData.email) {
          invitedEmail = profileData.email;
          invitedUsername = profileData.username ?? null;
          invitedUserId = profileData.id ?? null;
        } else {
          return setError('Could not resolve username to a user. Please invite by email instead.');
        }
      }

      const payload: any = {
        team_id: teamId,
        invited_by: (await supabase.auth.getUser()).data?.user?.id,
        invited_email: invitedEmail,
        invited_username: invitedUsername,
        invited_user_id: invitedUserId,
        permissions: perms,
        role: role,
      };

      const { error: insertErr } = await supabase.from('team_invites').insert(payload);
      if (insertErr) throw insertErr;

      reset();
      onClose();
    } catch (err: any) {
      console.error('invite error', err?.message || err);
      setError(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-11/12 max-w-md bg-black/90 rounded-2xl border border-white/20 overflow-hidden p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg text-white font-semibold">Invite Teammate</h3>
          <button onClick={onClose} className="p-2 rounded bg-white/5 hover:bg-white/10"><X className="w-4 h-4 text-white/80" /></button>
        </div>

        {loading && <div className="text-white/60">Loading...</div>}
        {error && <div className="text-sm text-red-400 mb-2">{error}</div>}

        <label className="block text-xs text-white/60 mb-1">Email or Username</label>
        <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white mb-3" />

        <div className="flex items-center gap-3 mb-3 text-xs text-white/80">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={perms.read} onChange={() => setPerms((p) => ({ ...p, read: !p.read }))} />
            <span>Read</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={perms.write} onChange={() => setPerms((p) => ({ ...p, write: !p.write }))} />
            <span>Write</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={perms.delete} onChange={() => setPerms((p) => ({ ...p, delete: !p.delete }))} />
            <span>Delete</span>
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-white">Cancel</button>
          <button onClick={handleInvite} disabled={loading} className="px-3 py-2 rounded bg-white/20 hover:bg-white/30 text-white">Send Invite</button>
        </div>
      </div>
    </div>
  );
}

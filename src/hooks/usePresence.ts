import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface PresenceUser {
  user_id: string;
  user_name?: string;
  online_at: string;
}

export function usePresence(channelName: string = 'global') {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, PresenceUser>>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const channel = supabase.channel(channelName);

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users: Record<string, PresenceUser> = {};
        for (const [key, value] of Object.entries(state)) {
          if (value && value.length > 0) {
            const first = value[0] as unknown as PresenceUser;
            if (first.user_id) {
              users[key] = first;
            }
          }
        }
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          await channel.track({
            user_id: crypto.randomUUID(),
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [channelName]);

  const trackPresence = useCallback(async (userId: string, userName?: string) => {
    const channel = supabase.channel(channelName);
    await channel.track({
      user_id: userId,
      user_name: userName,
      online_at: new Date().toISOString(),
    });
  }, [channelName]);

  const untrackPresence = useCallback(async () => {
    const channel = supabase.channel(channelName);
    await channel.untrack();
  }, [channelName]);

  return {
    onlineUsers,
    isConnected,
    onlineCount: Object.keys(onlineUsers).length,
    trackPresence,
    untrackPresence,
  };
}

export default usePresence;

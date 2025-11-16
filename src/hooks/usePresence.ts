/**
 * User Presence Hook
 *
 * This hook tracks and displays online/offline status of users
 * using Supabase Realtime Presence.
 *
 * Usage:
 * ```tsx
 * const { isOnline, lastSeen } = usePresence(userId);
 * ```
 */

'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface PresencePayload {
  presence_ref: string;
  typing?: boolean;
  [key: string]: any;
}

export function usePresence(userId: string | null) {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!userId) {
      setIsOnline(false);
      setLastSeen(null);
      return;
    }

    let channel: RealtimeChannel;

    const fetchPresence = async () => {
      const { data, error } = await supabase
        .from('presence')
        .select('online, last_seen')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Failed to fetch presence:', error);
        return;
      }

      if (data) {
        setIsOnline(data.online || false);
        setLastSeen(data.last_seen ? new Date(data.last_seen) : null);
      }
    };

    const subscribeToPresence = () => {
      channel = supabase
        .channel(`presence:${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'presence',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const presence = payload.new as any;
            setIsOnline(presence.online || false);
            setLastSeen(presence.last_seen ? new Date(presence.last_seen) : null);
          }
        )
        .subscribe();
    };

    fetchPresence();
    subscribeToPresence();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId, supabase]);

  return { isOnline, lastSeen };
}

/**
 * Hook to track current user's presence and update it
 *
 * This hook automatically updates the current user's online status
 * and handles heartbeat updates.
 */
export function useMyPresence() {
  const supabase = createClientComponentClient();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const updatePresence = async (online: boolean) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('presence')
        .upsert({
          user_id: user.id,
          online,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
    };

    // Set online on mount
    updatePresence(true);

    // Heartbeat every 30 seconds
    intervalId = setInterval(() => {
      updatePresence(true);
    }, 30000);

    // Set offline on unmount
    return () => {
      clearInterval(intervalId);
      updatePresence(false);
    };
  }, [supabase]);
}

/**
 * Hook to track typing status in a conversation
 *
 * Usage:
 * ```tsx
 * const { isTyping, setTyping } = useTypingIndicator(conversationId);
 * ```
 */
export function useTypingIndicator(conversationId: string | null) {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!conversationId) {
      setTypingUsers(new Set());
      return;
    }

    let channel: RealtimeChannel;

    const subscribeToTyping = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase.channel(`typing:${conversationId}`, {
        config: {
          presence: {
            key: user.id,
          },
        },
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const typing = new Set<string>();

          Object.keys(state).forEach((userId) => {
            const presences = state[userId] as PresencePayload[];
            if (presences && presences.length > 0 && presences[0].typing) {
              typing.add(userId);
            }
          });

          setTypingUsers(typing);
        })
        .subscribe();
    };

    subscribeToTyping();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [conversationId, supabase]);

  const setTyping = async (isTyping: boolean) => {
    if (!conversationId) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const channel = supabase.channel(`typing:${conversationId}`);

    if (isTyping) {
      await channel.track({ typing: true });
    } else {
      await channel.untrack();
    }
  };

  return {
    typingUsers: Array.from(typingUsers),
    isTyping: typingUsers.size > 0,
    setTyping,
  };
}

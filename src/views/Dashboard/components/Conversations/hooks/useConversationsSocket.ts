import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';
import { supabase } from '@/config/supabase';
const CONVERSATIONS_KEY = ['dashboard-conversations'];
const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1000;
// Must be longer than the longest backoff step (BASE_BACKOFF_MS * 2^(MAX_RETRIES-1) = 4s)
const STABLE_DWELL_MS = 6000;
const RESYNC_JITTER_MS = 2000;

type ConversationSocketMessage = {
    type: 'new_conversation' | 'conversation_updated' | 'conversations_resync' | 'connected';
};

function buildWsUrl(token: string): string {
    const base = import.meta.env.VITE_BACKEND_BASE_URL as string;
    return `${base.replace(/^http/, 'ws')}/conversations/stream?token=${token}`;
}

export default function useConversationsSocket() {
    const queryClient = useQueryClient();
    const socketRef = useRef<WebSocket | null>(null);
    const retryCountRef = useRef(0);
    const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const stableTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const resyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasConnectedOnceRef = useRef(false);
    const unmountedRef = useRef(false);

    useEffect(() => {
        unmountedRef.current = false;

        const clearTimers = () => {
            if (retryTimerRef.current) {
                clearTimeout(retryTimerRef.current);
                retryTimerRef.current = null;
            }
            if (stableTimerRef.current) {
                clearTimeout(stableTimerRef.current);
                stableTimerRef.current = null;
            }
        };

        const closeSocket = () => {
            const ws = socketRef.current;
            if (ws) {
                ws.onopen = ws.onmessage = ws.onclose = ws.onerror = null;
                ws.close();
                socketRef.current = null;
            }
            clearTimers();
        };

        const scheduleReconnect = () => {
            if (unmountedRef.current || retryTimerRef.current) return;
            if (retryCountRef.current >= MAX_RETRIES) {
                Sentry.captureException(new Error('useConversationsSocket: max retries reached, giving up'));
                return;
            }
            const delay = BASE_BACKOFF_MS * Math.pow(2, retryCountRef.current);
            retryCountRef.current += 1;
            retryTimerRef.current = setTimeout(() => {
                retryTimerRef.current = null;
                connect();
            }, delay);
        };

        const connect = async () => {
            if (unmountedRef.current) return;
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (unmountedRef.current || !session?.access_token) return;

                closeSocket();

                const ws = new WebSocket(buildWsUrl(session.access_token));
                socketRef.current = ws;

                ws.onopen = () => {
                    // Defer reset so a server that accepts-then-drops can't loop forever at 1s.
                    stableTimerRef.current = setTimeout(() => {
                        stableTimerRef.current = null;
                        retryCountRef.current = 0;
                    }, STABLE_DWELL_MS);
                };

                ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data) as ConversationSocketMessage;
                        if (message.type === 'new_conversation' || message.type === 'conversation_updated') {
                            queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
                            return;
                        }

                        // The server went deaf to its pub/sub for a while and dropped events.
                        // This socket never closed, so a reconnect-based refetch would never
                        // have fired — the broadcast is the only signal that we are stale.
                        if (message.type === 'conversations_resync') {
                            if (resyncTimerRef.current) return;
                            resyncTimerRef.current = setTimeout(() => {
                                resyncTimerRef.current = null;
                                if (unmountedRef.current) return;
                                queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
                            }, Math.random() * RESYNC_JITTER_MS);
                            return;
                        }

                        // Covers a client that was itself offline. Skipped on the first
                        // connect, where the list query is already loading on its own.
                        if (message.type === 'connected') {
                            if (hasConnectedOnceRef.current) {
                                queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
                            }
                            hasConnectedOnceRef.current = true;
                        }
                    } catch (error) {
                        Sentry.captureException(error);
                    }
                };

                const onDisconnect = () => {
                    ws.onclose = null;
                    ws.onerror = null;
                    if (socketRef.current === ws) socketRef.current = null;
                    if (stableTimerRef.current) {
                        clearTimeout(stableTimerRef.current);
                        stableTimerRef.current = null;
                    }
                    scheduleReconnect();
                };
                ws.onclose = onDisconnect;
                ws.onerror = onDisconnect;
            } catch (error) {
                Sentry.captureException(error);
            }
        };

        // Revives after max-retries give-up; no-ops if a socket or pending retry already exists.
        const restart = () => {
            if (unmountedRef.current) return;
            if (socketRef.current || retryTimerRef.current) return;
            clearTimers();
            retryCountRef.current = 0;
            connect();
        };

        const onOnline = () => restart();
        const onVisibilityChange = () => { if (document.visibilityState === 'visible') restart(); };

        connect();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
                clearTimers();
                retryCountRef.current = 0;
                connect();
            } else if (event === 'SIGNED_OUT') {
                clearTimers();
                closeSocket();
            }
        });

        window.addEventListener('online', onOnline);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            unmountedRef.current = true;
            if (resyncTimerRef.current) {
                clearTimeout(resyncTimerRef.current);
                resyncTimerRef.current = null;
            }
            closeSocket();
            subscription.unsubscribe();
            window.removeEventListener('online', onOnline);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, []);
}

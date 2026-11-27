import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';
import { supabase } from '@/config/supabase';
import { CONVERSATIONS_QUERY_KEY } from '../../../queryKeys';
const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1000;
// Must be longer than the longest backoff step (BASE_BACKOFF_MS * 2^(MAX_RETRIES-1) = 4s)
const STABLE_DWELL_MS = 6000;
const RESYNC_JITTER_MS = 2000;
// After the fast retries run out, keep trying on a slow timer instead of waiting for a tab or
// network event (SAYSO-493).
export const SLOW_RETRY_MS = 60_000;
export const SLOW_RETRY_JITTER_MS = 10_000;
// Only report an outage that lasts this long, so short blips (deploys, laptop sleep) stay quiet.
export const REPORT_AFTER_DOWN_MS = 5 * 60_000;
// A browser fires `close` right after `error`; this is the fallback if it never comes.
const ERROR_CLOSE_GRACE_MS = 2000;
const MAX_DISCONNECT_LOG = 5;

type DisconnectRecord = {
    source: 'close' | 'error+close' | 'error';
    code: number | null;
    reason: string;
    wasClean: boolean | null;
    // null when the socket never opened
    openForMs: number | null;
    at: string;
};

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
    const errorGraceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Set while a socket has errored and we're waiting for its close; runs the disconnect now.
    const pendingErrorDisconnectRef = useRef<(() => void) | null>(null);
    const slowRetryPendingRef = useRef(false);
    // Start of the current outage: the first disconnect since the last stable connection.
    const downSinceRef = useRef<number | null>(null);
    const outageReportedRef = useRef(false);
    const disconnectLogRef = useRef<DisconnectRecord[]>([]);

    useEffect(() => {
        unmountedRef.current = false;

        const clearTimers = () => {
            if (retryTimerRef.current) {
                clearTimeout(retryTimerRef.current);
                retryTimerRef.current = null;
            }
            slowRetryPendingRef.current = false;
            if (stableTimerRef.current) {
                clearTimeout(stableTimerRef.current);
                stableTimerRef.current = null;
            }
            if (errorGraceTimerRef.current) {
                clearTimeout(errorGraceTimerRef.current);
                errorGraceTimerRef.current = null;
            }
            pendingErrorDisconnectRef.current = null;
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

        const recordDisconnect = (record: DisconnectRecord) => {
            const log = disconnectLogRef.current;
            log.push(record);
            if (log.length > MAX_DISCONNECT_LOG) log.shift();
            Sentry.addBreadcrumb({
                category: 'conversations-socket',
                message: 'disconnected',
                level: 'info',
                data: { ...record },
            });
        };

        const reportOutageIfLong = () => {
            if (outageReportedRef.current || downSinceRef.current === null) return;
            const downForMs = Date.now() - downSinceRef.current;
            if (downForMs < REPORT_AFTER_DOWN_MS) return;
            outageReportedRef.current = true;
            Sentry.captureException(new Error('useConversationsSocket: max retries reached, giving up'), {
                level: 'warning',
                extra: { downForMs, disconnects: [...disconnectLogRef.current] },
            });
        };

        const scheduleReconnect = () => {
            if (unmountedRef.current || retryTimerRef.current) return;
            if (downSinceRef.current === null) downSinceRef.current = Date.now();
            let delay: number;
            if (retryCountRef.current >= MAX_RETRIES) {
                reportOutageIfLong();
                delay = SLOW_RETRY_MS + Math.random() * SLOW_RETRY_JITTER_MS;
                slowRetryPendingRef.current = true;
            } else {
                delay = BASE_BACKOFF_MS * Math.pow(2, retryCountRef.current);
                retryCountRef.current += 1;
            }
            retryTimerRef.current = setTimeout(() => {
                retryTimerRef.current = null;
                slowRetryPendingRef.current = false;
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
                let openedAt: number | null = null;
                let errorSeen = false;

                ws.onopen = () => {
                    openedAt = Date.now();
                    // Defer reset so a server that accepts-then-drops can't loop forever at 1s.
                    stableTimerRef.current = setTimeout(() => {
                        stableTimerRef.current = null;
                        retryCountRef.current = 0;
                        downSinceRef.current = null;
                        outageReportedRef.current = false;
                    }, STABLE_DWELL_MS);
                };

                ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data) as ConversationSocketMessage;
                        if (message.type === 'new_conversation' || message.type === 'conversation_updated') {
                            queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
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
                                queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
                            }, Math.random() * RESYNC_JITTER_MS);
                            return;
                        }

                        // Covers a client that was itself offline. Skipped on the first
                        // connect, where the list query is already loading on its own.
                        if (message.type === 'connected') {
                            if (hasConnectedOnceRef.current) {
                                queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
                            }
                            hasConnectedOnceRef.current = true;
                        }
                    } catch (error) {
                        Sentry.captureException(error);
                    }
                };

                const onDisconnect = (event: CloseEvent | null) => {
                    ws.onclose = null;
                    ws.onerror = null;
                    if (errorGraceTimerRef.current) {
                        clearTimeout(errorGraceTimerRef.current);
                        errorGraceTimerRef.current = null;
                    }
                    pendingErrorDisconnectRef.current = null;
                    recordDisconnect({
                        source: event ? (errorSeen ? 'error+close' : 'close') : 'error',
                        code: event?.code ?? null,
                        reason: event?.reason ?? '',
                        wasClean: event?.wasClean ?? null,
                        openForMs: openedAt === null ? null : Date.now() - openedAt,
                        at: new Date().toISOString(),
                    });
                    if (socketRef.current === ws) socketRef.current = null;
                    if (stableTimerRef.current) {
                        clearTimeout(stableTimerRef.current);
                        stableTimerRef.current = null;
                    }
                    scheduleReconnect();
                };
                ws.onclose = (event) => onDisconnect(event);
                // Wait for the close that follows, so the breadcrumb gets its code and reason.
                ws.onerror = () => {
                    if (errorSeen) return;
                    errorSeen = true;
                    const disconnectNow = () => { if (ws.onclose) onDisconnect(null); };
                    pendingErrorDisconnectRef.current = disconnectNow;
                    errorGraceTimerRef.current = setTimeout(() => {
                        errorGraceTimerRef.current = null;
                        disconnectNow();
                    }, ERROR_CLOSE_GRACE_MS);
                };
            } catch (error) {
                Sentry.captureException(error);
            }
        };

        // Skips the slow-retry wait when the tab or network comes back; no-ops if a socket or a
        // fast retry is already in flight.
        const restart = () => {
            if (unmountedRef.current) return;
            // A socket that errored and is still waiting for its close is already dead: record the
            // disconnect now instead of letting the grace timer push us onto the slow retry.
            pendingErrorDisconnectRef.current?.();
            if (socketRef.current) return;
            if (retryTimerRef.current && !slowRetryPendingRef.current) return;
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

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';
import { supabase } from '@/config/supabase';
import type { ConversationItem } from '@/types/coach';

const CONVERSATIONS_KEY = ['dashboard-conversations'];
const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1000;

type NewConversationMessage = {
    type: 'new_conversation';
    payload: ConversationItem;
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
    const unmountedRef = useRef(false);

    useEffect(() => {
        unmountedRef.current = false;

        const closeSocket = () => {
            const ws = socketRef.current;
            if (ws) {
                ws.onopen = ws.onmessage = ws.onclose = ws.onerror = null;
                ws.close();
                socketRef.current = null;
            }
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

                ws.onopen = () => { retryCountRef.current = 0; };

                ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data) as NewConversationMessage;
                        if (message.type === 'new_conversation') {
                            queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
                        }
                    } catch (error) {
                        Sentry.captureException(error);
                    }
                };

                const onDisconnect = () => {
                    ws.onclose = null;
                    ws.onerror = null;
                    scheduleReconnect();
                };
                ws.onclose = onDisconnect;
                ws.onerror = onDisconnect;
            } catch (error) {
                Sentry.captureException(error);
            }
        };

        connect();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
                retryCountRef.current = 0;
                connect();
            } else if (event === 'SIGNED_OUT') {
                closeSocket();
            }
        });

        return () => {
            unmountedRef.current = true;
            if (retryTimerRef.current) {
                clearTimeout(retryTimerRef.current);
                retryTimerRef.current = null;
            }
            closeSocket();
            subscription.unsubscribe();
        };
    }, []);
}

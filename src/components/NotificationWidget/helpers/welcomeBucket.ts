import { CreatedNotification } from '@/types/notifications';

const WELCOME_DONE_KEY = 'nw_welcome_done_at';
const WELCOME_DELAY_MS = 24 * 60 * 60 * 1000; // 24 hours
const NEW_USER_THRESHOLD_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

export function isNewUser(createdAt: string): boolean {
    return Date.now() - new Date(createdAt).getTime() < NEW_USER_THRESHOLD_MS;
}

export function isInWelcomeDelay(): boolean {
    const ts = localStorage.getItem(WELCOME_DONE_KEY);
    if (!ts) return false;
    return Date.now() - parseInt(ts) < WELCOME_DELAY_MS;
}

export function markWelcomeDone(): void {
    if (!localStorage.getItem(WELCOME_DONE_KEY)) {
        localStorage.setItem(WELCOME_DONE_KEY, Date.now().toString());
    }
}

export function getVisibleNotifications(
    notifications: CreatedNotification[],
    userIsNew: boolean
): CreatedNotification[] {
    if (!userIsNew) return notifications;

    const welcome = notifications.filter(n => n.is_welcome);

    // New user with pending welcome notifications → show only those
    if (welcome.length > 0) return welcome;

    // No welcome notifications left — check if delay is still active
    const ts = localStorage.getItem(WELCOME_DONE_KEY);
    if (!ts) return notifications; // Welcome phase never happened, show everything

    const elapsed = Date.now() - parseInt(ts);
    if (elapsed >= WELCOME_DELAY_MS) return notifications; // 24h passed, show everything

    return []; // Still within 24h delay
}

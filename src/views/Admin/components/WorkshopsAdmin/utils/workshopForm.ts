import { AdminWorkshop, WorkshopEmail, WorkshopInput } from '../types';

export const TAKEAWAY_COUNT = 3;
// The room the weekly emails use by default. Prefilled so most workshops don't need to change it.
const DEFAULT_MEET_URL = 'https://meet.google.com/seq-mcae-pog';

export const WORKSHOP_EMAILS: { value: WorkshopEmail; label: string }[] = [
    { value: 'announce', label: 'Announcement' },
    { value: 'reminder_a', label: 'Reminder A' },
    { value: 'reminder_b', label: 'Reminder B' },
    { value: 'next_week', label: 'Next week' },
    { value: 'day_before', label: 'Day before' },
    { value: 'today', label: 'Live now' },
];

const pad = (value: number) => String(value).padStart(2, '0');

function secondThursday(year: number, monthIndex: number): string {
    const firstDay = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
    const firstThursday = 1 + ((4 - firstDay + 7) % 7);
    return `${year}-${pad(monthIndex + 1)}-${pad(firstThursday + 7)}`;
}

const dateKey = (day: Date) => `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`;

/** A workshop is past once its date is behind us; on the day itself it's still upcoming. */
export function isPastWorkshop(workshop: AdminWorkshop, today = new Date()): boolean {
    return workshop.date < dateKey(today);
}

/** Upcoming workshops first, soonest at the top, then past ones, most recent first. */
export function orderWorkshops(workshops: AdminWorkshop[], today = new Date()): AdminWorkshop[] {
    const upcoming = workshops.filter(workshop => !isPastWorkshop(workshop, today));
    const past = workshops.filter(workshop => isPastWorkshop(workshop, today));
    upcoming.sort((a, b) => a.date.localeCompare(b.date));
    past.sort((a, b) => b.date.localeCompare(a.date));
    return [...upcoming, ...past];
}

/** The next second Thursday that doesn't have a workshop yet. */
function nextOpenDate(existing: AdminWorkshop[], today = new Date()): string {
    const taken = new Set(existing.map(workshop => workshop.date));
    const todayKey = dateKey(today);
    for (let offset = 0; offset < 24; offset += 1) {
        const month = new Date(today.getFullYear(), today.getMonth() + offset, 1);
        const date = secondThursday(month.getFullYear(), month.getMonth());
        if (date >= todayKey && !taken.has(date)) return date;
    }
    return '';
}

export function emptyWorkshop(existing: AdminWorkshop[]): WorkshopInput {
    return {
        date: nextOpenDate(existing),
        title: '',
        hook: '',
        description: '',
        takeaways: Array(TAKEAWAY_COUNT).fill(''),
        host: '',
        imageUrl: '',
        meetUrl: DEFAULT_MEET_URL,
        status: 'draft',
    };
}

export function toFormValues(workshop: AdminWorkshop): WorkshopInput {
    const takeaways = [...workshop.takeaways];
    while (takeaways.length < TAKEAWAY_COUNT) takeaways.push('');
    return { ...workshop, takeaways };
}

const PLACEHOLDER = /<[^>]*>/;
const HTTPS_URL = /^https:\/\/\S+$/;

/** Same rule as the server's utils/workshopRules.js, which has the final say. */
export function missingForReady(input: WorkshopInput): string[] {
    const problems: string[] = [];
    const text: [string, string][] = [['Title', input.title], ['Hook', input.hook], ['Description', input.description]];
    for (const [label, value] of text) {
        if (!value.trim()) problems.push(`${label} is empty.`);
        else if (PLACEHOLDER.test(value)) problems.push(`${label} still has a <placeholder>.`);
    }
    if (input.takeaways.length !== TAKEAWAY_COUNT || input.takeaways.some(takeaway => !takeaway.trim())) {
        problems.push(`Add all ${TAKEAWAY_COUNT} takeaways.`);
    } else if (input.takeaways.some(takeaway => PLACEHOLDER.test(takeaway))) {
        problems.push('Takeaways still have a <placeholder>.');
    }
    if (!HTTPS_URL.test(input.meetUrl.trim())) problems.push('Meet link must start with https://.');
    if (input.imageUrl.trim() && !HTTPS_URL.test(input.imageUrl.trim())) problems.push('Image URL must start with https://.');
    return problems;
}

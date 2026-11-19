import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Publish dates are picked and shown in Central Time, whatever the admin's own time zone.
// The server stores UTC.
export const CENTRAL = 'America/Chicago';

/** "2026-11-20" + "09:00" in CT → UTC ISO string. */
export const centralToIso = (date: string, time: string): string =>
    dayjs.tz(`${date} ${time || '00:00'}`, 'YYYY-MM-DD HH:mm', CENTRAL).toISOString();

/** UTC ISO → the CT date and time the inputs hold. */
export const isoToCentral = (iso: string): { date: string; time: string } => {
    const local = dayjs(iso).tz(CENTRAL);
    return { date: local.format('YYYY-MM-DD'), time: local.format('HH:mm') };
};

/** e.g. "Nov 20, 2026, 9:00 AM CT" */
export const formatCentral = (iso: string): string => `${dayjs(iso).tz(CENTRAL).format('MMM D, YYYY, h:mm A')} CT`;

/** The CT date and time an hour from now, on the hour: the form's default. */
export const nextHourCentral = (now: Date = new Date()): { date: string; time: string } => {
    const next = dayjs(now).tz(CENTRAL).add(1, 'hour').startOf('hour');
    return { date: next.format('YYYY-MM-DD'), time: next.format('HH:mm') };
};

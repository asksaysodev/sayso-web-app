export type ReportFrequency = 'weekly' | 'monthly';

/** Editable fields, also the PUT body. weekday: 1..7, 1 = Monday. */
export interface ReportPreferencesInput {
    enabled: boolean;
    frequency: ReportFrequency;
    weekday: number;
}

export interface ReportPreferences extends ReportPreferencesInput {
    sendTime: { hour: number; timezone: string; label: string };
    /** Dates are YYYY-MM-DD. Null when nothing is scheduled. */
    nextSend: { date: string; periodStart: string; periodEnd: string } | null;
}

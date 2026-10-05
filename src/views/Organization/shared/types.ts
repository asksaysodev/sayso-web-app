/** Server-derived cap badge state; the client never recomputes it. */
export type TeamStatus = 'over' | 'approaching' | 'on_track' | 'no_cap';

/** Row shape of `GET /teams` — the teams row (snake) plus usage fields (camel). */
export interface TeamSummary {
    id: string;
    company_id: string;
    name: string;
    hour_cap: number | null;
    allow_exceed_cap: boolean;
    notify_at_percent: number | null;
    created_at: string;
    member_count: number;
    usedMinutes: number;
    usedHours: number;
    capHours: number | null;
    capPercent: number | null;
    status: TeamStatus;
}

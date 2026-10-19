import type { ReactNode } from 'react';
import type { UserRole } from '@/types/user';

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

export type AssignableRole = Extract<UserRole, 'admin' | 'user'>;

/** The member whose role `UpdateRoleModal` changes. */
export interface RoleTarget {
    id: string;
    email: string;
    role: UserRole;
}

/** How one row-menu action renders. */
export interface RowActionConfig {
    label: string;
    icon: ReactNode;
    destructive?: boolean;
}

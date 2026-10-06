import type { UserRole } from '@/types/user';
import type { TeamStatus, TeamSummary } from '@/views/Organization/shared/types';

export type TeamSortKey = 'name' | 'members' | 'hours' | 'status';

export interface CreateTeamInput {
    name: string;
    hourCap: number | null;
    accountIds: string[];
}

/** `POST /teams` member row (snake, like the server). */
export interface CreatedTeamMember {
    account_id: string;
    name: string | null;
    lastname: string | null;
    email: string;
    role: UserRole;
    joined_at: string;
}

/** A bare `teams` row (snake), as `POST /teams` and `PATCH /teams/:teamId` return it. */
export type TeamRow = Omit<TeamSummary, 'member_count' | 'usedMinutes' | 'usedHours' | 'capHours' | 'capPercent' | 'status'>;

export interface CreateTeamResponse {
    team: TeamRow;
    members: CreatedTeamMember[];
}

/** `GET /teams/:teamId` member row (camel, like the server). */
export interface TeamMember {
    accountId: string;
    name: string | null;
    lastname: string | null;
    email: string;
    role: UserRole;
    lastConversationAt: string | null;
}

/** `GET /teams/:teamId` — team settings plus current-month usage, and its members. */
export interface TeamDetail {
    team: {
        id: string;
        name: string;
        hourCap: number | null;
        allowExceedCap: boolean;
        notifyAtPercent: number | null;
        usedMinutes: number;
        usedHours: number;
        capHours: number | null;
        capPercent: number | null;
        status: TeamStatus;
        memberCount: number;
    };
    members: TeamMember[];
}

export type UpdateTeamInput = { teamId: string } & ({ name: string } | { hourCap: number | null });

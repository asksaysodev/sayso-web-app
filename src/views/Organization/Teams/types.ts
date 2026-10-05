import type { UserRole } from '@/types/user';
import type { TeamSummary } from '@/views/Organization/shared/types';

export type TeamSortKey = 'name' | 'members' | 'hours' | 'status';

export interface CreateTeamInput {
    name: string;
    hourCap: number | null;
    accountIds: string[];
}

/** `POST /teams` member row (snake, lie the server). */
export interface CreatedTeamMember {
    account_id: string;
    name: string | null;
    lastname: string | null;
    email: string;
    role: UserRole;
    joined_at: string;
}

export interface CreateTeamResponse {
    team: Omit<TeamSummary, 'member_count' | 'usedMinutes' | 'usedHours' | 'capHours' | 'capPercent' | 'status'>;
    members: CreatedTeamMember[];
}

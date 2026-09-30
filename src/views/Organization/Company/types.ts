import type { UserRole } from '@/types/user';

export type CompanyMemberStatus = 'active' | 'pending' | 'expired';

/** Row shape of `GET /company/members` — real members and open invites in one list. */
export interface CompanyMemberRow {
    id: string;
    name: string | null;
    lastname: string | null;
    email: string;
    role: UserRole;
    status: CompanyMemberStatus;
    isInvite: boolean;
    expires_at?: string;
    invited_by?: string;
    team_id?: string | null;
    team_name?: string | null;
}

export type AssignableRole = Extract<UserRole, 'admin' | 'user'>;

export interface Team {
    id: string;
    name: string;
}

export interface SkippedInvite {
    email: string;
    reason: string;
}

export interface SentInvite {
    id: string;
    email: string;
    status: string;
    expires_at: string;
    team_id: string | null;
}

export interface SendTeamInviteResponse {
    message: string;
    invites: SentInvite[];
    skipped: SkippedInvite[];
}

export interface CompanyViewer {
    id: string;
    role: UserRole | null;
}

export type MemberRowAction = 'updateRole' | 'resendInvite' | 'revokeInvite' | 'removeMember';

export type MemberSortKey = 'member' | 'email' | 'role' | 'status';

export interface StatusFilter {
    key: 'status';
    value: CompanyMemberStatus;
}

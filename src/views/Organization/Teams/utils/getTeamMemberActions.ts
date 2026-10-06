import type { UserRole } from '@/types/user';
import type { CompanyViewer } from '@/views/Organization/Company/types';
import type { TeamMember, TeamMemberAction } from '../types';

const PROTECTED_ROLES: readonly UserRole[] = ['owner', 'superadmin'];

/**
 * Row menu actions on a team member, in menu order.
 * - Own row: nothing.
 * - Update role: owner viewer only, never on an owner / superadmin target.
 * - Remove from team: anyone else (it only unlinks the team; the account stays).
 */
export default function getTeamMemberActions(member: TeamMember, viewer: CompanyViewer): TeamMemberAction[] {
    if (member.accountId === viewer.id) return [];

    const canUpdateRole = viewer.role === 'owner' && !PROTECTED_ROLES.includes(member.role);
    return canUpdateRole ? ['updateRole', 'removeFromTeam'] : ['removeFromTeam'];
}

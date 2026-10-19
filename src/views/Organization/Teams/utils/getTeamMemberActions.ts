import type { UserRole } from '@/types/user';
import type { CompanyViewer } from '@/views/Organization/Company/types';
import canChangeRoles from '@/views/Organization/shared/utils/canChangeRoles';
import type { TeamMember, TeamMemberAction } from '../types';

const PROTECTED_ROLES: readonly UserRole[] = ['owner', 'superadmin'];

/**
 * Row menu actions on a team member, in menu order.
 * - Own row: nothing.
 * - Update role: owner or superadmin viewer only, never on an owner / superadmin target.
 * - Transfer + remove from team: anyone else (removing only unlinks the team; the account stays).
 */
export default function getTeamMemberActions(member: TeamMember, viewer: CompanyViewer): TeamMemberAction[] {
    if (member.accountId === viewer.id) return [];

    const canUpdateRole = canChangeRoles(viewer.role) && !PROTECTED_ROLES.includes(member.role);
    return canUpdateRole
        ? ['updateRole', 'transferMember', 'removeFromTeam']
        : ['transferMember', 'removeFromTeam'];
}

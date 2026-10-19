import type { UserRole } from '@/types/user';
import canChangeRoles from '@/views/Organization/shared/utils/canChangeRoles';
import type { CompanyMemberRow, CompanyViewer, MemberRowAction } from '../types';

const PROTECTED_ROLES: readonly UserRole[] = ['owner', 'superadmin'];

/**
 * Row menu actions the viewer may take on a row, in menu order.
 * - Own row: nothing.
 * - Invite: update role (owner or superadmin viewer only) + change team + revoke; expired adds resend.
 * - Member: update role (owner or superadmin viewer only) + remove; neither on an owner / superadmin target.
 */
export default function getRowActions(row: CompanyMemberRow, viewer: CompanyViewer): MemberRowAction[] {
    if (row.isInvite) {
        const roleAction: MemberRowAction[] = canChangeRoles(viewer.role) ? ['updateRole'] : [];
        const resendAction: MemberRowAction[] = row.status === 'expired' ? ['resendInvite'] : [];
        return [...roleAction, 'changeInviteTeam', ...resendAction, 'revokeInvite'];
    }

    if (row.id === viewer.id || PROTECTED_ROLES.includes(row.role)) return [];

    return canChangeRoles(viewer.role) ? ['updateRole', 'removeMember'] : ['removeMember'];
}

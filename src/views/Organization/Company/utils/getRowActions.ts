import type { UserRole } from '@/types/user';
import canChangeRoles from '@/views/Organization/shared/utils/canChangeRoles';
import type { CompanyMemberRow, CompanyViewer, MemberRowAction } from '../types';

const PROTECTED_ROLES: readonly UserRole[] = ['owner', 'superadmin'];

/**
 * Row menu actions the viewer may take on a row, in menu order.
 * - Own row: nothing.
 * - Pending invite: revoke. Expired invite: resend + revoke.
 * - Member: update role (owner or superadmin viewer only) + remove; neither on an owner / superadmin target.
 */
export default function getRowActions(row: CompanyMemberRow, viewer: CompanyViewer): MemberRowAction[] {
    if (row.isInvite) {
        return row.status === 'expired' ? ['resendInvite', 'revokeInvite'] : ['revokeInvite'];
    }

    if (row.id === viewer.id || PROTECTED_ROLES.includes(row.role)) return [];

    return canChangeRoles(viewer.role) ? ['updateRole', 'removeMember'] : ['removeMember'];
}

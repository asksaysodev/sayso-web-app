import type { UserRole } from '@/types/user';

/** Who may change member roles: the owner, and Sayso staff (superadmin). Mirrors the server's rule. */
const ROLE_MANAGER_ROLES: readonly UserRole[] = ['owner', 'superadmin'];

export default function canChangeRoles(role: UserRole | null): boolean {
    return role !== null && ROLE_MANAGER_ROLES.includes(role);
}

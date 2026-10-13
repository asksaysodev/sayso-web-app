import type { UserRole } from '@/types/user';

/** Who may rename the company: the owner, and Sayso staff (superadmin). Mirrors the server's rule. */
const COMPANY_RENAMER_ROLES: readonly UserRole[] = ['owner', 'superadmin'];

export default function canRenameCompany(role: UserRole | null): boolean {
    return role !== null && COMPANY_RENAMER_ROLES.includes(role);
}

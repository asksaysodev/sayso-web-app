import type { UserRole } from '@/types/user';
import canChangeRoles from './canChangeRoles';

/** Who may rename the company: the same owner + superadmin rule as role changes, as on the server. */
export default function canRenameCompany(role: UserRole | null): boolean {
    return canChangeRoles(role);
}

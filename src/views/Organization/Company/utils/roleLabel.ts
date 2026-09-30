import type { UserRole } from '@/types/user';

const ROLE_LABELS: Record<UserRole, string> = {
    owner: 'Owner',
    admin: 'Admin',
    user: 'Member',
    superadmin: 'Superadmin',
};

export default function roleLabel(role: UserRole): string {
    return ROLE_LABELS[role];
}

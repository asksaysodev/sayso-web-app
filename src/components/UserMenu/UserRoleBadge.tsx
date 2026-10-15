import clsx from 'clsx';
import { Badge, type BadgeTone } from '@/components/ds/Badge';
import type { UserRole } from '@/types/user';
import roleLabel from '@/utils/roleLabel';

const ROLE_TONES: Record<UserRole, BadgeTone> = {
    user: 'success',
    admin: 'primary',
    owner: 'info',
    superadmin: 'info',
};

interface Props {
    role: UserRole;
    /** Filled variant used inside the dropdown card. */
    solid?: boolean;
}

export default function UserRoleBadge({ role, solid = false }: Props) {
    return (
        <Badge tone={ROLE_TONES[role]} className={clsx('user-menu__badge', solid && 'user-menu__badge--solid')}>
            {roleLabel(role)}
        </Badge>
    );
}

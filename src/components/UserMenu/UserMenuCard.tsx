import { Avatar } from '@/components/ds/Avatar';
import type { Account } from '@/types/user';
import displayName from '@/utils/displayName';
import { getInitials } from '@/utils/helpers/getInitials';
import UserRoleBadge from './UserRoleBadge';

interface Props {
    user: Account;
}

export default function UserMenuCard({ user }: Props) {
    return (
        <div className='user-menu__card user-menu__card--profile'>
            <Avatar initials={getInitials(user.name ?? '', user.lastname ?? '', user.email)} size={40} />
            <div className='user-menu__identity'>
                <div className='user-menu__identity-row'>
                    <span className='user-menu__name'>{displayName(user)}</span>
                    {user.role && <UserRoleBadge role={user.role} solid />}
                </div>
                <span className='user-menu__email'>{user.email}</span>
            </div>
        </div>
    );
}

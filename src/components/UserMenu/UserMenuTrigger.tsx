import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { Avatar } from '@/components/ds/Avatar';
import type { Account } from '@/types/user';
import displayName from '@/utils/displayName';
import { getInitials } from '@/utils/helpers/getInitials';
import UserRoleBadge from './UserRoleBadge';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    user: Account;
}

const UserMenuTrigger = forwardRef<HTMLButtonElement, Props>(function UserMenuTrigger({ user, ...props }, ref) {
    return (
        <button ref={ref} type='button' className='user-menu__trigger' aria-label='Open user menu' {...props}>
            <Avatar initials={getInitials(user.name ?? '', user.lastname ?? '', user.email)} size={44} />
            <span className='user-menu__trigger-name'>{displayName(user)}</span>
            {user.role && <UserRoleBadge role={user.role} />}
            <ChevronDown size={16} className='user-menu__trigger-caret' />
        </button>
    );
});

export default UserMenuTrigger;

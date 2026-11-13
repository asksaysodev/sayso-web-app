import type { Account } from '@/types/user';
import UserIdentity from './UserIdentity';

interface Props {
    user: Account;
}

export default function UserMenuCard({ user }: Props) {
    return (
        <div className='user-menu__card user-menu__card--profile'>
            <UserIdentity user={user} />
        </div>
    );
}

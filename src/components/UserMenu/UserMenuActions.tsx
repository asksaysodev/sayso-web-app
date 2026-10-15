import { useNavigate } from 'react-router-dom';
import { CreditCard, LogOut, Settings } from 'lucide-react';
import { MenuItem, MenuSeparator } from '@/components/ds/Menu';
import { useAuth } from '@/context/AuthContext';
import useUserNotAdminOnTeams from '@/hooks/useUserNotAdminOnTeams';

export default function UserMenuActions() {
    const navigate = useNavigate();
    const { handleSignOut } = useAuth();
    const userNotAdminOnTeams = useUserNotAdminOnTeams();

    return (
        <div className='user-menu__card user-menu__card--actions'>
            <MenuItem className='user-menu__item' icon={<Settings size={20} />} onSelect={() => navigate('/settings')}>
                Settings
            </MenuItem>
            {!userNotAdminOnTeams && (
                <MenuItem className='user-menu__item' icon={<CreditCard size={20} />} onSelect={() => navigate('/subscription')}>
                    Subscription
                </MenuItem>
            )}
            <MenuSeparator className='user-menu__separator' />
            <MenuItem className='user-menu__item' tone='destructive' icon={<LogOut size={20} />} onSelect={handleSignOut}>
                Log out
            </MenuItem>
        </div>
    );
}

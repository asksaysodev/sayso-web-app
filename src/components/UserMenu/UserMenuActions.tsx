import { useNavigate } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import { MenuItem, MenuSeparator } from '@/components/ds/Menu';
import { useAuth } from '@/context/AuthContext';

export default function UserMenuActions() {
    const navigate = useNavigate();
    const { handleSignOut } = useAuth();

    return (
        <div className='user-menu__card user-menu__card--actions'>
            <MenuItem className='user-menu__item' icon={<Settings size={20} />} onSelect={() => navigate('/settings')}>
                Settings
            </MenuItem>
            <MenuSeparator className='user-menu__separator' />
            <MenuItem className='user-menu__item' tone='destructive' icon={<LogOut size={20} />} onSelect={handleSignOut}>
                Log out
            </MenuItem>
        </div>
    );
}

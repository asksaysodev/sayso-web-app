import { LogOut, Settings } from 'lucide-react';
import { MenuItem, MenuSeparator } from '@/components/ds/Menu';
import { useAuth } from '@/context/AuthContext';
import useOpenSettings from '@/hooks/useOpenSettings';

export default function UserMenuActions() {
    const openSettings = useOpenSettings();
    const { handleSignOut } = useAuth();

    return (
        <div className='user-menu__card user-menu__card--actions'>
            <MenuItem className='user-menu__item' icon={<Settings size={20} />} onSelect={() => openSettings()}>
                Account Settings
            </MenuItem>
            <MenuSeparator className='user-menu__separator' />
            <MenuItem className='user-menu__item' tone='destructive' icon={<LogOut size={20} />} onSelect={handleSignOut}>
                Log out
            </MenuItem>
        </div>
    );
}

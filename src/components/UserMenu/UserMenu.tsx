import { Menu, MenuContent, MenuTrigger } from '@/components/ds/Menu';
import { useAuth } from '@/context/AuthContext';
import UserMenuActions from './UserMenuActions';
import UserMenuCard from './UserMenuCard';
import UserMenuLegalLinks from './UserMenuLegalLinks';
import UserMenuTrigger from './UserMenuTrigger';
import './UserMenu.css';

export default function UserMenu() {
    const { globalUser } = useAuth();

    if (!globalUser) return null;

    return (
        <Menu modal={false}>
            <MenuTrigger asChild>
                <UserMenuTrigger user={globalUser} />
            </MenuTrigger>
            <MenuContent className='user-menu' sideOffset={8} collisionPadding={16}>
                <UserMenuCard user={globalUser} />
                <UserMenuActions />
                <UserMenuLegalLinks />
            </MenuContent>
        </Menu>
    );
}

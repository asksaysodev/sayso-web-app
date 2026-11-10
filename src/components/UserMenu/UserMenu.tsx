import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Menu, MenuContent, MenuTrigger } from '@/components/ds/Menu';
import { useAuth } from '@/context/AuthContext';
import UserMenuActions from './UserMenuActions';
import UserMenuCard from './UserMenuCard';
import UserMenuLegalLinks from './UserMenuLegalLinks';
import UserMenuTrigger from './UserMenuTrigger';
import './UserMenu.css';

export default function UserMenu() {
    const { globalUser } = useAuth();
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 767px)');

    if (!globalUser) return null;

    if (isMobile) {
        return <UserMenuTrigger user={globalUser} aria-label='Open account settings' onClick={() => navigate('/settings')} />;
    }

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

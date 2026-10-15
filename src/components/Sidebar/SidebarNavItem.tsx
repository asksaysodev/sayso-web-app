import { NavLink } from 'react-router-dom';
import SidebarTooltip from './SidebarTooltip';
import type { NavItem } from './useNavItems';

interface Props {
    item: NavItem;
    collapsed: boolean;
    onNavigate?: () => void;
}

export default function SidebarNavItem({ item: { to, label, icon: Icon }, collapsed, onNavigate }: Props) {
    return (
        <SidebarTooltip label={label} enabled={collapsed}>
            <NavLink
                to={to}
                onClick={onNavigate}
                aria-label={collapsed ? label : undefined}
                className='sidebar__item'
            >
                <Icon size={24} className='sidebar__item-icon' />
                {!collapsed && <span className='sidebar__item-label'>{label}</span>}
            </NavLink>
        </SidebarTooltip>
    );
}

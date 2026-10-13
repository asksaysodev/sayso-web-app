import type { ReactNode } from 'react';
import SidebarActions from './SidebarActions';
import SidebarHelpItem from './SidebarHelpItem';
import SidebarLogo from './SidebarLogo';
import SidebarNavItem from './SidebarNavItem';
import useNavItems from './useNavItems';

interface Props {
    collapsed?: boolean;
    hideLaunchCoach?: boolean;
    onNavigate?: () => void;
    footer?: ReactNode;
}

export default function SidebarContent({ collapsed = false, hideLaunchCoach, onNavigate, footer }: Props) {
    const navItems = useNavItems();

    return (
        <div className='sidebar__content'>
            <div>
                <SidebarLogo collapsed={collapsed} />
                <div className='sidebar__divider' />
                <nav className='sidebar__section'>
                    {navItems.map((item) => (
                        <SidebarNavItem key={item.to} item={item} collapsed={collapsed} onNavigate={onNavigate} />
                    ))}
                </nav>
            </div>
            <div>
                <div className='sidebar__section'>
                    <SidebarHelpItem collapsed={collapsed} />
                </div>
                <div className='sidebar__divider' />
                <SidebarActions collapsed={collapsed} hideLaunchCoach={hideLaunchCoach} onNavigate={onNavigate} />
                {footer &&
                    <>
                        <div className='sidebar__divider' />
                        <div className='sidebar__section'>{footer}</div>
                    </>
                }
            </div>
        </div>
    );
}

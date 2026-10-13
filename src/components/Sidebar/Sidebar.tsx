import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import clsx from 'clsx';
import useSidebarCollapsed from '@/hooks/useSidebarCollapsed';
import SidebarCollapseToggle from './SidebarCollapseToggle';
import SidebarContent from './SidebarContent';
import './Sidebar.css';

export default function Sidebar() {
    const [collapsed, toggleCollapsed] = useSidebarCollapsed();

    return (
        <TooltipPrimitive.Provider delayDuration={150}>
            <aside className={clsx('sidebar', collapsed && 'sidebar--collapsed')}>
                <SidebarContent
                    collapsed={collapsed}
                    footer={<SidebarCollapseToggle collapsed={collapsed} onToggle={toggleCollapsed} />}
                />
            </aside>
        </TooltipPrimitive.Provider>
    );
}

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import clsx from 'clsx';
import useSidebarCollapsed from '@/hooks/useSidebarCollapsed';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import SidebarCollapseToggle from './SidebarCollapseToggle';
import SidebarContent from './SidebarContent';
import './Sidebar.css';

export default function Sidebar() {
    const [collapsed, toggleCollapsed] = useSidebarCollapsed();
    // Below 768px this sidebar is only hidden by CSS; the coach mark must not anchor to a hidden button.
    const isMobile = useMediaQuery('(max-width: 767px)');

    return (
        <TooltipPrimitive.Provider delayDuration={150}>
            <aside className={clsx('sidebar', collapsed && 'sidebar--collapsed')}>
                <SidebarContent
                    collapsed={collapsed}
                    spotlightDownload={!isMobile}
                    footer={<SidebarCollapseToggle collapsed={collapsed} onToggle={toggleCollapsed} />}
                />
            </aside>
        </TooltipPrimitive.Provider>
    );
}

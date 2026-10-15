import { ArrowLeftToLine, ArrowRightToLine } from 'lucide-react';
import SidebarTooltip from './SidebarTooltip';

interface Props {
    collapsed: boolean;
    onToggle: () => void;
}

export default function SidebarCollapseToggle({ collapsed, onToggle }: Props) {
    const Icon = collapsed ? ArrowRightToLine : ArrowLeftToLine;

    return (
        <SidebarTooltip label='Expand' enabled={collapsed}>
            <button
                type='button'
                className='sidebar__item'
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!collapsed}
                onClick={onToggle}
            >
                <Icon size={24} strokeWidth={1.5} className='sidebar__item-icon' />
                {!collapsed && <span className='sidebar__item-label'>Collapse</span>}
            </button>
        </SidebarTooltip>
    );
}

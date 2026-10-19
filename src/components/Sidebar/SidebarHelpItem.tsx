import { PiQuestion } from 'react-icons/pi';
import { HELP_CENTER_URL } from '@/constants';
import { openExternal } from '@/utils/helpers/openExternal';
import SidebarTooltip from './SidebarTooltip';

const LABEL = 'Help center';

interface Props {
    collapsed: boolean;
}

export default function SidebarHelpItem({ collapsed }: Props) {
    return (
        <SidebarTooltip label={LABEL} enabled={collapsed}>
            <button
                type='button'
                className='sidebar__item'
                aria-label={collapsed ? LABEL : undefined}
                onClick={() => openExternal(HELP_CENTER_URL)}
            >
                <PiQuestion size={24} className='sidebar__item-icon' />
                {!collapsed && <span className='sidebar__item-label'>{LABEL}</span>}
            </button>
        </SidebarTooltip>
    );
}

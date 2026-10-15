import { useNavigate } from 'react-router-dom';
import { Download, Rocket } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ds/Button';
import { LAUNCH_COACH_URL } from '@/constants';
import SidebarTooltip from './SidebarTooltip';

const LAUNCH_LABEL = 'Launch Coach';
const DOWNLOAD_LABEL = 'Download Sayso';

interface Props {
    collapsed: boolean;
    hideLaunchCoach?: boolean;
    onNavigate?: () => void;
}

export default function SidebarActions({ collapsed, hideLaunchCoach = false, onNavigate }: Props) {
    const navigate = useNavigate();
    const actionClass = clsx('sidebar__action', collapsed && 'sidebar__action--icon');

    const handleDownload = () => {
        onNavigate?.();
        navigate('/download');
    };

    return (
        <div className='sidebar__section sidebar__section--actions'>
            {!hideLaunchCoach &&
                <SidebarTooltip label={LAUNCH_LABEL} enabled={collapsed}>
                    <Button
                        variant='primary'
                        className={actionClass}
                        aria-label={collapsed ? LAUNCH_LABEL : undefined}
                        leftIcon={<Rocket size={collapsed ? 24 : 20} strokeWidth={1.5} />}
                        onClick={() => { window.location.href = LAUNCH_COACH_URL; }}
                    >
                        {!collapsed && LAUNCH_LABEL}
                    </Button>
                </SidebarTooltip>
            }
            <SidebarTooltip label={DOWNLOAD_LABEL} enabled={collapsed}>
                <Button
                    variant='secondary'
                    className={actionClass}
                    aria-label={collapsed ? DOWNLOAD_LABEL : undefined}
                    leftIcon={<Download size={collapsed ? 24 : 20} strokeWidth={1.5} />}
                    onClick={handleDownload}
                >
                    {!collapsed && DOWNLOAD_LABEL}
                </Button>
            </SidebarTooltip>
        </div>
    );
}

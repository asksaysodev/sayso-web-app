import { useRef } from 'react';
import { PiDownload, PiRocket, PiX } from 'react-icons/pi';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import clsx from 'clsx';
import { Badge } from '@/components/ds/Badge';
import { Button } from '@/components/ds/Button';
import { LAUNCH_COACH_URL } from '@/constants';
import { useDownloadModalStore } from '@/store/downloadModalStore';
import SidebarTooltip from './SidebarTooltip';
import SpotlightBackdrop from './SpotlightBackdrop';
import useDownloadSpotlight from './useDownloadSpotlight';

const LAUNCH_LABEL = 'Launch Coach';
const DOWNLOAD_LABEL = 'Download Sayso';

interface Props {
    collapsed: boolean;
    hideLaunchCoach?: boolean;
    /** Desktop sidebar only: point new users at the Download button (see useDownloadSpotlight). */
    spotlightDownload?: boolean;
    onNavigate?: () => void;
}

export default function SidebarActions({ collapsed, hideLaunchCoach = false, spotlightDownload = false, onNavigate }: Props) {
    const openDownloadModal = useDownloadModalStore(state => state.setOpen);
    const spotlight = useDownloadSpotlight(spotlightDownload);
    const showSpotlight = spotlight.visible;
    const downloadRef = useRef<HTMLButtonElement>(null);
    const actionClass = clsx('sidebar__action', collapsed && 'sidebar__action--icon');

    const handleDownload = () => {
        if (showSpotlight) spotlight.dismiss();
        onNavigate?.();
        openDownloadModal(true);
    };

    return (
        <div className='sidebar__section sidebar__section--actions'>
            {/* Hidden while the coach mark is up, so Download is the only call to action. */}
            {!hideLaunchCoach && !showSpotlight &&
                <SidebarTooltip label={LAUNCH_LABEL} enabled={collapsed}>
                    <Button
                        variant='primary'
                        className={actionClass}
                        aria-label={collapsed ? LAUNCH_LABEL : undefined}
                        leftIcon={<PiRocket size={collapsed ? 24 : 20} />}
                        onClick={() => { window.location.href = LAUNCH_COACH_URL; }}
                    >
                        {!collapsed && LAUNCH_LABEL}
                    </Button>
                </SidebarTooltip>
            }
            {showSpotlight && <SpotlightBackdrop target={downloadRef} onDismiss={spotlight.dismiss} />}
            <PopoverPrimitive.Root open={showSpotlight}>
                <SidebarTooltip label={DOWNLOAD_LABEL} enabled={collapsed && !showSpotlight}>
                    <PopoverPrimitive.Anchor asChild>
                        <Button
                            ref={downloadRef}
                            variant='secondary'
                            className={clsx(actionClass, showSpotlight && 'sidebar__action--spotlight')}
                            aria-label={collapsed ? DOWNLOAD_LABEL : undefined}
                            leftIcon={<PiDownload size={collapsed ? 24 : 20} />}
                            onClick={handleDownload}
                        >
                            {!collapsed && DOWNLOAD_LABEL}
                        </Button>
                    </PopoverPrimitive.Anchor>
                </SidebarTooltip>
                <PopoverPrimitive.Portal>
                    <PopoverPrimitive.Content
                        side='top'
                        align='start'
                        sideOffset={12}
                        collisionPadding={16}
                        className='sidebar__spotlight'
                        aria-label='Download the app'
                        // A coach mark, not a dialog: keep focus on the page and stay open on outside clicks.
                        onOpenAutoFocus={(event) => event.preventDefault()}
                        onInteractOutside={(event) => event.preventDefault()}
                        onEscapeKeyDown={spotlight.dismiss}
                    >
                        {/* Texture: the email hero disc (glow + concentric rings), without the logo. */}
                        <span className='sidebar__spotlight-clip' aria-hidden='true'>
                            <span className='sidebar__spotlight-texture'>
                                <span className='sidebar__spotlight-ring' />
                                <span className='sidebar__spotlight-ring sidebar__spotlight-ring--mid' />
                                <span className='sidebar__spotlight-ring sidebar__spotlight-ring--inner' />
                            </span>
                        </span>
                        <div className='sidebar__spotlight-content'>
                            <Badge tone='primary'>Next step</Badge>
                            <p className='sidebar__spotlight-title'>Download the app</p>
                            <p className='sidebar__spotlight-body'>Install for real-time guidance on your calls</p>
                        </div>
                        <button
                            type='button'
                            className='sidebar__spotlight-close'
                            aria-label='Dismiss'
                            onClick={spotlight.dismiss}
                        >
                            <PiX size={16} />
                        </button>
                        <PopoverPrimitive.Arrow className='sidebar__spotlight-arrow' width={14} height={7} />
                    </PopoverPrimitive.Content>
                </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>
        </div>
    );
}

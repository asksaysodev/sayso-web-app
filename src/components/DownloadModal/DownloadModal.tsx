import { useEffect, useMemo, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { CircleHelp } from 'lucide-react';
import { Modal } from '@/components/ds/Modal';
import { useAuth } from '@/context/AuthContext';
import { useDownloadModalStore } from '@/store/downloadModalStore';
import { openExternal } from '@/utils/helpers/openExternal';
import DownloadOptionCard from './components/DownloadOptionCard';
import MacDownloadMenu from './components/MacDownloadMenu';
import ChipHelpPopover from './components/ChipHelpPopover';
import MobileSendLinkModal from './components/MobileSendLinkModal';
import { useDownloadGithubRelease } from './hooks/useDownloadGithubRelease';
import { detectOS } from './utils/detectOS';
import { isMobileViewport } from './utils/isMobileViewport';
import './DownloadModal.css';

/** Download Sayso for desktop (was the /download page). Open it with useDownloadModalStore. */
export default function DownloadModal() {
    const open = useDownloadModalStore(state => state.open);
    const setOpen = useDownloadModalStore(state => state.setOpen);
    const { globalUser } = useAuth();

    // The open flag is global: never carry it over to the next account signing in.
    useEffect(() => {
        if (!globalUser) setOpen(false);
    }, [globalUser, setOpen]);

    return (
        <Modal open={open} onOpenChange={setOpen} className='download-modal' aria-describedby={undefined}>
            {open && <DownloadModalContent />}
        </Modal>
    );
}

function DownloadModalContent() {
    const { globalUser } = useAuth();
    const { siliconUrl, intelUrl, windowsUrl, version, isLoading } = useDownloadGithubRelease();
    const detectedOS = useMemo(() => detectOS(), []);
    const [mobileModalOpen, setMobileModalOpen] = useState(false);

    const openMobileModal = () => setMobileModalOpen(true);

    const handleWindowsClick = () => {
        if (isMobileViewport()) {
            openMobileModal();
            return;
        }
        if (windowsUrl) openExternal(windowsUrl);
    };

    const withVersion = (compat: string) => (version ? `${compat} · ${version}` : compat);

    const subjectValue = encodeURIComponent(`Sayso App Support Request - ${globalUser?.email ?? '{enter your email}'}`);
    const bodyValue = encodeURIComponent(`Describe the error and include any attachments or video links. All context or additional information will help us reproducing the error scenario`);

    return (
        <>
            <div className='download-hero'>
                {/* Same hero as the emails (server utils/emailHero.js): glow, two rings, disc. */}
                <div className='download-hero-logo' aria-hidden='true'>
                    <div className='download-hero-ring'>
                        <div className='download-hero-ring download-hero-ring--inner'>
                            <img src='/assets/email/sayso-hero-disc.png' alt='' width={54} height={54} className='download-hero-icon' />
                        </div>
                    </div>
                </div>
                <DialogPrimitive.Title className='download-title'>Download Sayso</DialogPrimitive.Title>
            </div>

            <div className='download-cards'>
                <DownloadOptionCard
                    logo='/assets/download/windows-logo.svg?v=2'
                    logoAlt='Windows'
                    meta={withVersion('Win10+')}
                    title='Sayso for Windows'
                    description='Bring Sayso to your Windows desktop.'
                    recommended={detectedOS === 'windows'}
                    unavailable={!isLoading && !windowsUrl}
                    loading={isLoading}
                    actions={
                        isLoading ? (
                            <span className='skeleton download-btn-skeleton' aria-hidden='true' />
                        ) : (
                            <button className='download-btn' disabled={!windowsUrl} onClick={handleWindowsClick}>
                                Download
                            </button>
                        )
                    }
                />
                <DownloadOptionCard
                    logo='/assets/download/apple-logo.svg?v=2'
                    logoAlt='Apple'
                    meta={withVersion('macOS 13.0+')}
                    title='Sayso for Mac'
                    description='Choose the right version for your Mac.'
                    recommended={detectedOS === 'mac'}
                    unavailable={!isLoading && !siliconUrl && !intelUrl}
                    loading={isLoading}
                    actions={
                        <>
                            {isLoading ? (
                                <span className='skeleton download-btn-skeleton download-btn-skeleton--menu' aria-hidden='true' />
                            ) : (
                                <MacDownloadMenu
                                    siliconUrl={siliconUrl}
                                    intelUrl={intelUrl}
                                    onDownload={openExternal}
                                    onMobileClick={openMobileModal}
                                />
                            )}
                            <ChipHelpPopover />
                        </>
                    }
                />
            </div>

            <div className='download-support'>
                <span>Need help?</span>
                <button
                    className='download-link'
                    onClick={() => openExternal(`mailto:support@asksayso.com?subject=${subjectValue}&body=${bodyValue}`)}
                >
                    Contact Support
                    <CircleHelp size={20} />
                </button>
            </div>

            <MobileSendLinkModal
                open={mobileModalOpen}
                onOpenChange={setMobileModalOpen}
                defaultEmail={globalUser?.email ?? ''}
            />
        </>
    );
}

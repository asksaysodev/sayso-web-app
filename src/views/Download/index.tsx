import { ArrowLeft, CircleHelp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import DownloadOptionCard from './components/DownloadOptionCard';
import MacDownloadMenu from './components/MacDownloadMenu';
import ChipHelpPopover from './components/ChipHelpPopover';
import MobileSendLinkModal from './components/MobileSendLinkModal';
import AutoRedirectingButton from './components/AutoRedirectingButton';
import ButtonSpinner from '@/components/ButtonSpinner';
import { useDownloadGithubRelease } from './hooks/useDownloadGithubRelease';
import { detectOS } from './utils/detectOS';
import { isMobileViewport } from './utils/isMobileViewport';
import { useAuth } from '@/context/AuthContext';
import { openExternal } from '@/utils/helpers/openExternal';

export default function Download() {
    const { globalUser } = useAuth();
    const { siliconUrl, intelUrl, windowsUrl, version, isLoading } = useDownloadGithubRelease();
    const navigate = useNavigate();

    const detectedOS = useMemo(() => detectOS(), []);
    const [mobileModalOpen, setMobileModalOpen] = useState(false);
    const [redirectRun, setRedirectRun] = useState(0);

    const handleDownload = (url: string) => {
        openExternal(url);
        if (globalUser) setRedirectRun(run => run + 1);
    };

    const handleWindowsClick = () => {
        if (isMobileViewport()) {
            setMobileModalOpen(true);
            return;
        }
        if (windowsUrl) handleDownload(windowsUrl);
    };

    const withVersion = (compat: string) => (version ? `${compat} · ${version}` : compat);

    const subjectValue = encodeURIComponent(`Sayso App Support Request - ${globalUser?.email ?? '{enter your email}'}`);
    const bodyValue = encodeURIComponent(`Describe the error and include any attachments or video links. All context or additional information will help us reproducing the error scenario`);

    return (
        <div className='download-view-wrapper'>
            <div className='download-header'>
                {globalUser
                    ?   redirectRun > 0
                            ?   <AutoRedirectingButton
                                    key={redirectRun}
                                    onCancel={() => setRedirectRun(0)}
                                    onComplete={() => navigate('/')}
                                />
                            :   <button className='download-back-link' onClick={() => navigate('/')}>
                                    <ArrowLeft size={20} />
                                    Back to Dashboard
                                </button>
                    :   <button className='download-back-link' onClick={() => navigate('/login')}>
                            <ArrowLeft size={20} />
                            Sign in
                        </button>
                }
            </div>

            <div className='download-hero'>
                <div className='download-hero-logo'>
                    <img src='/assets/download/glow.svg' alt='' width={443} height={443} className='download-hero-glow' />
                    <div className='download-hero-ring' />
                    <div className='download-hero-ring download-hero-ring--inner' />
                    <img src='/assets/download/sayso-logo.svg' alt='Sayso' width={240} height={240} className='download-hero-icon' />
                </div>
                <h1 className='download-title'>Download Sayso</h1>
            </div>

            <div className='download-cards'>
                <DownloadOptionCard
                    logo='/assets/download/windows-logo.svg'
                    logoAlt='Windows'
                    meta={withVersion('Win10+')}
                    title='Sayso for Windows'
                    description='Bring Sayso to your Windows desktop.'
                    recommended={detectedOS === 'windows'}
                    unavailable={!isLoading && !windowsUrl}
                    actions={
                        <button className='download-btn' disabled={isLoading || !windowsUrl} onClick={handleWindowsClick}>
                            Download
                            {isLoading && <ButtonSpinner />}
                        </button>
                    }
                />
                <DownloadOptionCard
                    logo='/assets/download/apple-logo.svg'
                    logoAlt='Apple'
                    meta={withVersion('macOS 13.0+')}
                    title='Sayso for Mac'
                    description='Choose the right version for your Mac.'
                    recommended={detectedOS === 'mac'}
                    unavailable={!isLoading && !siliconUrl && !intelUrl}
                    actions={
                        <>
                            <MacDownloadMenu
                                siliconUrl={siliconUrl}
                                intelUrl={intelUrl}
                                isLoading={isLoading}
                                onDownload={handleDownload}
                                onMobileClick={() => setMobileModalOpen(true)}
                            />
                            <ChipHelpPopover />
                        </>
                    }
                />
            </div>

            <MobileSendLinkModal
                open={mobileModalOpen}
                onOpenChange={setMobileModalOpen}
                defaultEmail={globalUser?.email ?? ''}
            />

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
        </div>
    );
}

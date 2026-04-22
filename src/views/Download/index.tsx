import { MoveLeft, CircleHelp, Cpu } from 'lucide-react';
import { useMemo, useState } from 'react';
import './styles.css';
import DownloadOptionCard from './components/DownloadOptionCard';
import MobileSendLinkModal from './components/MobileSendLinkModal';
import AppleSiliconIcon from './components/AppleSiliconIcon';
import { detectChip } from './utils/detectChip';
import { useDownloadGithubRelease } from '@/components/DownloadDesktopAppButton/hooks/useDownloadGithubRelease';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { openExternal } from '@/utils/helpers/openExternal';

export default function Download() {
    const { globalUser } = useAuth();
    const { handleDownload, intelUrl, siliconUrl, version, publishedAt } = useDownloadGithubRelease(true);
    const navigate = useNavigate();

    const detectedChip = useMemo(() => detectChip(), []);
    const [mobileModalOpen, setMobileModalOpen] = useState(false);

    const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—';

    const subjectValue = encodeURIComponent(`Sayso App Support Request - ${globalUser?.email ?? '{enter your email}'}`);
    const bodyValue = encodeURIComponent(`Describe the error and include any attachments or video links. All context or additional information will help us reproducing the error scenario`);

    return (
        <div className='download-view-wrapper'>
            <div className='download-vh'>
                {globalUser
                    ?   <button className='download-vh-dashboard-btn' onClick={() => navigate('/')}>
                            <MoveLeft size={20} />
                            Go to Dashboard
                        </button>
                    :   <button className='download-vh-dashboard-btn' onClick={() => navigate('/login')}>
                            <MoveLeft size={20} />
                            Sign in
                        </button>
                }

                <div className='download-vh-title'>
                    <img src='/assets/tray-icon44Template.png' alt="Sayso Icon" className='download-vh-icon' />
                    <span>Download Sayso for Mac</span>
                </div>
            </div>

            <div className='download-options-container'>
                <DownloadOptionCard
                    title='Intel Chip'
                    description='Optimized for MacBook, iMac, and Mac Mini models powered by Intel processors.'
                    icon={<Cpu size={34} color="#8a8a8a" />}
                    recommended={detectedChip === 'intel'}
                    onClick={() => handleDownload(intelUrl)}
                    onMobileClick={() => setMobileModalOpen(true)}
                />
                <DownloadOptionCard
                    title='Apple Silicon Chip'
                    description='Optimized for M1, M2, and M3 series processors for maximum efficiency and speed.'
                    icon={<AppleSiliconIcon />}
                    recommended={detectedChip === 'silicon'}
                    onClick={() => handleDownload(siliconUrl)}
                    onMobileClick={() => setMobileModalOpen(true)}
                />
            </div>

            <MobileSendLinkModal
                open={mobileModalOpen}
                onOpenChange={setMobileModalOpen}
                defaultEmail={globalUser?.email ?? ''}
            />

            <div className='download-body'>
                <div className='download-meta'>
                    <div className='download-meta-item'>
                        <span className='download-meta-label'>Version</span>
                        <span className='download-meta-value'>{version ?? '—'}</span>
                    </div>
                    <div className='download-meta-divider' />
                    <div className='download-meta-item'>
                        <span className='download-meta-label'>Compatibility</span>
                        <span className='download-meta-value'>macOS 13.0+</span>
                    </div>
                    <div className='download-meta-divider' />
                    <div className='download-meta-item'>
                        <span className='download-meta-label'>Release Date</span>
                        <span className='download-meta-value'>{formattedDate}</span>
                    </div>
                </div>

                <div className='download-support' onClick={() => openExternal(`mailto:support@asksayso.com?subject=${subjectValue}&body=${bodyValue}`)}>
                    <CircleHelp size={18} color='#9ca3af' />
                    <span>Need help? Contact support</span>
                </div>
            </div>
        </div>
    );
}

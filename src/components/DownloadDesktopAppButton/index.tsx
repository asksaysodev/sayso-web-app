import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { LuX, LuDownload, LuCircleHelp } from 'react-icons/lu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDownloadGithubRelease } from './hooks/useDownloadGithubRelease';
import SaysoButton from "../SaysoButton";
import './DownloadDesktopAppButton.css';

export default function DownloadDesktopAppButton() {
    const [searchParams] = useSearchParams();
    const [showModal, setShowModal] = useState(searchParams.get("success") === "true");
    const { siliconUrl, intelUrl, handleDownload, isLoadingUrls } = useDownloadGithubRelease(showModal);

    return (
        <>
            <SaysoButton
                fullWidth
                variant="blue"
                label="Get Sayso for Mac"
                onClick={() => setShowModal(true)}
            />
            {showModal && createPortal(
                <div className="dda-overlay" onClick={() => setShowModal(false)}>
                    <div className="dda-modal" onClick={e => e.stopPropagation()}>
                        <div className="dda-header">
                            <div className="dda-header-text">
                                <div className="dda-title-row">
                                    <h2>Download Sayso for Mac</h2>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="dda-help-btn">
                                                    <LuCircleHelp size={14} />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="!z-[70] dda-tooltip">
                                                <p>Click the Apple menu → About This Mac.<br />If you see "Apple M1/M2/M3/M4", pick Apple Silicon.<br />If you see "Intel Core", pick Intel.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <p>Choose the version that matches your Mac</p>
                            </div>
                            <button className="dda-close" onClick={() => setShowModal(false)}>
                                <LuX size={16} />
                            </button>
                        </div>
                        <div className="dda-options">
                            <button disabled={!isLoadingUrls && !siliconUrl} className="dda-option" onClick={() => handleDownload(siliconUrl)}>
                                <div className="dda-option-text">
                                    <h3>Apple Silicon</h3>
                                    <p>M1, M2, M3, M4</p>
                                </div>
                                <LuDownload size={15} className="dda-option-download" />
                            </button>
                            <button disabled={!isLoadingUrls && !intelUrl} className="dda-option" onClick={() => handleDownload(intelUrl)}>
                                <div className="dda-option-text">
                                    <h3>Intel</h3>
                                    <p>Older Macs</p>
                                </div>
                                <LuDownload size={15} className="dda-option-download" />
                            </button>
                        </div>
                    </div>
                </div>
            , document.body)}
        </>
    );
}

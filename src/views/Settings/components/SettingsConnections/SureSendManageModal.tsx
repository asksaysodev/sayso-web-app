import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useSureSend } from "@/hooks/useSureSend";
import suresendIcon from '/assets/suresend-icon-color.svg';

type ManageState = 'manage' | 'confirm' | 'disconnecting' | 'disconnected';

const SureSendTile = () => (
    <div className="connection-tile connection-tile--suresend">
        <img src={suresendIcon} alt="SureSend" width={26} height={26} style={{ objectFit: 'contain' }} />
    </div>
);

const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
const WarnTriangleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>
);
const UnlinkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.4 5.6 5.6 18.4M9.5 4.2A8 8 0 0 1 19.8 14.5M14.5 19.8A8 8 0 0 1 4.2 9.5" /></svg>
);

interface Props {
    open: boolean;
    onClose: () => void;
    onReconnect: () => void;
}

export default function SureSendManageModal({ open, onClose, onReconnect }: Props) {
    const [state, setState] = useState<ManageState>('manage');

    const { globalUser, updateGlobalUser } = useAuth();
    const { disconnectSureSend } = useSureSend();
    const { showToast } = useToast();

    useEffect(() => {
        if (!open) setState('manage');
    }, [open]);

    const handleOpenChange = (next: boolean) => {
        if (next || state === 'disconnecting') return;
        onClose();
    };

    const handleDisconnect = async () => {
        if (state === 'disconnecting') return;
        setState('disconnecting');
        try {
            await disconnectSureSend();
            if (globalUser) await updateGlobalUser(globalUser.email);
            setState('disconnected');
        } catch (error: any) {
            Sentry.captureException(
                Object.assign(new Error('SureSend disconnect failed in UI'), {
                    httpStatus: error?.response?.status,
                    cause: error,
                })
            );
            showToast('error', 'Failed to disconnect SureSend');
            setState('confirm');
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="p-0 gap-0 border-0 bg-transparent shadow-none max-w-[460px] w-full">
                <div className="suresend-manage" data-state={state}>
                    <div className="ssm-manage-view">
                        <div className="ssm-pad">
                            <div className="ssm-head">
                                <SureSendTile />
                                <div className="ssm-head-text">
                                    <div className="ssm-head-row">
                                        <DialogTitle className="ssm-h1">SureSend</DialogTitle>
                                        <span className="connection-status connection-status--connected">
                                            <span className="connection-status-dot" />
                                            Connected
                                        </span>
                                    </div>
                                    <p className="ssm-sub">Real-estate CRM</p>
                                </div>
                            </div>

                            <p className="ssm-lede">Sayso is pushing call summaries and contacts into the matching lead in SureSend.</p>

                            {globalUser?.suresend_account_email && (
                                <div className="ssm-meta">
                                    <div className="ssm-meta-row">
                                        <span className="ssm-k"><MailIcon /> Linked account</span>
                                        <span className="ssm-v">{globalUser.suresend_account_email}</span>
                                    </div>
                                </div>
                            )}

                            <div className="ssm-rule" />

                            <div className="ssm-danger">
                                <h2 className="ssm-danger-title">Disconnect</h2>
                                <p className="ssm-danger-desc">Sayso will stop sending data to SureSend. Reconnecting later will require you to re-authorize the app.</p>

                                <div className="ssm-danger-actions">
                                    <button type="button" className="ssm-btn ssm-btn-danger-soft" onClick={() => setState('confirm')}>
                                        Disconnect SureSend
                                    </button>
                                </div>

                                <div className="ssm-confirm">
                                    <div className="ssm-confirm-head">
                                        <WarnTriangleIcon /> Disconnect SureSend?
                                    </div>
                                    <p className="ssm-confirm-text">Syncing stops immediately. Records already pushed to SureSend stay there.</p>
                                    <div className="ssm-confirm-actions">
                                        <button
                                            type="button"
                                            className="ssm-btn ssm-btn-ghost"
                                            onClick={() => setState('manage')}
                                            disabled={state === 'disconnecting'}
                                        >
                                            Keep connected
                                        </button>
                                        <button
                                            type="button"
                                            className="ssm-btn ssm-btn-danger"
                                            onClick={handleDisconnect}
                                            disabled={state === 'disconnecting'}
                                        >
                                            {state === 'disconnecting' ? (<><span className="ssm-spinner" />Disconnecting…</>) : 'Disconnect'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ssm-done">
                        <div className="ssm-done-icon" aria-hidden="true"><UnlinkIcon /></div>
                        <h2>SureSend disconnected</h2>
                        <p>Sayso has stopped sending data to SureSend. You can reconnect any time from the Connections page.</p>
                        <div className="ssm-done-actions">
                            <button type="button" className="ssm-btn ssm-btn-ghost" onClick={onClose}>Close</button>
                            <button type="button" className="ssm-btn ssm-btn-primary" onClick={onReconnect}>Reconnect</button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useSureSend } from "@/hooks/useSureSend";
import { openExternal } from "@/utils/helpers/openExternal";
import suresendIcon from '/assets/suresend-icon-color.svg';

type ModalState = 'default' | 'validating' | 'error' | 'success';

const DEFAULT_ERROR = "That token wasn't recognized. Check it was copied in full and try again.";

const SureSendTile = () => (
    <div className="connection-tile connection-tile--suresend">
        <img src={suresendIcon} alt="SureSend" width={26} height={26} style={{ objectFit: 'contain' }} />
    </div>
);

const EyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);
const EyeOffIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 5.2A9.5 9.5 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.2 6.2A17 17 0 0 0 2 12s3.5 7 10 7a9.5 9.5 0 0 0 3-.5" /></svg>
);
const LockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);
const WarnIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
);
const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>
);

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function SureSendConnectModal({ open, onClose }: Props) {
    const [token, setToken] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [state, setState] = useState<ModalState>('default');
    const [errorMsg, setErrorMsg] = useState(DEFAULT_ERROR);

    const { globalUser, updateGlobalUser } = useAuth();
    const { connectSureSend } = useSureSend();

    useEffect(() => {
        if (!open) {
            setToken('');
            setShowToken(false);
            setState('default');
            setErrorMsg(DEFAULT_ERROR);
        }
    }, [open]);

    const handleOpenChange = (next: boolean) => {
        if (next || state === 'validating') return;
        onClose();
    };

    const handleConnect = async () => {
        if (!globalUser || !token.trim() || state === 'validating') return;
        setState('validating');
        try {
            await connectSureSend(token.trim());
            await updateGlobalUser(globalUser.email);
            setState('success');
        } catch (err: any) {
            const httpStatus = err?.response?.status;
            const isInvalid = httpStatus === 401;
            setErrorMsg(isInvalid ? DEFAULT_ERROR : 'Something went wrong. Please try again.');
            setState('error');
            Sentry.captureException(
                Object.assign(new Error('SureSend connect failed in UI'), {
                    httpStatus,
                    code: isInvalid ? 'INVALID_TOKEN' : 'CONNECT_ERROR',
                }),
                { level: isInvalid ? 'warning' : 'error' }
            );
        }
    };

    const onInput = (value: string) => {
        setToken(value);
        if (state === 'error') setState('default');
    };

    const connectDisabled = state === 'validating' || !token.trim();

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="p-0 gap-0 border-0 bg-transparent shadow-none max-w-[472px] w-full">
                <div className="suresend-modal" data-state={state}>
                    <div className="ss-default-view">
                        <div className="ss-pad">
                            <div className="ss-head">
                                <SureSendTile />
                                <div>
                                    <DialogTitle className="ss-h1">Connect SureSend</DialogTitle>
                                    <p className="ss-sub">Real-estate CRM</p>
                                </div>
                            </div>

                            <DialogDescription className="ss-lede">
                                Paste a SureSend API token to link your account. Call summaries and contacts will sync to the matching lead.
                            </DialogDescription>

                            <ol className="ss-steps">
                                <li>
                                    Log in to SureSend at{' '}
                                    <button type="button" className="ss-link" onClick={() => openExternal('https://suresend.ai/')}>
                                        suresend.ai
                                    </button>
                                </li>
                                <li>Open <b>Settings → API Tokens</b></li>
                                <li>Click <b>Create token</b> — choose <span className="ss-kbd">Team</span> for admins, or <span className="ss-kbd">Personal</span> for individual accounts</li>
                                <li>Copy the token. SureSend shows it <span className="ss-once">only once</span></li>
                            </ol>

                            <div className="ss-field-wrap">
                                <label className="ss-field-label" htmlFor="suresend-token">API token</label>
                                <div className="ss-field">
                                    <input
                                        id="suresend-token"
                                        type={showToken ? 'text' : 'password'}
                                        placeholder="Paste your API token"
                                        autoComplete="off"
                                        spellCheck={false}
                                        value={token}
                                        disabled={state === 'validating'}
                                        onChange={e => onInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter' && !connectDisabled) handleConnect(); }}
                                    />
                                    <button
                                        type="button"
                                        className="ss-reveal"
                                        onClick={() => setShowToken(v => !v)}
                                        tabIndex={-1}
                                        aria-label={showToken ? 'Hide token' : 'Show token'}
                                    >
                                        {showToken ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                                {state === 'error' ? (
                                    <p className="ss-hint ss-hint--error"><WarnIcon /> {errorMsg}</p>
                                ) : (
                                    <p className="ss-hint"><LockIcon /> Stored encrypted. We never display it again.</p>
                                )}
                            </div>
                        </div>

                        <div className="ss-foot">
                            <button
                                type="button"
                                className="ss-btn ss-btn-ghost"
                                onClick={() => handleOpenChange(false)}
                                disabled={state === 'validating'}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="ss-btn ss-btn-primary"
                                onClick={handleConnect}
                                disabled={connectDisabled}
                            >
                                {state === 'validating' ? (<><span className="ss-spinner" />Connecting…</>) : 'Connect'}
                            </button>
                        </div>
                    </div>

                    <div className="ss-success">
                        <div className="ss-check" aria-hidden="true"><CheckIcon /></div>
                        <h2>SureSend connected</h2>
                        <p>Your account is linked. New call summaries and contacts will start syncing within a few minutes.</p>
                        <div className="ss-foot">
                            <button type="button" className="ss-btn ss-btn-primary" onClick={() => handleOpenChange(false)}>Done</button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

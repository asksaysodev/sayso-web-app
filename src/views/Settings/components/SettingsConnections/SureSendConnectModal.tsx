import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import { Eye, EyeOff, Lock, CircleAlert, Check } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useSureSend } from "@/hooks/useSureSend";
import { openExternal } from "@/utils/helpers/openExternal";
import SaysoButton from "@/components/SaysoButton";
import SureSendTile from "./SureSendTile";

type ModalState = 'default' | 'validating' | 'error' | 'success';

const DEFAULT_ERROR = "That token wasn't recognized. Check it was copied in full and try again.";

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
            const isInvalid = httpStatus === 422;
            setErrorMsg(isInvalid ? DEFAULT_ERROR : 'Something went wrong. Please try again.');
            setState('error');
            Sentry.captureException(
                Object.assign(new Error('Sure Send connect failed in UI'), {
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
            <DialogContent className="p-0 gap-0 border-0 bg-transparent shadow-none max-w-[560px] w-full">
                <div className="suresend-modal" data-state={state}>
                    <div className="ss-default-view">
                        <div className="ss-pad">
                            <div className="ss-head">
                                <SureSendTile />
                                <div>
                                    <DialogTitle className="ss-h1">Connect Sure Send</DialogTitle>
                                    <p className="ss-sub">Real-estate CRM</p>
                                </div>
                            </div>

                            <DialogDescription className="ss-lede">
                                Paste a Sure Send API token to link your account. Call summaries and contacts will sync to the matching lead.
                            </DialogDescription>

                            <ol className="ss-steps">
                                <li>
                                    Log in to Sure Send at{' '}
                                    <button type="button" className="ss-link" onClick={() => openExternal('https://suresend.ai/')}>
                                        suresend.ai
                                    </button>
                                </li>
                                <li>Open <b>Settings → API Tokens</b></li>
                                <li>Click <b>Create Token</b> — we recommend using <span className="ss-kbd">Team</span> scope</li>
                                <li>Copy the token. Sure Send shows it only once</li>
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
                                        {showToken ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                                {state === 'error' ? (
                                    <p className="ss-hint ss-hint--error"><CircleAlert /> {errorMsg}</p>
                                ) : (
                                    <p className="ss-hint"><Lock /> Stored encrypted. We never display it again.</p>
                                )}
                            </div>
                        </div>

                        <div className="ss-foot">
                            <SaysoButton
                                label="Cancel"
                                variant="outlined"
                                size="sm"
                                onClick={() => handleOpenChange(false)}
                                disabled={state === 'validating'}
                            />
                            <SaysoButton
                                label="Connect"
                                variant="sayso-indigo"
                                size="sm"
                                onClick={handleConnect}
                                disabled={connectDisabled}
                                loading={state === 'validating'}
                                loadingLabel="Connecting…"
                            />
                        </div>
                    </div>

                    <div className="ss-success">
                        <div className="ss-check" aria-hidden="true"><Check /></div>
                        <h2>Sure Send connected</h2>
                        <p>Your account is linked. New call summaries and contacts will start syncing within a few minutes.</p>
                        <div className="ss-foot">
                            <SaysoButton label="Done" variant="sayso-indigo" size="sm" onClick={() => handleOpenChange(false)} />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

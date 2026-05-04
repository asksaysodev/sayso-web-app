import { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import ButtonSpinner from '@/components/ButtonSpinner';
import { validateEmail } from '@/utils/helpers/validateEmail';
import apiClient from '@/config/axios';

const COOLDOWN_SECONDS = 30;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultEmail?: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function MobileSendLinkModal({ open, onOpenChange, defaultEmail = '' }: Props) {
    const [email, setEmail] = useState(defaultEmail);
    const [status, setStatus] = useState<Status>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!open) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setStatus('idle');
            setErrorMsg('');
            setCooldown(0);
            setEmail(defaultEmail);
        }
    }, [open, defaultEmail]);

    const startCooldown = () => {
        setCooldown(COOLDOWN_SECONDS);
        intervalRef.current = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSend = async () => {
        if (!validateEmail(email) || status === 'loading' || cooldown > 0) return;
        setStatus('loading');
        setErrorMsg('');
        try {
            await apiClient.post('/download/send-links', { email: email.trim() });
            setStatus('success');
            setEmail('');
            startCooldown();
        } catch {
            setStatus('error');
            setErrorMsg('Something went wrong. Please try again.');
            setStatus('idle');
        }
    };

    const isEmailValid = validateEmail(email);
    const isDisabled = !isEmailValid || status === 'loading' || cooldown > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[340px] rounded-2xl p-6 gap-5 [&>button:first-of-type]:hidden">
                <DialogHeader className="gap-2 text-left">
                    <DialogTitle className="text-[22px] font-bold leading-snug tracking-tight">
                        Want the download link sent to your inbox?
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        Sayso is a macOS desktop app — it can't be installed from a phone. We'll send a one-click download link to your email so you can get started from your Mac.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setStatus('idle'); setErrorMsg(''); }}
                        className="h-11 text-base rounded-lg focus-visible:ring-2 focus-visible:ring-[#2367EE] focus-visible:ring-offset-2"
                        disabled={status === 'loading'}
                    />
                    {status === 'success' && cooldown > 0 && (
                        <p className="text-xs text-muted-foreground">
                            Link sent! Check your inbox. You can try again in {cooldown}s.
                        </p>
                    )}
                    {errorMsg && (
                        <p className="text-xs text-red-500">{errorMsg}</p>
                    )}
                    <button
                        onClick={handleSend}
                        disabled={isDisabled}
                        className="w-full h-12 rounded-xl text-white text-[15px] font-semibold flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                        style={{ backgroundColor: isDisabled ? '#9ca3af' : '#2367EE' }}
                    >
                        {status === 'loading' ? <ButtonSpinner size={18} /> : 'Send me the Link'}
                    </button>
                    <DialogClose asChild>
                        <button className="w-full text-sm text-muted-foreground py-1">
                            Cancel
                        </button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}

import { useEffect, useState } from 'react';
import { Check, CircleAlert, Copy, Gift, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { useToast } from '@/context/ToastContext';
import useReferralLink from '../hooks/useReferralLink';
import SettingsCard, { SettingsCardTile } from './SettingsCard';

const COPIED_MS = 2000;

export default function SettingsReferralForm() {
    const { showToast } = useToast();
    const { referralLink, isLoading, isError, refetch } = useReferralLink();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timer = setTimeout(() => setCopied(false), COPIED_MS);
        return () => clearTimeout(timer);
    }, [copied]);

    const handleCopy = async () => {
        if (!referralLink) return;
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            showToast('success', 'Referral link copied!');
        } catch {
            showToast('error', "Couldn't copy the link. Select it and copy manually.");
        }
    };

    const renderLink = () => {
        if (isLoading) {
            return (
                <div className='referral-link referral-link--state'>
                    <LoaderCircle size={16} className='referral-link__spinner' aria-hidden />
                    Loading your referral link…
                </div>
            );
        }
        if (isError || !referralLink) {
            return (
                <div className='referral-link referral-link--state referral-link--error'>
                    <CircleAlert size={16} aria-hidden />
                    <span>Couldn't load your referral link.</span>
                    <Button variant='secondary' size='sm' onClick={() => refetch()}>
                        Try again
                    </Button>
                </div>
            );
        }
        return (
            <div className='referral-link'>
                <span className='referral-link__url' title={referralLink}>
                    {referralLink}
                </span>
                <Button
                    variant='secondary'
                    size='sm'
                    leftIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                    onClick={handleCopy}
                >
                    {copied ? 'Copied' : 'Copy link'}
                </Button>
            </div>
        );
    };

    return (
        <SettingsCard
            className='referral-card'
            tile={
                <SettingsCardTile>
                    <Gift size={24} aria-hidden />
                </SettingsCardTile>
            }
            title='Your referral link'
            description='Share your unique link and earn rewards when friends subscribe to Sayso.'
        >
            {renderLink()}
        </SettingsCard>
    );
}

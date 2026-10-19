import { CircleAlert, Gift, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { CopyBox } from '@/components/ds/CopyBox';
import { useToast } from '@/context/ToastContext';
import useReferralLink from '../hooks/useReferralLink';
import SettingsCard, { SettingsCardTile } from './SettingsCard';

export default function SettingsReferralForm() {
    const { showToast } = useToast();
    const { referralLink, isLoading, isError, refetch } = useReferralLink();

    const renderLink = () => {
        if (isLoading) {
            return (
                <div className='referral-link--state'>
                    <LoaderCircle size={16} className='referral-link__spinner' aria-hidden />
                    Loading your referral link…
                </div>
            );
        }
        if (isError || !referralLink) {
            return (
                <div className='referral-link--state referral-link--error'>
                    <CircleAlert size={16} aria-hidden />
                    <span>Couldn't load your referral link.</span>
                    <Button variant='secondary' size='sm' onClick={() => refetch()}>
                        Try again
                    </Button>
                </div>
            );
        }
        return (
            <CopyBox
                value={referralLink}
                copyLabel='Copy link'
                onCopied={() => showToast('success', 'Referral link copied!')}
                onCopyError={() => showToast('error', "Couldn't copy the link. Select it and copy manually.")}
            />
        );
    };

    return (
        <div className='settings-cards-grid'>
            <SettingsCard
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
        </div>
    );
}

import { useState } from 'react';
import { LuCopy, LuCheck, LuCircleAlert } from 'react-icons/lu';
import { useToast } from '@/context/ToastContext';
import useReferralLink from '../hooks/useReferralLink';

export default function SettingsReferralForm() {
    const { showToast } = useToast();
    const { referralLink, isLoading, isError, error, refetch } = useReferralLink();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!referralLink) return;
        await navigator.clipboard.writeText(referralLink);
        setCopied(true);
        showToast('success', 'Referral link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className='settings-referral'>
            {isLoading && (
                <div className='settings-referral-loading'>
                    <div className='team-members-loader' />
                    <span>Loading your referral link...</span>
                </div>
            )}
            {isError && (
                <div className='settings-referral-error'>
                    <LuCircleAlert size={16} />
                    <span>{"Couldn't load your referral link. Please try again or contact support."}</span>
                    <button onClick={() => refetch()} className='settings-referral-retry-btn'>
                        Retry
                    </button>
                </div>
            )}
            {!isLoading && !isError && referralLink && (
                <div className='settings-referral-link-wrapper'>
                <div className='form-line-input-container editable'>
                    <input
                        type='text'
                        readOnly
                        value={referralLink}
                        onFocus={e => e.target.select()}
                    />
                    <button
                        type='button'
                        onClick={handleCopy}
                        className='mfa-copy-btn'
                        title='Copy referral link'
                    >
                        {copied ? <LuCheck size={16} /> : <LuCopy size={16} />}
                    </button>
                </div>
                </div>
            )}
        </div>
    );
}

import { useQuery } from '@tanstack/react-query';
import { LuCircleAlert } from 'react-icons/lu';
import getAccountUsage from '@/services/getAccountUsage';

function formatPeriodEnd(periodEnd: string): string {
    return new Date(periodEnd).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function SettingsUsage() {
    const { data: accountUsage, isLoading, isError, refetch } = useQuery({
        queryKey: ['settings-account-usage'],
        queryFn: getAccountUsage,
    });

    return (
        <div className='settings-usage'>
            {isLoading && (
                <div className='settings-usage-loading'>
                    <div className='team-members-loader' />
                    <span>Loading your usage...</span>
                </div>
            )}
            {isError && (
                <div className='settings-usage-error'>
                    <LuCircleAlert size={16} />
                    <span>{"Couldn't load your usage. Please try again or contact support."}</span>
                    <button onClick={() => refetch()} className='settings-usage-retry-btn'>
                        Retry
                    </button>
                </div>
            )}
            {!isLoading && !isError && accountUsage && (
                <p className='settings-usage-summary'>
                    {"You've used "}<strong>{accountUsage.usedMinutes}</strong>{accountUsage.usedMinutes === 1 ? ' minute' : ' minutes'} this period
                    {accountUsage.periodEnd && (
                        <>, which ends on <strong>{formatPeriodEnd(accountUsage.periodEnd)}</strong></>
                    )}
                </p>
            )}
        </div>
    );
}

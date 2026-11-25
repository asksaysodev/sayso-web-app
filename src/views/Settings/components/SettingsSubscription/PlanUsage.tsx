import { useQuery } from '@tanstack/react-query';
import { PiSpeedometer } from 'react-icons/pi';
import getAccountUsage from '@/services/getAccountUsage';
import { formatBillingDate } from './utils';

/** Minutes used in the current period. */
export default function PlanUsage() {
    const { data: usage, isPending: isUsagePending } = useQuery({
        queryKey: ['settings-account-usage'],
        queryFn: getAccountUsage,
    });

    return (
        <>
            {isUsagePending && (
                <p className='plan-card__usage' aria-busy='true' aria-label='Loading usage'>
                    <PiSpeedometer size={20} aria-hidden />
                    {/* nbsp gives the row the real text's line height, so nothing shifts on load */}
                    <span className='plan-card__usage-placeholder' aria-hidden>
                        {'\u00a0'}
                        <span className='skeleton plan-card__usage-skeleton' />
                    </span>
                </p>
            )}
            {usage && (
                <p className='plan-card__usage'>
                    <PiSpeedometer size={20} aria-hidden />
                    <span>
                        {`You've used ${usage.usedMinutes} ${usage.usedMinutes === 1 ? 'minute' : 'minutes'} this period`}
                        {usage.periodEnd && `, which ends on ${formatBillingDate(usage.periodEnd, 'MMMM D, YYYY')}`}
                    </span>
                </p>
            )}
        </>
    );
}

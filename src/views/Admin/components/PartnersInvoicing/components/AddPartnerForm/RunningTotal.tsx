import { calculatePartnerTotals, parseDiscountPercent } from './helpers/calculateRunningTotal';
import { formatInvoiceAmount } from '../../helpers/formatInvoiceAmount';
import type { TeamPlanOption } from './types';
import './styles/RunningTotal.css';

interface Props {
    plans: TeamPlanOption[];
    watchedTeams: Array<{ email: string; planOptionId: string }>;
    netTerms: string;
    discountPercent: string;
}

export default function RunningTotal({ plans, watchedTeams, netTerms, discountPercent }: Props) {
    const percent = parseDiscountPercent(discountPercent);
    const { subtotalCents, discountCents, totalCents } = calculatePartnerTotals(watchedTeams, plans, percent);
    const count = watchedTeams.length;

    return (
        <div className="running-total">
            {percent > 0 && (
                <div className="running-total__breakdown">
                    <div className="running-total__breakdown-row">
                        <span>Subtotal</span>
                        <span>{formatInvoiceAmount(subtotalCents, 'usd')}</span>
                    </div>
                    <div className="running-total__breakdown-row running-total__breakdown-row--discount">
                        <span>Discount ({percent}%)</span>
                        <span>−{formatInvoiceAmount(discountCents, 'usd')}</span>
                    </div>
                </div>
            )}
            <div className="running-total__summary">
                <span className="running-total__label">
                    {count} {count === 1 ? 'team' : 'teams'} · Net {netTerms}
                </span>
                <span className="running-total__amount">
                    {formatInvoiceAmount(totalCents, 'usd')}/mo
                </span>
            </div>
        </div>
    );
}

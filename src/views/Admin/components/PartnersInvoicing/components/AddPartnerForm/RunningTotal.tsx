import { calculateRunningTotal } from './helpers/calculateRunningTotal';
import { formatInvoiceAmount } from '../../helpers/formatInvoiceAmount';
import type { TeamPlanOption } from './types';
import './styles/RunningTotal.css';

interface Props {
    plans: TeamPlanOption[];
    watchedTeams: Array<{ email: string; planOptionId: string }>;
    netTerms: string;
}

export default function RunningTotal({ plans, watchedTeams, netTerms }: Props) {
    const totalCents = calculateRunningTotal(watchedTeams, plans);
    const count = watchedTeams.length;

    return (
        <div className="running-total">
            <span className="running-total__label">
                {count} {count === 1 ? 'team' : 'teams'} · Net {netTerms}
            </span>
            <span className="running-total__amount">
                {formatInvoiceAmount(totalCents, 'usd')}/mo
            </span>
        </div>
    );
}

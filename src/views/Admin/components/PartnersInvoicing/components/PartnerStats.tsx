import { Invitation } from '../types';
import '../styles/PartnerStats.css';

interface Props {
    invitations: Invitation[];
    netTerms: number;
}

export default function PartnerStats({ invitations, netTerms }: Props) {
    const total = invitations.length;
    const claimed = invitations.filter(i => i.status === 'claimed').length;
    const progressPct = total > 0 ? Math.round((claimed / total) * 100) : 0;

    return (
        <div className="partner-stats">
            <div className="partner-stats__tile">
                <span className="partner-stats__label">Net terms</span>
                <span className="partner-stats__value">Net {netTerms}</span>
            </div>
            <div className="partner-stats__tile">
                <span className="partner-stats__label">Funded teams</span>
                <span className="partner-stats__value">
                    {total} {total === 1 ? 'team' : 'teams'}
                </span>
            </div>
            <div className="partner-stats__tile partner-stats__tile--progress">
                <div className="partner-stats__tile-top">
                    <span className="partner-stats__label">Claimed</span>
                    <span className="partner-stats__summary">{claimed} / {total}</span>
                </div>
                <div className="partner-stats__progress-track">
                    <div
                        className={`partner-stats__progress-fill${progressPct === 100 ? ' partner-stats__progress-fill--complete' : ''}`}
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

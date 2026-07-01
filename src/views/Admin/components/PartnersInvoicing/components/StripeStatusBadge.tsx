import { StripeStatus } from '../types';
import { stripeStatusTone } from '../helpers/stripeStatusTone';
import { formatStripeStatusLabel } from '../helpers/formatStatusLabel';
import '../styles/StripeStatusBadge.css';

interface Props {
    status: StripeStatus;
}

export default function StripeStatusBadge({ status }: Props) {
    const tone = stripeStatusTone(status);
    return (
        <span className={`partners-status-badge partners-status-badge--${tone}`}>
            <span className="partners-status-badge__dot" />
            {formatStripeStatusLabel(status)}
        </span>
    );
}

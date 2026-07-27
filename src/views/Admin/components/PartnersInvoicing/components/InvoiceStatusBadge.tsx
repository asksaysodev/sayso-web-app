import { InvoiceStatus } from '../types';
import { invoiceStatusTone } from '../helpers/invoiceStatusTone';
import { formatInvoiceStatusLabel } from '../helpers/formatStatusLabel';
import '../styles/InvoiceStatusBadge.css';

interface Props {
    status: InvoiceStatus;
    isOverdue: boolean;
}

export default function InvoiceStatusBadge({ status, isOverdue }: Props) {
    const tone = invoiceStatusTone(status, isOverdue);
    return (
        <span className={`invoice-status-badge invoice-status-badge--${tone}`}>
            <span className="invoice-status-badge__dot" />
            {formatInvoiceStatusLabel(status, isOverdue)}
        </span>
    );
}

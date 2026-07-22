import { PartnerInvoice } from '../types';
import { computeInvoiceStats } from '../helpers/computeInvoiceStats';
import { formatInvoiceAmount } from '../helpers/formatInvoiceAmount';
import '../styles/PartnerInvoiceStats.css';

interface Props {
    invoices: PartnerInvoice[];
}

export default function PartnerInvoiceStats({ invoices }: Props) {
    const { outstanding, paidYtd, pastDueCount, total, currency } = computeInvoiceStats(invoices);

    const tiles = [
        { label: 'Outstanding', value: formatInvoiceAmount(outstanding, currency), tone: outstanding > 0 ? 'amber' : 'default' },
        { label: 'Paid (YTD)', value: formatInvoiceAmount(paidYtd, currency), tone: 'default' },
        { label: 'Past due', value: String(pastDueCount), tone: pastDueCount > 0 ? 'red' : 'default' },
        { label: 'Total invoices', value: String(total), tone: 'default' },
    ];

    return (
        <div className="partner-invoice-stats">
            {tiles.map(tile => (
                <div key={tile.label} className="partner-invoice-stats__tile">
                    <span className="partner-invoice-stats__label">{tile.label}</span>
                    <span className={`partner-invoice-stats__value partner-invoice-stats__value--${tile.tone}`}>
                        {tile.value}
                    </span>
                </div>
            ))}
        </div>
    );
}

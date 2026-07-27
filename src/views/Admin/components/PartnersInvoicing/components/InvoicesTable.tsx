import { PartnerInvoice } from '../types';
import InvoiceRow from './InvoiceRow';
import { useResendInvoice } from '../hooks/useResendInvoice';
import '../styles/InvoicesTable.css';

interface Props {
    partnerId: string;
    invoices: PartnerInvoice[];
}

export default function InvoicesTable({ partnerId, invoices }: Props) {
    const { resend, resendState } = useResendInvoice(partnerId);

    return (
        <div className="invoices-table__scroll">
            <div className="invoices-table__inner">
                <div className="invoices-table__grid invoices-table__head">
                    <span className="invoices-table__col">Invoice</span>
                    <span className="invoices-table__col">Amount</span>
                    <span className="invoices-table__col">Status</span>
                    <span className="invoices-table__col">Created</span>
                    <span className="invoices-table__col">Due</span>
                    <span className="invoices-table__col invoices-table__col--right">Actions</span>
                </div>
                {invoices.map(invoice => (
                    <InvoiceRow
                        key={invoice.id}
                        invoice={invoice}
                        resendState={resendState(invoice.id)}
                        onResend={() => resend(invoice.id)}
                    />
                ))}
            </div>
        </div>
    );
}

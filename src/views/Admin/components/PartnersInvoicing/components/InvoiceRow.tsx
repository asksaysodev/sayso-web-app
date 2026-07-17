import dayjs from 'dayjs';
import { Download, Send, Loader2, Check } from 'lucide-react';
import { openExternal } from '@/utils/helpers/openExternal';
import { PartnerInvoice } from '../types';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import { formatInvoiceAmount } from '../helpers/formatInvoiceAmount';
import { ResendState } from '../hooks/useResendInvoice';
import '../styles/InvoiceRow.css';

interface Props {
    invoice: PartnerInvoice;
    resendState: ResendState;
    onResend: () => void;
}

export default function InvoiceRow({ invoice, resendState, onResend }: Props) {
    const { number, status, isOverdue, lineCount, amountDue, currency, createdAt, dueDate, invoicePdf } = invoice;
    const canResend = status === 'open' || status === 'draft';
    const isSending = resendState === 'sending';
    const isSent = resendState === 'sent';

    const dueClass = isOverdue
        ? 'partner-invoice-row__due partner-invoice-row__due--overdue'
        : dueDate
            ? 'partner-invoice-row__due'
            : 'partner-invoice-row__due partner-invoice-row__due--empty';

    return (
        <div className="invoices-table__grid partner-invoice-row">
            <div className="partner-invoice-row__id">
                <span className="partner-invoice-row__number">{number ?? '—'}</span>
                {lineCount > 0 && (
                    <span className="partner-invoice-row__plans">
                        {lineCount} {lineCount === 1 ? 'plan' : 'plans'}
                    </span>
                )}
            </div>
            <span className="partner-invoice-row__amount">{formatInvoiceAmount(amountDue, currency)}</span>
            <InvoiceStatusBadge status={status} isOverdue={isOverdue} />
            <span className="partner-invoice-row__created">
                {createdAt ? dayjs(createdAt).format('MMM D, YYYY') : '—'}
            </span>
            <span className={dueClass}>
                {dueDate ? dayjs(dueDate).format('MMM D, YYYY') : '—'}
            </span>
            <div className="partner-invoice-row__actions">
                {invoicePdf && (
                    <button
                        type="button"
                        className="partner-invoice-row__icon-button"
                        title="Download PDF"
                        onClick={() => openExternal(invoicePdf)}
                    >
                        <Download size={15} strokeWidth={2} />
                    </button>
                )}
                {canResend && (
                    <button
                        type="button"
                        className={`partner-invoice-row__resend${isSent ? ' partner-invoice-row__resend--sent' : ''}`}
                        onClick={onResend}
                        disabled={isSending || isSent}
                    >
                        {isSending && <Loader2 size={14} strokeWidth={2.2} className="partner-invoice-row__resend-spin" />}
                        {isSent && <Check size={14} strokeWidth={2.4} />}
                        {!isSending && !isSent && <Send size={14} strokeWidth={2} />}
                        {isSending ? 'Sending…' : isSent ? 'Sent' : 'Resend'}
                    </button>
                )}
            </div>
        </div>
    );
}

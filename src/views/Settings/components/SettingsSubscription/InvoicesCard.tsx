import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ds/Card';
import { Badge } from '@/components/ds/Badge';
import { Table, TableBody, TableCell, TableHeadCell, TableHeader, TableRow, TableStateRow } from '@/components/ds/Table';
import useSortableRows, { type Comparator } from '@/hooks/useSortableRows';
import { openExternal } from '@/utils/helpers/openExternal';
import { type Invoice, formatInvoiceDate, formatInvoiceTotal, invoiceStatusBadge } from './utils';

type InvoiceSortKey = 'date' | 'total' | 'status';

const COLUMNS: { key: InvoiceSortKey; label: string }[] = [
    { key: 'date', label: 'Date' },
    { key: 'total', label: 'Total' },
    { key: 'status', label: 'Status' },
];

const COLUMN_COUNT = COLUMNS.length + 1;

const amountOf = (invoice: Invoice) =>
    (invoice.status === 'paid' ? invoice.amount_paid_in_cents : invoice.amount_due_in_cents) ?? 0;

const INVOICE_COMPARATORS: Record<InvoiceSortKey, Comparator<Invoice>> = {
    date: (a, b) => (a.created_at ?? '').localeCompare(b.created_at ?? ''),
    total: (a, b) => amountOf(a) - amountOf(b),
    status: (a, b) => invoiceStatusBadge(a.status).rank - invoiceStatusBadge(b.status).rank,
};

interface Props {
    invoices: Invoice[];
}

export default function InvoicesCard({ invoices }: Props) {
    const { sortedRows, sortKey, direction, toggleSort } = useSortableRows(invoices, INVOICE_COMPARATORS, {
        key: 'date',
        direction: 'desc',
    });

    return (
        <Card className='subscription-card invoices-card'>
            <h2 className='subscription-card__title'>Invoices</h2>
            <Table className='subscription-invoices'>
                <TableHeader>
                    {COLUMNS.map(({ key, label }) => (
                        <TableHeadCell
                            key={key}
                            sortable
                            sortDirection={sortKey === key ? direction : undefined}
                            onSort={() => toggleSort(key)}
                        >
                            {label}
                        </TableHeadCell>
                    ))}
                    <TableHeadCell aria-label='View invoice' />
                </TableHeader>
                <TableBody>
                    {sortedRows.length === 0 ? (
                        <TableStateRow state='empty' colSpan={COLUMN_COUNT}>
                            No invoices to display
                        </TableStateRow>
                    ) : (
                        sortedRows.map((invoice, index) => {
                            const status = invoiceStatusBadge(invoice.status);
                            const url = invoice.url;
                            return (
                                <TableRow
                                    key={invoice.id ?? index}
                                    className={url ? 'subscription-invoices__row--link' : undefined}
                                    onClick={url ? () => openExternal(url) : undefined}
                                >
                                    <TableCell className='subscription-invoices__date'>{formatInvoiceDate(invoice)}</TableCell>
                                    <TableCell className='subscription-invoices__muted'>{formatInvoiceTotal(invoice)}</TableCell>
                                    <TableCell>
                                        <Badge tone={status.tone} solid>{status.label}</Badge>
                                    </TableCell>
                                    <TableCell className='subscription-invoices__chevron'>
                                        {url && (
                                            <button
                                                type='button'
                                                className='subscription-invoices__view'
                                                aria-label={`View invoice from ${formatInvoiceDate(invoice)}`}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    openExternal(url);
                                                }}
                                            >
                                                <ChevronRight size={16} aria-hidden />
                                            </button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}

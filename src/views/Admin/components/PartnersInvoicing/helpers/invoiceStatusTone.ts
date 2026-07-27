import { InvoiceStatus } from '../types';
import { StatusTone } from './stripeStatusTone';

const toneMap: Record<InvoiceStatus, StatusTone> = {
    paid: 'green',
    open: 'blue',
    draft: 'gray',
    uncollectible: 'red',
    void: 'gray',
};

export function invoiceStatusTone(status: InvoiceStatus, isOverdue: boolean): StatusTone {
    if (isOverdue) return 'red';
    return toneMap[status] ?? 'gray';
}

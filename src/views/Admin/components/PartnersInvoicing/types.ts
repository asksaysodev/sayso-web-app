export type StripeStatus = 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete';
export type InvitationStatus = 'pending' | 'claimed' | 'cancelled';

export interface Invitation {
    id: string;
    email: string;
    planName: string;
    teamSize: string;
    status: InvitationStatus;
    claimedAt: string | null;
}

export interface Partner {
    id: string;
    name: string;
    billingEmail: string;
    netTerms: number;
    stripeStatus: StripeStatus;
    invitations: Invitation[];
}

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';

export interface PartnerInvoice {
    id: string;
    number: string | null;
    status: InvoiceStatus;
    isOverdue: boolean;
    lineCount: number;
    amountDue: number;
    amountPaid: number;
    amountRemaining: number;
    currency: string;
    createdAt: string | null;
    dueDate: string | null;
    hostedInvoiceUrl: string | null;
    invoicePdf: string | null;
}

export interface PartnerInvoicesData {
    invoices: PartnerInvoice[];
    stripeCustomerUrl: string | null;
}

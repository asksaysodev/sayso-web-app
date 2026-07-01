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

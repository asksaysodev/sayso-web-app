import dayjs from 'dayjs';
import apiClient from '@/config/axios';
import { InvitationStatus, Partner, StripeStatus } from '../types';

interface PartnerInvitationResponse {
    id: string;
    email: string;
    plan_name: string | null;
    team_size: string | null;
    status: InvitationStatus;
    claimed_at: string | null;
}

interface PartnerResponse {
    id: string;
    name: string;
    billing_email: string;
    net_terms: number;
    subscription_status: string | null;
    invitations: PartnerInvitationResponse[];
}

export async function getPartners(): Promise<Partner[]> {
    const response = await apiClient.get('/admin/partners');
    if (!response?.data) throw new Error('Failed to fetch partners');

    const partners: PartnerResponse[] = response.data.data;

    return partners.map(partner => ({
        id: partner.id,
        name: partner.name,
        billingEmail: partner.billing_email,
        netTerms: partner.net_terms,
        stripeStatus: (partner.subscription_status ?? 'incomplete') as StripeStatus,
        invitations: partner.invitations.map(invitation => ({
            id: invitation.id,
            email: invitation.email,
            planName: invitation.plan_name ?? '—',
            teamSize: invitation.team_size ?? '—',
            status: invitation.status,
            claimedAt: invitation.claimed_at ? dayjs(invitation.claimed_at).format('MMM D, YYYY') : null,
        })),
    }));
}

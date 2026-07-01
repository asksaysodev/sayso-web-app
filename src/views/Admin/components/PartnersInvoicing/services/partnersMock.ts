import { Partner } from '../types';

export const PARTNERS_MOCK: Partner[] = [
    {
        id: 'fidelity',
        name: 'Fidelity',
        billingEmail: 'billing@fidelity.com',
        netTerms: 30,
        stripeStatus: 'active',
        invitations: [
            { id: 'inv-1', email: 'vendas@empresa-a.com', planName: 'Team Plan', teamSize: 'Up to 7 agents', status: 'claimed', claimedAt: 'Jun 15, 2026' },
            { id: 'inv-2', email: 'admin@empresa-b.com', planName: 'Team Plan', teamSize: 'Up to 7 agents', status: 'claimed', claimedAt: 'Jun 18, 2026' },
            { id: 'inv-3', email: 'ops@empresa-c.com', planName: 'Team Plan', teamSize: 'Up to 7 agents', status: 'pending', claimedAt: null },
        ],
    },
    {
        id: 'acme',
        name: 'Acme Corp',
        billingEmail: 'billing@acme.com',
        netTerms: 15,
        stripeStatus: 'past_due',
        invitations: [
            { id: 'inv-4', email: 'admin@startup-x.com', planName: 'Starter Plan', teamSize: 'Up to 3 agents', status: 'claimed', claimedAt: 'Jun 20, 2026' },
            { id: 'inv-5', email: 'team@startup-y.com', planName: 'Team Plan', teamSize: 'Up to 7 agents', status: 'cancelled', claimedAt: null },
        ],
    },
    {
        id: 'globex',
        name: 'Globex',
        billingEmail: 'ap@globex.com',
        netTerms: 60,
        stripeStatus: 'active',
        invitations: [
            { id: 'inv-6', email: 'it@globex-sub.com', planName: 'Team Plan', teamSize: 'Up to 7 agents', status: 'pending', claimedAt: null },
        ],
    },
];

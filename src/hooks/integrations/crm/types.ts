export type CrmProviderId = 'fub';

export interface CrmLead {
    id: string;
    name: string;
    firstName: string | null;
    lastName: string | null;
    primaryEmail: string | null;
    primaryPhone: string | null;
    stage: string | null;
    providerId: CrmProviderId;
}

export interface CrmLeadsPage {
    leads: CrmLead[];
    nextOffset: number | null;
    total: number;
}

export interface CrmConnection {
    isConnected: boolean;
    providerId: CrmProviderId | null;
    providerLabel: string | null;
}

export interface CrmCreateLeadInput {
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

export interface CrmProvider {
    id: CrmProviderId;
    label: string;
    fetchLeads: (params: { search?: string; limit: number; offset: number }) => Promise<CrmLeadsPage>;
    createLead: (input: CrmCreateLeadInput) => Promise<CrmLead>;
}

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
    nextOffset: number | null; // null = no more pages
    total: number;
}

export interface CrmConnection {
    isConnected: boolean;
    providerId: CrmProviderId | null;
    providerLabel: string | null;
}

// Contract every provider adapter must implement
export interface CrmProvider {
    id: CrmProviderId;
    label: string;
    fetchLeads: (params: { search?: string; limit: number; offset: number }) => Promise<CrmLeadsPage>;
}

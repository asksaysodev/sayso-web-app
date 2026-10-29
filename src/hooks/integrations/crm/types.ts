export type CrmProviderId = 'fub' | 'suresend';

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
    stage?: string;
}

export interface CrmProvider {
    id: CrmProviderId;
    label: string;
    fetchLeads: (params: { search?: string; limit: number; offset: number }) => Promise<CrmLeadsPage>;
    createLead: (input: CrmCreateLeadInput) => Promise<CrmLead>;
    getLead: (id: string) => Promise<CrmLeadDetail>;
    updateLead: (id: string, input: CrmUpdateLeadInput) => Promise<CrmUpdateLeadResult>;
    /**
     * Resolves the lead's page URL in the CRM, or null when it can't be built.
     * `fetchLeadUrlContext` (if present) supplies provider data needed to build it
     * (e.g. the FUB account domain); it is only called when the URL is needed.
     */
    fetchLeadUrlContext?: () => Promise<string | null>;
    buildLeadUrl: (id: string, context: string | null) => string | null;
}

export interface CrmLeadDetail {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
}

export interface CrmUpdateLeadInput {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
}

export interface CrmUpdateLeadResult {
    lead: CrmLeadDetail;
    crmLeadName: string;
}

import getFubLeads from '@/services/integrations/fub/getFubLeads';
import type { FubLead } from '@/types/fub';
import type { CrmLead, CrmLeadsPage, CrmProvider } from '../types';

function normalizeFubLead(lead: FubLead): CrmLead {
    const primaryEmail =
        lead.emails?.find(e => e.isPrimary)?.value ??
        lead.emails?.[0]?.value ??
        null;
    const primaryPhone =
        lead.phones?.find(e => e.isPrimary)?.value ??
        lead.phones?.[0]?.value ??
        null;
    return {
        id: String(lead.id),
        name: lead.name,
        firstName: lead.firstName,
        lastName: lead.lastName,
        primaryEmail: primaryEmail ?? null,
        primaryPhone: primaryPhone ?? null,
        stage: lead.stage,
        providerId: 'fub',
    };
}

export const fubProvider: CrmProvider = {
    id: 'fub',
    label: 'Follow Up Boss',
    fetchLeads: async ({ search, limit, offset }) => {
        const params = search
            ? { query: search, limit, offset }
            : { limit, offset };
        const response = await getFubLeads(params);
        const meta = response._metadata;
        const nextOffset =
            meta && meta.offset + meta.limit < meta.total
                ? meta.offset + meta.limit
                : null;
        return {
            leads: response.leads.map(normalizeFubLead),
            nextOffset,
            total: meta?.total ?? 0,
        };
    },
};

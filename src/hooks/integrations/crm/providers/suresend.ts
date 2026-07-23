import getSureSendPeople from '@/services/integrations/suresend/getSureSendPeople';
import createSureSendLead from '@/services/integrations/suresend/createSureSendLead';
import type { SureSendPerson } from '@/services/integrations/suresend/getSureSendPeople';
import type { CrmCreateLeadInput, CrmLead, CrmProvider } from '../types';
import { crmReauthErrorFrom } from '../errors';

function normalizeSureSendPerson(person: SureSendPerson): CrmLead {
    const primaryEmail =
        person.emails?.find(e => e.isPrimary)?.value ??
        person.emails?.[0]?.value ??
        null;
    const primaryPhone =
        person.phones?.find(e => e.isPrimary)?.value ??
        person.phones?.[0]?.value ??
        null;
    return {
        id: String(person.id),
        name: person.name ?? [person.firstName, person.lastName].filter(Boolean).join(' '),
        firstName: person.firstName ?? null,
        lastName: person.lastName ?? null,
        primaryEmail: primaryEmail ?? null,
        primaryPhone: primaryPhone ?? null,
        stage: person.stage ?? null,
        providerId: 'suresend',
    };
}

export const suresendProvider: CrmProvider = {
    id: 'suresend',
    label: 'SureSend',

    fetchLeads: async ({ search, limit, offset }) => {
        const page = Math.floor(offset / limit) + 1;
        const params = search
            ? { email: search, page, limit }
            : { page, limit };
        try {
            const response = await getSureSendPeople(params);
            const meta = response.meta;
            const nextOffset =
                meta && meta.current_page < meta.total_pages
                    ? offset + limit
                    : null;
            return {
                leads: response.people.map(normalizeSureSendPerson),
                nextOffset,
                total: meta?.total_count ?? 0,
            };
        } catch (error) {
            throw crmReauthErrorFrom(error, 'suresend');
        }
    },

    createLead: async (input: CrmCreateLeadInput): Promise<CrmLead> => {
        try {
            const person = await createSureSendLead({
                firstName: input.firstName,
                lastName: input.lastName ?? '',
                email: input.email ?? '',
                phone: input.phone ?? '',
                stage: input.stage ?? '',
            });
            return normalizeSureSendPerson(person);
        } catch (error) {
            throw crmReauthErrorFrom(error, 'suresend');
        }
    },
};

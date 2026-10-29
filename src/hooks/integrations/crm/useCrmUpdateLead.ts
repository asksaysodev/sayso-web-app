import { useMutation } from '@tanstack/react-query';
import { getProvider } from './providers/registry';
import type { CrmProviderId, CrmUpdateLeadInput, CrmUpdateLeadResult } from './types';

/** Mutation that edits a linked CRM person (name / email / phone) in the given provider. */
export default function useCrmUpdateLead(providerId: CrmProviderId | null, leadId: string | null) {
    const { mutateAsync: updateLead, isPending } = useMutation({
        mutationFn: (input: CrmUpdateLeadInput): Promise<CrmUpdateLeadResult> => {
            if (!providerId || !leadId) throw new Error('No linked lead');
            return getProvider(providerId).updateLead(leadId, input);
        },
    });
    return { updateLead, isPending };
}

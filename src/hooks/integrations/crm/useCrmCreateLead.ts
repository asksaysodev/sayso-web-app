import { useMutation } from '@tanstack/react-query';
import useCrmConnection from './useCrmConnection';
import { getProvider } from './providers/registry';
import type { CrmCreateLeadInput, CrmLead } from './types';

/**
 * Mutation hook that creates a new lead in the active CRM provider.
 * Provider-agnostic — resolves the adapter from the registry at call time.
 * Errors are reported to Sentry by the caller, which also surfaces them in the UI.
 */
export default function useCrmCreateLead() {
    const { providerId } = useCrmConnection();

    const { mutateAsync: createLead, isPending } = useMutation({
        mutationFn: (input: CrmCreateLeadInput): Promise<CrmLead> => {
            if (!providerId) throw new Error('No CRM connected');
            const provider = getProvider(providerId);
            return provider.createLead(input);
        },
    });

    return { createLead, isPending };
}

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import reportApiError from '@/utils/reportApiError';
import getSureSendStages from '@/services/integrations/suresend/getSureSendStages';

/**
 * Active SureSend stages for the Create Lead form.
 * @param enabled - Pass the modal's `open` so stages only load while it's showing.
 */
export default function useSureSendStages(enabled: boolean) {
    const { data, isFetching, isError, error } = useQuery({
        queryKey: ['suresend-stages'],
        queryFn: getSureSendStages,
        select: (stages) => stages.filter((stage) => stage.active),
        enabled,
        retry: false,
    });

    useEffect(() => {
        if (error) reportApiError(error, { feature: 'suresend', operation: 'getSureSendStages' });
    }, [error]);

    return { stages: data ?? [], isLoading: isFetching, isError: isError && !isFetching };
}

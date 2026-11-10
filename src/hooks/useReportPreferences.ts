import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import { getReportPreferences, updateReportPreferences } from '@/services/reportPreferences';
import type { ReportPreferences, ReportPreferencesInput } from '@/types/reportPreferences';

const QUERY_KEY = ['report-preferences'];

/** Report preferences with save-on-change: optimistic update, rollback + error toast on failure. */
export default function useReportPreferences() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const query = useQuery({ queryKey: QUERY_KEY, queryFn: getReportPreferences });

    const mutation = useMutation({
        mutationFn: updateReportPreferences,
        onMutate: async (input) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEY });
            const previous = queryClient.getQueryData<ReportPreferences>(QUERY_KEY);
            if (previous) queryClient.setQueryData<ReportPreferences>(QUERY_KEY, { ...previous, ...input });
            return { previous };
        },
        onSuccess: (saved) => {
            queryClient.setQueryData(QUERY_KEY, saved);
            showToast('success', 'Report preferences saved');
        },
        onError: (_error, _input, context) => {
            if (context?.previous) queryClient.setQueryData(QUERY_KEY, context.previous);
            showToast('error', "Couldn't save your report preferences. Please try again.");
        },
    });

    const save = (changes: Partial<ReportPreferencesInput>) => {
        const current = query.data;
        if (!current || mutation.isPending) return;
        mutation.mutate({
            enabled: current.enabled,
            frequency: current.frequency,
            weekday: current.weekday,
            ...changes,
        });
    };

    return {
        preferences: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        isFetching: query.isFetching,
        refetch: query.refetch,
        isSaving: mutation.isPending,
        save,
    };
}

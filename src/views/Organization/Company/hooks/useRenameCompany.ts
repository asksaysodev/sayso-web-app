import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import { COMPANY_QUERY_KEY } from '@/views/Organization/shared/hooks/queryKeys';
import renameCompany from '../services/renameCompany';

export default function useRenameCompany() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutateAsync } = useMutation({
        mutationFn: renameCompany,
        onSuccess: (company) => {
            queryClient.setQueryData(COMPANY_QUERY_KEY, company);
            showToast('success', 'Company name updated.');
        },
        onError: (err) => {
            reportApiError(err, { feature: 'company', operation: 'renameCompany' });
        },
    });

    return { renameCompany: mutateAsync };
}

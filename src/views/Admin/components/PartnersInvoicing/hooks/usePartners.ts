import { useQuery } from '@tanstack/react-query';
import { getPartners } from '../services/getPartners';

export function usePartners() {
    const { data, isLoading } = useQuery({
        queryKey: ['admin-partners'],
        queryFn: getPartners,
    });

    return {
        partners: data ?? [],
        isLoading,
        isEmpty: !isLoading && (data?.length ?? 0) === 0,
    };
}

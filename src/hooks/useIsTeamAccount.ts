import { useAuth } from '@/context/AuthContext';

export default function useIsTeamAccount(): boolean {
    const { globalUser } = useAuth();
    return globalUser?.account_type === 'team';
}

import { useEffect } from 'react';
import axios from 'axios';
import useDashboardScope from './useDashboardScope';

/** A team or member that no longer exists (404) drops the admin back to company level, silently. */
export default function useResetScopeOnNotFound(error: unknown) {
    const { selection, setSelection } = useDashboardScope();

    useEffect(() => {
        if (selection && axios.isAxiosError(error) && error.response?.status === 404) setSelection(null);
    }, [error, selection, setSelection]);
}

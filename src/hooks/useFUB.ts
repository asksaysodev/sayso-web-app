import { useCallback } from 'react';

import apiClient from '../config/axios';

export const useFUB = () => {

    const disconnectFUB = useCallback(async (userId: string): Promise<void> => {
        const response = await apiClient.post(`/fub/disconnect/${userId}`);
        return response.data;
    }, []);

    return {
        disconnectFUB,
    };
};

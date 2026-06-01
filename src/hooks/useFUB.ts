import { useCallback } from 'react';

import apiClient from '../config/axios';

export const useFUB = () => {

    const disconnectFUB = useCallback(async () : Promise<void> => {
        const response = await apiClient.post(`/fub/disconnect`);
        return response.data;
    }, []);

    return {
        disconnectFUB,
    };
};

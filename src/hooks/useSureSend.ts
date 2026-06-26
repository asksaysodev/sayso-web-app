import { useCallback } from 'react';
import apiClient from '../config/axios';

export const useSureSend = () => {

    const connectSureSend = useCallback(async (token: string): Promise<{ accountName: string }> => {
        const response = await apiClient.post('/suresend/connect', { token });
        return response.data;
    }, []);

    const disconnectSureSend = useCallback(async (): Promise<void> => {
        await apiClient.post('/suresend/disconnect');
    }, []);

    return { connectSureSend, disconnectSureSend };
};

import { useCallback } from 'react';

import apiClient from '../config/axios';

export const useSlack = () => {

    const disconnectSlack = useCallback(async (userId: string): Promise<void> => {
        try {
            const response = await apiClient.post(`/slack/disconnect/${userId}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error disconnecting Slack:', error);
        }
    }, []);

    const connectSlack = useCallback(async (userId: string): Promise<void> => {
        try {
            const response = await apiClient.post(`/zoom/connect/${userId}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error connecting Slack:', error);
        }
    }, []);

    return {
        disconnectSlack,
        connectSlack
    };
};

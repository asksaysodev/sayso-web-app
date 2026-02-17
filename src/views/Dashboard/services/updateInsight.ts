import apiClient from "@/config/axios";
import { InsightRating } from "../types";

export const updateInsight = async (insightId: string, rating: InsightRating): Promise<void> => {
    if (!rating || (rating !== null && rating !== 'up' && rating !== 'down')) {
        throw new Error('Unexpected rating value');
    }
    if (!insightId) {
        throw new Error('Id is required');
    }

    const response = await apiClient.patch(`sales-coach/insights/${insightId}`, { rating });

    if (!response?.data) {
        throw new Error('Failed to update insight');
    }

    return response.data;
}
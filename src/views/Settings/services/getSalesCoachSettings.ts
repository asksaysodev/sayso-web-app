import apiClient from "@/config/axios";
import { GetCoachSettingsResponse } from "../types";

export default async function getSalesCoachSettings(): Promise<GetCoachSettingsResponse> {
    const response = await apiClient.get(`sales-coach/settings`);

    if (!response?.data) {
        throw new Error('Failed to get sales coach settings');
    }

    return response.data.coachSettings;
}
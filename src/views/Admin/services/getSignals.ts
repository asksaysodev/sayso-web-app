import apiClient from "@/config/axios";
import { GetSignalResponse } from "../types";

export default async function getSignals(): Promise<GetSignalResponse> {
    const response = await apiClient.get(`/admin/cue/signals`);

    if (!response?.data) {
        throw new Error('Failed to fetch signals');
    }

    return response.data;
}

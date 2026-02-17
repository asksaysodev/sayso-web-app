import { Signal } from "../types";
import apiClient from "@/config/axios";

export default async function updateSignalsByLeadType(leadType: string, signals: Signal[]) {
    const response = await apiClient.put(`admin/cue/signals`, { leadType, signals });
    return response.data;
}
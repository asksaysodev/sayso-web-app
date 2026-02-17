import apiClient from "@/config/axios";
import { GetSignalResponse } from "../types";

export default async function deleteSignalSheetVersion(version: number): Promise<GetSignalResponse> {
    const response = await apiClient.delete(`/admin/cue/signals/delete/${version}`);

    if (!response?.data) {
        throw new Error('Failed to delete signal sheet');
    }

    return response.data;
}

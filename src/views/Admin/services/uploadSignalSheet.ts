import apiClient from "@/config/axios";
import { UploadSignalSheetResponse } from "../types";

export default async function uploadSignalSheet(file: File): Promise<UploadSignalSheetResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`/admin/cue/signals/bulk`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    if (!response?.data) {
        throw new Error('Failed to upload signal sheet');
    }

    return response.data;
}

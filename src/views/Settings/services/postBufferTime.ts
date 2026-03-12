import apiClient from "@/config/axios";
import { PostBufferTimeResponse } from "../types";

export default async function postBufferTime(bufferTime: string | number): Promise<PostBufferTimeResponse> {
    if (bufferTime === undefined ||bufferTime === null) {
         throw new Error('Property bufferTime is neither string nor number');
    }
    
    const response = await apiClient.post(`sales-coach/settings/buffer-time`, {
        bufferTime
    });

    if (!response?.data) {
        throw new Error('Failed to post buffer time');
    }

    return response.data;
}
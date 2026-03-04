import apiClient from "@/config/axios";

export default async function resetAccountSubscription(): Promise<unknown> {
    const response = await apiClient.post(`admin/subscription/reset`);

    if (!response?.data) {
        throw new Error('Failed to reset account subscription');
    }

    return response.data;
}

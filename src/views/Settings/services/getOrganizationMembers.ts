import apiClient from "@/config/axios";

export default async function getOrganizationMembers(): Promise<unknown> {
    const response = await apiClient.get(`accounts/company`);
    if (!response?.data) {
        throw new Error('Failed to get organization members');
    }

    return response.data;
}
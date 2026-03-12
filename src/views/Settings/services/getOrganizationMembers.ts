import apiClient from "@/config/axios";
import { OrganizationMembersResponse } from "@/types/user";

export default async function getOrganizationMembers(): Promise<OrganizationMembersResponse> {
    const response = await apiClient.get(`accounts/company`);
    if (!response?.data) {
        throw new Error('Failed to get organization members');
    }

    return response.data;
}
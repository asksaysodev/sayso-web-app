import apiClient from "@/config/axios";
import { AccountUsage } from "@/types/user";

/**
 * 
 * @returns {AccountUsage} - Account usage data
 */
export default async function getAccountUsage(): Promise<AccountUsage> {
    const response = await apiClient.get('/accounts/usage');

    if (!response?.data) {
        throw new Error('Failed to fetch account usage');
    }

    return response?.data
}
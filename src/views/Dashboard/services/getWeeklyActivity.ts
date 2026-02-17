import apiClient from "@/config/axios";
import type { WeeklyActivity } from "@/types/user";

export default async function getWeeklyActivity(weekOffset = 0): Promise<WeeklyActivity> {
    const response = await apiClient.get(`accounts/activity/weekly?weekOffset=${weekOffset}`);

    if (!response?.data) {
        throw new Error('Failed to fetch weekly activity');
    }

    return response.data;
}
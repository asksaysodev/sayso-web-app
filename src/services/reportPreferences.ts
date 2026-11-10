import apiClient from '@/config/axios';
import type { ReportPreferences, ReportPreferencesInput } from '@/types/reportPreferences';

export async function getReportPreferences(): Promise<ReportPreferences> {
    const response = await apiClient.get('/accounts/report-preferences');

    if (!response?.data) {
        throw new Error('Failed to fetch report preferences');
    }

    return response.data;
}

export async function updateReportPreferences(input: ReportPreferencesInput): Promise<ReportPreferences> {
    const response = await apiClient.put('/accounts/report-preferences', input);

    if (!response?.data) {
        throw new Error('Failed to save report preferences');
    }

    return response.data;
}

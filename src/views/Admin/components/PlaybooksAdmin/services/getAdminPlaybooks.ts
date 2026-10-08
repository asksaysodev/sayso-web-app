import apiClient from '@/config/axios';
import { AdminPlaybook, PlaybookStatus } from '../types';

interface AdminPlaybookResponse {
    id: string;
    alias: string | null;
    file_name: string;
    file_type: string;
    status: PlaybookStatus;
    failure_reason: string | null;
    is_system_default: boolean | null;
    default_users_count: number | null;
    created_at: string;
}

export function toAdminPlaybook(playbook: AdminPlaybookResponse): AdminPlaybook {
    return {
        id: playbook.id,
        alias: playbook.alias,
        fileName: playbook.file_name,
        fileType: playbook.file_type,
        status: playbook.status,
        failureReason: playbook.failure_reason ?? null,
        isSystemDefault: playbook.is_system_default ?? false,
        defaultUsersCount: playbook.default_users_count ?? 0,
        createdAt: playbook.created_at,
    };
}

export async function getAdminPlaybooks(): Promise<AdminPlaybook[]> {
    const response = await apiClient.get('/admin/playbooks');

    const playbooks: AdminPlaybookResponse[] | undefined = response?.data?.playbooks;
    if (!Array.isArray(playbooks)) throw new Error('Failed to fetch playbooks: unexpected response shape');

    return playbooks.map(toAdminPlaybook);
}

import apiClient from '@/config/axios';

export async function deletePlaybook(playbookId: string): Promise<void> {
    await apiClient.delete(`/admin/playbooks/${playbookId}`);
}

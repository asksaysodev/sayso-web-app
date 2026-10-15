import apiClient from '@/config/axios';
import { UploadPlaybookInput } from '../types';

const UPLOAD_TIMEOUT_MS = 120_000;

export async function uploadPlaybook({ file, alias }: UploadPlaybookInput): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'public');
    formData.append('alias', alias);

    await apiClient.post('/admin/playbooks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: UPLOAD_TIMEOUT_MS,
        skipRetry: true,
    });
}

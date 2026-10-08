import formatFileSize from '@/utils/formatters/formatFileSize';

export const PLAYBOOK_ALLOWED_EXTENSIONS = ['pdf', 'docx', 'txt'] as const;
export const PLAYBOOK_MAX_FILE_SIZE = 20 * 1024 * 1024;
export const PLAYBOOK_FILE_ACCEPT = PLAYBOOK_ALLOWED_EXTENSIONS.map(extension => `.${extension}`).join(',');

export type PlaybookFileExtension = typeof PLAYBOOK_ALLOWED_EXTENSIONS[number];

export function getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() ?? '';
}

/**
 * Browser-side check mirroring the server's type and size limits.
 * @returns An error message, or `null` when the file is accepted.
 */
export function validatePlaybookFile(file: File): string | null {
    const extension = getFileExtension(file.name);
    if (!PLAYBOOK_ALLOWED_EXTENSIONS.includes(extension as PlaybookFileExtension)) {
        return 'Only PDF, DOCX or TXT files are supported.';
    }
    if (file.size > PLAYBOOK_MAX_FILE_SIZE) {
        return `This file is ${formatFileSize(file.size)}. The limit is 20 MB.`;
    }
    return null;
}

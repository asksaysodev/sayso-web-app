export type PlaybookStatus = 'processing' | 'ready' | 'failed';

export interface AdminPlaybook {
    id: string;
    alias: string | null;
    fileName: string;
    fileType: string;
    status: PlaybookStatus;
    failureReason: string | null;
    isSystemDefault: boolean;
    defaultUsersCount: number;
    createdAt: string;
}

export interface UploadPlaybookInput {
    file: File;
    alias: string;
}

export type PlaybookSortKey = 'name' | 'status' | 'defaultUsers' | 'createdAt';

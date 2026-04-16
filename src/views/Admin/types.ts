export type Tool = 'cue-signals' | 'cue-main-instructions' | 'subscription' | 'notifications';
export type SignalLeadType = 'buyer' | 'seller' | 'all';
export type Signal = {
    id: string;
    lead_type: SignalLeadType;
    priority: number;
    name: string;
    description: string;
    instructions: string;
    threshold: number;
    stage_fit: {
        connect: string,
        discover: string,
        convert: string,
    } | null;
    stage_instructions: {
        connect: string,
        discover: string,
        convert: string,
    } | null;
};

export interface SignalVersion {
    version: number;
    signals: Signal[];
};

export interface GetSignalResponse {
    activeVersion: number;
    versions: SignalVersion[];
};

export interface UploadSignalSheetResponse {
    version: number;
    message: string;
    uploadedSignals: Signal[];
};

export type SignalStageFitKey = 'connect' | 'discover' | 'convert';
export type SignalStageFitValue = 'Primary' | 'Lower' | 'Allowed';

export type StageFitFilter = {
    key: 'stage_fit';
    stage: SignalStageFitKey;
    value: SignalStageFitValue;
};

export type ActiveFilter = StageFitFilter;
export interface FilterConfig {
    key: ActiveFilter['key'];
    label: string;
    description: string;
    defaultValue: () => ActiveFilter;
}

export interface ResetAccountSubscriptionResponse {
    message: string;
    companyId: string;
}
export type NotificationType = 'media' | 'article';
export type NotificationStatus = 'active' | 'paused' | 'expired';

export type NotificationStatusFilter = { key: 'status'; value: NotificationStatus | 'all' };
export type NotificationTypeFilter   = { key: 'type';   value: NotificationType };
export type NotificationActiveFilter = NotificationStatusFilter | NotificationTypeFilter;
export interface CreatedNotification {
    id: string;
    created_at: string;
    title: string;
    description: string | null;
    type: NotificationType;
    media_url: string[] | null;
    body: string | null;
    remindable: boolean;
    is_welcome: boolean;
    active: boolean;
    expires_at: string | null;
}
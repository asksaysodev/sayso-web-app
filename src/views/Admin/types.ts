export type Tool = 'cue-signals' | 'cue-main-instructions' | 'subscription';
export type SignalLeadType = 'buyer' | 'seller' | 'all';
export type Signal = {
    id: string;
    lead_type: SignalLeadType;
    priority: number;
    name: string;
    description: string;
    instructions: string;
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

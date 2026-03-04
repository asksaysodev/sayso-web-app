export type SettingsPanel = 'personal' | 'company' | 'files' | 'connections' | 'security' | 'coach';

export type MemberStatusFilterValue = 'active' | 'inactive';
export type MemberStatusFilter = { key: 'status'; value: MemberStatusFilterValue };
export type MemberActiveFilter = MemberStatusFilter;
export enum SettingsPanelEnum {
    PERSONAL = 'personal',
    COMPANY = 'company',
    FILES = 'files',
    CONNECTIONS = 'connections',
    SECURITY = 'security',
    COACH = 'coach'
}

export interface PostBufferTimeResponse {
    success: true;
    insight_buffer_time_ms: number;
}

export interface GetCoachSettingsResponse {
    account_id: string;
    insight_buffer_time_ms: number;
}
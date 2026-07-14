import { AccountStatus } from "@/types/user";

export type SettingsPanel = 'personal' | 'company' | 'files' | 'connections' | 'security' | 'referral' | 'usage';

export type MemberStatusFilterValue = AccountStatus;
export type MemberStatusFilter = { key: 'status'; value: MemberStatusFilterValue };
export type MemberActiveFilter = MemberStatusFilter;
export enum SettingsPanelEnum {
    PERSONAL = 'personal',
    COMPANY = 'company',
    FILES = 'files',
    CONNECTIONS = 'connections',
    SECURITY = 'security',
    REFERRAL = 'referral',
    USAGE = 'usage'
}
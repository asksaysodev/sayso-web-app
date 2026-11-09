export type SettingsPanel = 'profile' | 'company' | 'files' | 'connections' | 'security' | 'subscription' | 'referral' | 'reports';

export enum SettingsPanelEnum {
    PROFILE = 'profile',
    COMPANY = 'company',
    FILES = 'files',
    CONNECTIONS = 'connections',
    SECURITY = 'security',
    SUBSCRIPTION = 'subscription',
    REFERRAL = 'referral',
    REPORTS = 'reports'
}

export const DEFAULT_SETTINGS_PANEL: SettingsPanel = SettingsPanelEnum.PROFILE;

/** Shown in the settings nav and the topbar breadcrumb. */
export const SETTINGS_PANEL_LABELS: Record<SettingsPanel, string> = {
    profile: 'Profile',
    company: 'Company',
    files: 'Context files',
    connections: 'Connections',
    security: 'Security',
    subscription: 'Subscription',
    referral: 'Referrals',
    reports: 'Reports',
};

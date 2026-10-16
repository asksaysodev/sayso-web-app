export type SettingsPanel = 'profile' | 'files' | 'connections' | 'security' | 'subscription' | 'referral';

export enum SettingsPanelEnum {
    PROFILE = 'profile',
    FILES = 'files',
    CONNECTIONS = 'connections',
    SECURITY = 'security',
    SUBSCRIPTION = 'subscription',
    REFERRAL = 'referral'
}

export const DEFAULT_SETTINGS_PANEL: SettingsPanel = SettingsPanelEnum.PROFILE;

/** Shown in the settings nav and the topbar breadcrumb. */
export const SETTINGS_PANEL_LABELS: Record<SettingsPanel, string> = {
    profile: 'Profile',
    files: 'Context files',
    connections: 'Connections',
    security: 'Security',
    subscription: 'Subscription',
    referral: 'Referrals',
};

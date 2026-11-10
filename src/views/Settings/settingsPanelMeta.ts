import type { IconType } from 'react-icons';
import { PiBuildings, PiChartBar, PiCreditCard, PiGift, PiLock, PiPlugsConnected, PiUserCircle } from 'react-icons/pi';
import { SETTINGS_PANEL_LABELS, SettingsPanel, SettingsPanelEnum } from './types';

export interface SettingsPanelMeta {
    value: SettingsPanel;
    label: string;
    icon: IconType;
}

/** Panels shown in the desktop nav and the mobile list (Files is URL-only), in display order. */
export const SETTINGS_PANEL_META: SettingsPanelMeta[] = [
    { value: SettingsPanelEnum.PROFILE, label: SETTINGS_PANEL_LABELS.profile, icon: PiUserCircle },
    { value: SettingsPanelEnum.COMPANY, label: SETTINGS_PANEL_LABELS.company, icon: PiBuildings },
    { value: SettingsPanelEnum.CONNECTIONS, label: SETTINGS_PANEL_LABELS.connections, icon: PiPlugsConnected },
    { value: SettingsPanelEnum.SECURITY, label: SETTINGS_PANEL_LABELS.security, icon: PiLock },
    { value: SettingsPanelEnum.SUBSCRIPTION, label: SETTINGS_PANEL_LABELS.subscription, icon: PiCreditCard },
    { value: SettingsPanelEnum.REFERRAL, label: SETTINGS_PANEL_LABELS.referral, icon: PiGift },
    { value: SettingsPanelEnum.REPORTS, label: SETTINGS_PANEL_LABELS.reports, icon: PiChartBar },
];

import clsx from 'clsx';
import type { IconType } from 'react-icons';
import { PiBuildings, PiCreditCard, PiGift, PiLock, PiPlugsConnected, PiUserCircle } from 'react-icons/pi';
import { SETTINGS_PANEL_LABELS, SettingsPanel, SettingsPanelEnum } from '../types';

interface NavItem {
    value: SettingsPanel;
    label: string;
    icon: IconType;
}

const NAV_ITEMS: NavItem[] = [
    { value: SettingsPanelEnum.PROFILE, label: SETTINGS_PANEL_LABELS.profile, icon: PiUserCircle },
    { value: SettingsPanelEnum.COMPANY, label: SETTINGS_PANEL_LABELS.company, icon: PiBuildings },
    { value: SettingsPanelEnum.CONNECTIONS, label: SETTINGS_PANEL_LABELS.connections, icon: PiPlugsConnected },
    { value: SettingsPanelEnum.SECURITY, label: SETTINGS_PANEL_LABELS.security, icon: PiLock },
    { value: SettingsPanelEnum.SUBSCRIPTION, label: SETTINGS_PANEL_LABELS.subscription, icon: PiCreditCard },
    { value: SettingsPanelEnum.REFERRAL, label: SETTINGS_PANEL_LABELS.referral, icon: PiGift },
];

interface Props {
    availablePanels: SettingsPanel[];
    selectedPanel: SettingsPanel;
    onSelectPanel: (panel: SettingsPanel) => void;
}

export default function SettingsNav({ availablePanels, selectedPanel, onSelectPanel }: Props) {
    return (
        <nav className='settings-nav' aria-label='Account settings'>
            {NAV_ITEMS.filter((item) => availablePanels.includes(item.value)).map(({ value, label, icon: Icon }) => {
                const isActive = value === selectedPanel;
                return (
                    <button
                        key={value}
                        type='button'
                        className={clsx('settings-nav__item', isActive && 'settings-nav__item--active')}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => onSelectPanel(value)}
                    >
                        <Icon size={24} aria-hidden />
                        <span>{label}</span>
                    </button>
                );
            })}
        </nav>
    );
}

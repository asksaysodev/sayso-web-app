import clsx from 'clsx';
import type { IconType } from 'react-icons';
import { PiCreditCard, PiGift, PiLock, PiPlugsConnected, PiUserCircle } from 'react-icons/pi';
import { SettingsPanel, SettingsPanelEnum } from '../types';

interface NavItem {
    value: SettingsPanel;
    label: string;
    icon: IconType;
}

const NAV_ITEMS: NavItem[] = [
    { value: SettingsPanelEnum.PERSONAL, label: 'Profile', icon: PiUserCircle },
    { value: SettingsPanelEnum.CONNECTIONS, label: 'Connections', icon: PiPlugsConnected },
    { value: SettingsPanelEnum.SECURITY, label: 'Security', icon: PiLock },
    { value: SettingsPanelEnum.SUBSCRIPTION, label: 'Subscription', icon: PiCreditCard },
    { value: SettingsPanelEnum.REFERRAL, label: 'Referrals', icon: PiGift },
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

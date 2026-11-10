import clsx from 'clsx';
import { SettingsPanel } from '../types';
import { SETTINGS_PANEL_META } from '../settingsPanelMeta';

interface Props {
    availablePanels: SettingsPanel[];
    selectedPanel: SettingsPanel;
    onSelectPanel: (panel: SettingsPanel) => void;
}

export default function SettingsNav({ availablePanels, selectedPanel, onSelectPanel }: Props) {
    return (
        <nav className='settings-nav' aria-label='Account settings'>
            {SETTINGS_PANEL_META.filter((item) => availablePanels.includes(item.value)).map(({ value, label, icon: Icon }) => {
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

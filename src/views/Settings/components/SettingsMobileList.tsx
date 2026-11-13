import { PiCaretRight, PiFileDoc, PiFileLock, PiSignOut } from 'react-icons/pi';
import { useAuth } from '@/context/AuthContext';
import { PRIVACY_POLICY_URL, TERMS_URL } from '@/constants';
import { Card } from '@/components/ds/Card';
import UserIdentity from '@/components/UserMenu/UserIdentity';
import '@/components/UserMenu/UserMenu.css';
import { SETTINGS_PANEL_META } from '../settingsPanelMeta';
import type { SettingsPanel } from '../types';
import SettingsMobileHeader from './SettingsMobileHeader';

interface Props {
    availablePanels: SettingsPanel[];
    onSelectPanel: (panel: SettingsPanel) => void;
    onBack: () => void;
}

export default function SettingsMobileList({ availablePanels, onSelectPanel, onBack }: Props) {
    const { globalUser, handleSignOut } = useAuth();

    return (
        <>
            <SettingsMobileHeader title='Account settings' onBack={onBack} />
            {globalUser && (
                <Card className='settings-mobile-profile'>
                    <UserIdentity user={globalUser} />
                </Card>
            )}
            <Card className='settings-mobile-card'>
                <nav className='settings-mobile-nav' aria-label='Account settings'>
                    {SETTINGS_PANEL_META.filter((item) => availablePanels.includes(item.value)).map(({ value, label, icon: Icon }) => (
                        <button key={value} type='button' className='settings-mobile-row' onClick={() => onSelectPanel(value)}>
                            <Icon size={24} aria-hidden />
                            <span className='settings-mobile-row__label'>{label}</span>
                            <PiCaretRight size={20} aria-hidden />
                        </button>
                    ))}
                </nav>
            </Card>
            <Card className='settings-mobile-card'>
                <a className='settings-mobile-row' href={PRIVACY_POLICY_URL} target='_blank' rel='noopener noreferrer'>
                    <PiFileLock size={24} aria-hidden />
                    <span className='settings-mobile-row__label'>Privacy Policy</span>
                </a>
                <a className='settings-mobile-row' href={TERMS_URL} target='_blank' rel='noopener noreferrer'>
                    <PiFileDoc size={24} aria-hidden />
                    <span className='settings-mobile-row__label'>Terms &amp; Conditions</span>
                </a>
                <button type='button' className='settings-mobile-row settings-mobile-row--destructive' onClick={handleSignOut}>
                    <PiSignOut size={24} aria-hidden />
                    <span className='settings-mobile-row__label'>Log out</span>
                </button>
            </Card>
        </>
    );
}

import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, ModalHeader } from '@/components/ds/Modal';
import './styles.css';
import type { SettingsLocationState, SettingsPanel } from './types';
import SettingsNav from './components/SettingsNav';
import SettingsActivePanelContainer from './components/SettingsActivePanelContainer';
import useSettingsPanels from './hooks/useSettingsPanels';

/** Desktop Account settings: a modal over the page it was opened from (Figma 1090:3216). */
export default function SettingsModal() {
    const navigate = useNavigate();
    const location = useLocation();
    const { availablePanels, selectedPanel, selectPanel } = useSettingsPanels();

    const handleSelectPanel = (panel: SettingsPanel) => {
        if (panel !== selectedPanel) selectPanel(panel, { replace: true });
    };

    // Opened in-app: pop back to the page underneath. Direct load: the page underneath is the dashboard.
    const handleClose = () => {
        if ((location.state as SettingsLocationState | null)?.backgroundLocation) navigate(-1);
        else navigate('/', { replace: true });
    };

    // Focus the dialog itself, not the first nav item, so no focus ring shows on open.
    const focusDialog = (event: Event) => {
        event.preventDefault();
        (event.currentTarget as HTMLElement).focus();
    };

    return (
        <Modal
            open
            onOpenChange={(open) => !open && handleClose()}
            onOpenAutoFocus={focusDialog}
            className='settings-modal settings-theme'
        >
            <ModalHeader
                align='start'
                className='settings-modal__header'
                title='Account settings'
                description='Manage your plan, billing and team access.'
            />
            <div className='settings-modal__body'>
                <SettingsNav
                    availablePanels={availablePanels}
                    selectedPanel={selectedPanel}
                    onSelectPanel={handleSelectPanel}
                />
                <div className='settings-modal__content'>
                    <SettingsActivePanelContainer selectedPanel={selectedPanel} />
                </div>
            </div>
        </Modal>
    );
}

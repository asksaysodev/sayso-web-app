import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import { SETTINGS_PANEL_LABELS, SettingsPanel } from "./types";
import SettingsMobileHeader from "./components/SettingsMobileHeader";
import SettingsMobileList from "./components/SettingsMobileList";
import SettingsActivePanelContainer from "./components/SettingsActivePanelContainer";
import useSettingsPanels from "./hooks/useSettingsPanels";

/** Mobile Account settings screens. Desktop renders `SettingsModal` over the current page instead. */
export default function Settings() {
    const navigate = useNavigate();
    const location = useLocation();
    const { availablePanels, selectedPanel, hasTab, isFubReturn, selectPanel } = useSettingsPanels();

    // Pushes so back goes panel -> list.
    const openPanel = (panel: SettingsPanel) => selectPanel(panel, { state: { fromSettingsList: true } });

    // List back: previous in-app page, or home when there is no in-app history (deep link / fresh tab).
    const handleListBack = () => {
        const historyIdx = (window.history.state as { idx?: number } | null)?.idx;
        if (location.key === 'default' || historyIdx === 0) navigate('/');
        else navigate(-1);
    }

    // Panel back: pop the pushed entry, or on a deep link replace the URL with the list.
    const handlePanelBack = () => {
        if ((location.state as { fromSettingsList?: boolean } | null)?.fromSettingsList) navigate(-1);
        else navigate('/settings', { replace: true });
    }

    const showList = !hasTab && !isFubReturn;

    return (
        <main className='account-settings-page settings-theme'>
            {showList ? (
                <SettingsMobileList
                    availablePanels={availablePanels}
                    onSelectPanel={openPanel}
                    onBack={handleListBack}
                />
            ) : (
                <>
                    <SettingsMobileHeader title={SETTINGS_PANEL_LABELS[selectedPanel]} onBack={handlePanelBack} />
                    <div className='account-settings-content'>
                        <SettingsActivePanelContainer selectedPanel={selectedPanel} />
                    </div>
                </>
            )}
        </main>
    );
}

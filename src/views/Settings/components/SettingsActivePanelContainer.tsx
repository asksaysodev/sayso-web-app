import { useAuth } from "../../../context/AuthContext";
import { SettingsPanel } from "../types";
import SettingsFilesForm from "./SettingsFilesForm"
import SettingsPersonalForm from "./SettingsPersonalForm";
import SettingsActivePanelContainerHeader from "./SettingsActivePanelContainerHeader";
import SettingsSecurity from "./SettingsSecurity";
import SettingsReferralForm from "./SettingsReferralForm";
import SettingsConnectionsForm from "./SettingsConnections/SettingsConnectionsForm";
import SettingsSubscription from "./SettingsSubscription";

// Profile and Connections render without the white panel and header.
const PLAIN_PANELS = ['personal', 'connections'] as const;
type PlainPanel = (typeof PLAIN_PANELS)[number];
const isPlainPanel = (panel: SettingsPanel): panel is PlainPanel => (PLAIN_PANELS as readonly string[]).includes(panel);

interface Props {
    selectedPanel: SettingsPanel;
    setUnsavedChanges: (unsavedChanges: boolean) => void;
}

export default function SettingsActivePanelContainer({ selectedPanel, setUnsavedChanges }: Props) {

    const { globalUser } = useAuth();

    const renderPanel = () => {
        switch(selectedPanel) {
            case 'personal': return (
                <SettingsPersonalForm setUnsavedChanges={setUnsavedChanges} globalUser={globalUser} />
            )
            case "files": return (
                <SettingsFilesForm />
            )
            case "connections": return (
                <SettingsConnectionsForm />
            )
            case "security": return (
                <SettingsSecurity />
            )
            case "referral": return (
                <SettingsReferralForm />
            )
        }
    }
    
    // Subscription is a stack of cards on the page canvas, no panel chrome.
    if (selectedPanel === 'subscription') return <SettingsSubscription />;

    return (
        <div className={`settings-panel${isPlainPanel(selectedPanel) ? ' settings-panel--plain' : ''}`}>
            {/* Plain panels sit on the page canvas with no title/description. */}
            {!isPlainPanel(selectedPanel) && <SettingsActivePanelContainerHeader selectedPanel={selectedPanel} />}
            <div className='settings-panel-body'>
                {renderPanel()}
            </div>
        </div>
    )
}
import { useAuth } from "../../../context/AuthContext";
import { SettingsPanel } from "../types";
import SettingsCompanyForm from "./SettingsCompanyForm"
import SettingsConnectionsForm from "./SettingsConnectionsForm"
import SettingsFilesForm from "./SettingsFilesForm"
import SettingsPersonalForm from "./SettingsPersonalForm";
import SettingsActivePanelContainerHeader from "./SettingsActivePanelContainerHeader";
import SettingsSecurity from "./SettingsSecurity";
import SettingsCoachForm from "./SettingsCoachForm";

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
            case "company": return (
                <SettingsCompanyForm  setUnsavedChanges={setUnsavedChanges} globalUser={globalUser} />
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
            case "coach": return (
                <SettingsCoachForm />
            )
        }
    }
    
    return (
        <div className='settings-panel'>
            <SettingsActivePanelContainerHeader selectedPanel={selectedPanel} />
            <div className='settings-panel-body'>
                {renderPanel()}
            </div>
        </div>
    )
}
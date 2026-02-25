import { useAuth } from "../../../context/AuthContext";
import { SettingsPanel, SettingsPanelEnum } from "../types";
import SettingsCompanyForm from "./SettingsCompanyForm"
import SettingsConnectionsForm from "./SettingsConnectionsForm"
import SettingsFilesForm from "./SettingsFilesForm"
import SettingsPersonalForm from "./SettingsPersonalForm";
import SettingsActivePanelContainerHeader from "./SettingsActivePanelContainerHeader";
import SettingsSecurity from "./SettingsSecurity";

interface Props {
    selectedPanel: SettingsPanel;
    setUnsavedChanges: (unsavedChanges: boolean) => void;
}

export default function SettingsActivePanelContainer({ selectedPanel, setUnsavedChanges }: Props) {

    const { globalUser } = useAuth();

    return (
        <div className='settings-panel'>
            <SettingsActivePanelContainerHeader selectedPanel={selectedPanel} />
            <div className='settings-panel-body'>
                 {
                    selectedPanel === SettingsPanelEnum.PERSONAL ? (
                       <SettingsPersonalForm setUnsavedChanges={setUnsavedChanges} globalUser={globalUser} />
                    ) :
                    selectedPanel === SettingsPanelEnum.COMPANY ? (
                        <SettingsCompanyForm  setUnsavedChanges={setUnsavedChanges} globalUser={globalUser} />
                    ) : 
                    selectedPanel === SettingsPanelEnum.FILES ? (
                        <SettingsFilesForm />
                    ) : 
                    selectedPanel === SettingsPanelEnum.CONNECTIONS ? (
                        <SettingsConnectionsForm />
                    ) : selectedPanel === SettingsPanelEnum.SECURITY && (
                        <SettingsSecurity />
                    ) 
                }
            </div>
        </div>
    )
}
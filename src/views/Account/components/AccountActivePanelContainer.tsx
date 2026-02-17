import { useAuth } from "../../../context/AuthContext";
import { AccountSettingsPanel, AccountSettingsPanelEnum } from "../types";
import AccountSettingsCompanyForm from "./AccountSettingsCompanyForm"
import AccountSettingsConnectionsForm from "./AccountSettingsConnectionsForm"
import AccountSettingsFilesForm from "./AccountSettingsFilesForm"
import AccountSettingsPersonalForm from "./AccountSettingsPersonalForm";
import AccountActivePanelContainerHeader from "./AccountActivePanelContainerHeader";
import AccountSettingsSecurity from "./AccountSettingsSecurity";

interface Props {
    selectedPanel: AccountSettingsPanel;
    setUnsavedChanges: (unsavedChanges: boolean) => void;
}

export default function AccountActivePanelContainer({ selectedPanel, setUnsavedChanges }: Props) {

    const { globalUser } = useAuth();

    return (
        <div className='account-settings-panel-container'>
            <AccountActivePanelContainerHeader selectedPanel={selectedPanel} />
            <div className='account-settings-panel-container-content'>
                 {
                    selectedPanel === AccountSettingsPanelEnum.PERSONAL ? (
                       <AccountSettingsPersonalForm setUnsavedChanges={setUnsavedChanges} globalUser={globalUser} />
                    ) :
                    selectedPanel === AccountSettingsPanelEnum.COMPANY ? (
                        <AccountSettingsCompanyForm  setUnsavedChanges={setUnsavedChanges} globalUser={globalUser} />
                    ) : 
                    selectedPanel === AccountSettingsPanelEnum.FILES ? (
                        <AccountSettingsFilesForm />
                    ) : 
                    selectedPanel === AccountSettingsPanelEnum.CONNECTIONS ? (
                        <AccountSettingsConnectionsForm />
                    ) : selectedPanel === AccountSettingsPanelEnum.SECURITY && (
                        <AccountSettingsSecurity />
                    ) 
                }
            </div>
        </div>
    )
}
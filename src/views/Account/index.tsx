import SaysoModal from "@/components/SaysoModal";
import AccountSettingsTabs from "./components/AccountSettingsTabs";
import { useState } from "react";
import ViewLayout from "@/components/layouts/ViewLayout";
import "./styles.css";
import { AccountSettingsPanel, AccountSettingsPanelEnum } from "./types";
import AccountActivePanelContainer from "./components/AccountActivePanelContainer";

export default function Account() {
	const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
    const [selectedPanel, setSelectedPanel] = useState<AccountSettingsPanel>(AccountSettingsPanelEnum.PERSONAL);
    const [nextPanel, setNextPanel] = useState<AccountSettingsPanel | null>(null);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const handleSelectPanel = (panel: AccountSettingsPanel) => { 
        if(unsavedChanges) {
            setNextPanel(panel);
            setShowUnsavedChangesModal(true)
        } else {
            setSelectedPanel(panel);
        }
    }

    const handleModalConfirm = () => {
        setShowUnsavedChangesModal(false);
        setNextPanel(null);
    }
    
    const handleModalDeny = () => {
        setShowUnsavedChangesModal(false);
        setSelectedPanel(nextPanel as AccountSettingsPanel);
        setUnsavedChanges(false);
        setNextPanel(null);
    }

	return (
		<ViewLayout title="Account Settings">
			{
				showUnsavedChangesModal && (
					<SaysoModal
						title="Unsaved Changes"
						text={`You have unsaved changes. Are you sure you want to switch to another panel?`}
						isDelete={false}
						primaryText="Continue Editing"
						secondaryText="Yes, Switch"
						onDeny={() => handleModalDeny()}
						onConfirm={() => handleModalConfirm()}
					/>
				)
			}

			<div className='account-settings-body'>
				<div className='account-settings-panel-container-main'>
					<div className='account-settings-panel-container-main-content'>
						<AccountSettingsTabs onSelectPanel={handleSelectPanel} selectedPanel={selectedPanel} />
						<AccountActivePanelContainer selectedPanel={selectedPanel} setUnsavedChanges={setUnsavedChanges} />
					</div>
				</div>
			</div>  
		</ViewLayout>
	);
}

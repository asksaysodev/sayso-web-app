import SaysoModal from "@/components/SaysoModal";
import SettingsTabs from "./components/SettingsTabs";
import { useState } from "react";
import ViewLayout from "@/components/layouts/ViewLayout";
import "./styles.css";
import { SettingsPanel, SettingsPanelEnum } from "./types";
import SettingsActivePanelContainer from "./components/SettingsActivePanelContainer";

export default function Settings() {
	const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
    const [selectedPanel, setSelectedPanel] = useState<SettingsPanel>(SettingsPanelEnum.PERSONAL);
    const [nextPanel, setNextPanel] = useState<SettingsPanel | null>(null);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    
    const handleSelectPanel = (panel: SettingsPanel) => { 
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
        setSelectedPanel(nextPanel as SettingsPanel);
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

			<div className='settings-body'>
				<div className='settings-wrapper'>
					<div className='settings-wrapper-inner'>
						<SettingsTabs onSelectPanel={handleSelectPanel} selectedPanel={selectedPanel} />
						<SettingsActivePanelContainer selectedPanel={selectedPanel} setUnsavedChanges={setUnsavedChanges} />
					</div>
				</div>
			</div>  
		</ViewLayout>
	);
}

import SaysoModal from "@/components/SaysoModal";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/ds/PageHeader";
import "./styles.css";
import { SettingsPanel, SettingsPanelEnum } from "./types";
import SettingsNav from "./components/SettingsNav";
import SettingsActivePanelContainer from "./components/SettingsActivePanelContainer";
import useCanAccessReferrals from "@/hooks/useCanAccessReferrals";
import useCanManageBilling from "@/hooks/useCanManageBilling";

const DEFAULT_PANEL = SettingsPanelEnum.PERSONAL;

export default function Settings() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
    const canAccessReferrals = useCanAccessReferrals();
    const canManageBilling = useCanManageBilling();

    // Panels this user may open. Files stays reachable by URL only (hidden from the nav, as before).
    const availablePanels = useMemo(() => {
        const panels: SettingsPanel[] = [
            SettingsPanelEnum.PERSONAL,
            SettingsPanelEnum.FILES,
            SettingsPanelEnum.CONNECTIONS,
            SettingsPanelEnum.SECURITY,
            SettingsPanelEnum.USAGE,
        ];
        if (canManageBilling) panels.push(SettingsPanelEnum.SUBSCRIPTION);
        if (canAccessReferrals) panels.push(SettingsPanelEnum.REFERRAL);
        return panels;
    }, [canManageBilling, canAccessReferrals]);

    const tabParam = searchParams.get("tab");
    const selectedPanel = tabParam && availablePanels.includes(tabParam as SettingsPanel)
        ? tabParam as SettingsPanel
        : DEFAULT_PANEL;

    const [nextPanel, setNextPanel] = useState<SettingsPanel | null>(null);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const openPanel = (panel: SettingsPanel) => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.set("tab", panel);
                return next;
            },
            { replace: true },
        );
    }

    const handleSelectPanel = (panel: SettingsPanel) => {
        if (panel === selectedPanel) return;
        if(unsavedChanges) {
            setNextPanel(panel);
            setShowUnsavedChangesModal(true)
        } else {
            openPanel(panel);
        }
    }

    const handleModalConfirm = () => {
        setShowUnsavedChangesModal(false);
        setNextPanel(null);
    }

    const handleModalDeny = () => {
        setShowUnsavedChangesModal(false);
        openPanel(nextPanel as SettingsPanel);
        setUnsavedChanges(false);
        setNextPanel(null);
    }

	return (
		<main className='account-settings-page'>
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

			<PageHeader
				title='Account settings'
				description='Manage your plan, billing and team access.'
			/>

			<div className='account-settings-body'>
				<SettingsNav
					availablePanels={availablePanels}
					selectedPanel={selectedPanel}
					onSelectPanel={handleSelectPanel}
				/>
				<div className='account-settings-content'>
					<SettingsActivePanelContainer selectedPanel={selectedPanel} setUnsavedChanges={setUnsavedChanges} />
				</div>
			</div>
		</main>
	);
}

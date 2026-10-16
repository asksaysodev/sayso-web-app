import SaysoModal from "@/components/SaysoModal";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/ds/PageHeader";
import "./styles.css";
import { DEFAULT_SETTINGS_PANEL, SettingsPanel, SettingsPanelEnum } from "./types";
import SettingsNav from "./components/SettingsNav";
import SettingsActivePanelContainer from "./components/SettingsActivePanelContainer";
import useCanAccessReferrals from "@/hooks/useCanAccessReferrals";
import useCanManageBilling from "@/hooks/useCanManageBilling";


export default function Settings() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
    const canAccessReferrals = useCanAccessReferrals();
    const canManageBilling = useCanManageBilling();

    // Panels this user may open. Files stays reachable by URL only (hidden from the nav, as before).
    const availablePanels = useMemo(() => {
        const panels: SettingsPanel[] = [
            SettingsPanelEnum.PROFILE,
            SettingsPanelEnum.FILES,
            SettingsPanelEnum.CONNECTIONS,
            SettingsPanelEnum.SECURITY,
        ];
        if (canManageBilling) panels.push(SettingsPanelEnum.SUBSCRIPTION);
        if (canAccessReferrals) panels.push(SettingsPanelEnum.REFERRAL);
        return panels;
    }, [canManageBilling, canAccessReferrals]);

    const tabParam = searchParams.get("tab");
    const selectedPanel = tabParam && availablePanels.includes(tabParam as SettingsPanel)
        ? tabParam as SettingsPanel
        : DEFAULT_SETTINGS_PANEL;

    // An unknown or not-allowed ?tab= falls back to the default; rewrite the URL so the breadcrumb matches.
    useEffect(() => {
        if (tabParam === null || tabParam === selectedPanel) return;
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.set("tab", selectedPanel);
                return next;
            },
            { replace: true },
        );
    }, [tabParam, selectedPanel, setSearchParams]);

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
				title='Settings'
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

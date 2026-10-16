import { useEffect, useMemo } from "react";
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

    // The FUB OAuth callback returns to /settings?fub=… with no tab; its handler lives on Connections.
    const isFubReturn = searchParams.has("fub");
    const tabParam = searchParams.get("tab") ?? (isFubReturn ? SettingsPanelEnum.CONNECTIONS : null);
    const selectedPanel = tabParam && availablePanels.includes(tabParam as SettingsPanel)
        ? tabParam as SettingsPanel
        : DEFAULT_SETTINGS_PANEL;

    // Write the shown panel to the URL when ?tab= is missing (FUB return), unknown or not allowed, so the breadcrumb matches.
    useEffect(() => {
        if (tabParam === null || searchParams.get("tab") === selectedPanel) return;
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.set("tab", selectedPanel);
                return next;
            },
            { replace: true },
        );
    }, [tabParam, selectedPanel, searchParams, setSearchParams]);

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
        if (panel !== selectedPanel) openPanel(panel);
    }

	return (
		<main className='account-settings-page'>
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
					<SettingsActivePanelContainer selectedPanel={selectedPanel} />
				</div>
			</div>
		</main>
	);
}

import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/ds/PageHeader";
import "./styles.css";
import { DEFAULT_SETTINGS_PANEL, SETTINGS_PANEL_LABELS, SettingsPanel, SettingsPanelEnum } from "./types";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import SettingsMobileHeader from "./components/SettingsMobileHeader";
import SettingsMobileList from "./components/SettingsMobileList";
import SettingsNav from "./components/SettingsNav";
import SettingsActivePanelContainer from "./components/SettingsActivePanelContainer";
import useCanAccessReferrals from "@/hooks/useCanAccessReferrals";
import useCanManageReports from "@/hooks/useCanManageReports";
import useCanManageBilling from "@/hooks/useCanManageBilling";
import useCanRenameCompany from "@/hooks/useCanRenameCompany";


export default function Settings() {
	const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery('(max-width: 767px)');
    const canAccessReferrals = useCanAccessReferrals();
    const canManageBilling = useCanManageBilling();
    const canManageReports = useCanManageReports();
    const canRenameCompany = useCanRenameCompany();

    // Panels this user may open. Files stays reachable by URL only (hidden from the nav, as before).
    const availablePanels = useMemo(() => {
        const panels: SettingsPanel[] = [SettingsPanelEnum.PROFILE];
        if (canRenameCompany) panels.push(SettingsPanelEnum.COMPANY);
        panels.push(
            SettingsPanelEnum.FILES,
            SettingsPanelEnum.CONNECTIONS,
            SettingsPanelEnum.SECURITY,
        );
        if (canManageBilling) panels.push(SettingsPanelEnum.SUBSCRIPTION);
        if (canAccessReferrals) panels.push(SettingsPanelEnum.REFERRAL);
        if (canManageReports) panels.push(SettingsPanelEnum.REPORTS);
        return panels;
    }, [canRenameCompany, canManageBilling, canAccessReferrals, canManageReports]);

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
            // Mobile pushes so back goes panel -> list; desktop keeps replacing.
            isMobile ? { state: { fromSettingsList: true } } : { replace: true },
        );
    }

    // Mobile list back: previous in-app page, or home when there is no in-app history (deep link / fresh tab).
    const handleListBack = () => {
        const historyIdx = (window.history.state as { idx?: number } | null)?.idx;
        if (location.key === 'default' || historyIdx === 0) navigate('/');
        else navigate(-1);
    }

    // Mobile panel back: pop the pushed entry, or on a deep link replace the URL with the list.
    const handlePanelBack = () => {
        if ((location.state as { fromSettingsList?: boolean } | null)?.fromSettingsList) navigate(-1);
        else navigate('/settings', { replace: true });
    }

    const handleSelectPanel = (panel: SettingsPanel) => {
        if (panel !== selectedPanel) openPanel(panel);
    }

	if (isMobile) {
		const showList = !searchParams.has("tab") && !isFubReturn;
		return (
			<main className='account-settings-page account-settings-page--mobile'>
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

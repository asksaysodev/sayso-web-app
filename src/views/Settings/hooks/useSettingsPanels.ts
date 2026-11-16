import { useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import useCanAccessReferrals from '@/hooks/useCanAccessReferrals';
import useCanManageBilling from '@/hooks/useCanManageBilling';
import useCanManageReports from '@/hooks/useCanManageReports';
import useCanRenameCompany from '@/hooks/useCanRenameCompany';
import { DEFAULT_SETTINGS_PANEL, SettingsPanel, SettingsPanelEnum } from '../types';

interface SelectPanelOptions {
    replace?: boolean;
    state?: unknown;
}

/**
 * Panels the user may open and the one `?tab=` selects, shared by the mobile page and the desktop modal.
 * URL writes keep the current router state so the desktop modal keeps its background page.
 */
export default function useSettingsPanels() {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const canAccessReferrals = useCanAccessReferrals();
    const canManageBilling = useCanManageBilling();
    const canManageReports = useCanManageReports();
    const canRenameCompany = useCanRenameCompany();

    // Files stays reachable by URL only (hidden from the nav).
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
    const isFubReturn = searchParams.has('fub');
    const hasTab = searchParams.has('tab');
    const tabParam = searchParams.get('tab') ?? (isFubReturn ? SettingsPanelEnum.CONNECTIONS : null);
    const selectedPanel = tabParam && availablePanels.includes(tabParam as SettingsPanel)
        ? tabParam as SettingsPanel
        : DEFAULT_SETTINGS_PANEL;

    // Write the shown panel to the URL when ?tab= is missing (FUB return), unknown or not allowed.
    useEffect(() => {
        if (tabParam === null || searchParams.get('tab') === selectedPanel) return;
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.set('tab', selectedPanel);
                return next;
            },
            { replace: true, state: location.state },
        );
    }, [tabParam, selectedPanel, searchParams, setSearchParams, location.state]);

    const selectPanel = (panel: SettingsPanel, { replace = false, state = location.state }: SelectPanelOptions = {}) => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.set('tab', panel);
                return next;
            },
            { replace, state },
        );
    };

    return { availablePanels, selectedPanel, hasTab, isFubReturn, selectPanel };
}

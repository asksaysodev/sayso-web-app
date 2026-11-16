import { useLocation, useNavigate } from 'react-router-dom';
import type { SettingsLocationState, SettingsPanel } from '@/views/Settings/types';

/** Opens Account settings; on desktop it shows as a modal over the current page. */
export default function useOpenSettings() {
    const navigate = useNavigate();
    const location = useLocation();

    return (panel?: SettingsPanel) => {
        const state: SettingsLocationState = { backgroundLocation: location };
        navigate(panel ? `/settings?tab=${panel}` : '/settings', { state });
    };
}

import { LuUser, LuFileScan, LuBuilding, LuUnplug, LuLock, LuGift } from 'react-icons/lu';
import TabSelector from '../../../components/TabSelector';
import '../../../components/TabSelector.css';
import { SettingsPanel, SettingsPanelEnum } from '../types';
import useCanAccessReferrals from '@/hooks/useCanAccessReferrals';

const ICON_SIZE = 18;

interface Props {
    onSelectPanel: (panel: SettingsPanel) => void;
    selectedPanel: SettingsPanel;
}

export default function SettingsTabs({ onSelectPanel, selectedPanel }: Props) {
    const canAccessReferrals = useCanAccessReferrals();
    const tabs = [
        {
            icon: <LuUser size={ICON_SIZE} />,
            label: 'Profile',
            value: SettingsPanelEnum.PERSONAL
        },
        {
            icon: <LuBuilding size={ICON_SIZE} />,
            label: 'Organization',
            value: SettingsPanelEnum.COMPANY
        },
        {
            icon: <LuFileScan size={ICON_SIZE} />,
            label: 'Context Files',
            value: SettingsPanelEnum.FILES,
            hidden: true
        },
        {
            icon: <LuUnplug size={ICON_SIZE} />,
            label: 'Connections',
            value: SettingsPanelEnum.CONNECTIONS,
            hidden: true
        },
        {
            icon: <LuLock size={ICON_SIZE} />,
            label: 'Security',
            value: SettingsPanelEnum.SECURITY,
        },
        {
            icon: <LuGift size={ICON_SIZE} />,
            label: 'Referrals',
            value: SettingsPanelEnum.REFERRAL,
            hidden: !canAccessReferrals,
        },
    ];

    return (
        <div className='settings-nav'>
            <TabSelector
                tabs={tabs}
                selectedValue={selectedPanel}
                onChange={(value: string) => onSelectPanel(value as SettingsPanel)}
            />
        </div>
    )
}
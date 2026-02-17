import { LuUser, LuFileScan, LuBuilding, LuUnplug, LuLock } from 'react-icons/lu';
import TabSelector from '../../../components/TabSelector';
import '../../../components/TabSelector.css';
import { AccountSettingsPanel, AccountSettingsPanelEnum } from '../types';

const ICON_SIZE = 18;

interface Props {
    onSelectPanel: (panel: AccountSettingsPanel) => void;
    selectedPanel: AccountSettingsPanel;
}

export default function AccountSettingsTabs({ onSelectPanel, selectedPanel }: Props) {
    const tabs = [
        {
            icon: <LuUser size={ICON_SIZE} />,
            label: 'My Information',
            value: AccountSettingsPanelEnum.PERSONAL
        },
        {
            icon: <LuBuilding size={ICON_SIZE} />,
            label: 'My Company',
            value: AccountSettingsPanelEnum.COMPANY
        },
        {
            icon: <LuFileScan size={ICON_SIZE} />,
            label: 'Context Files',
            value: AccountSettingsPanelEnum.FILES,
            hidden: true
        },
        {
            icon: <LuUnplug size={ICON_SIZE} />,
            label: 'Connections',
            value: AccountSettingsPanelEnum.CONNECTIONS,
            hidden: true
        },
        {
            icon: <LuLock size={ICON_SIZE} />,
            label: 'Security',
            value: AccountSettingsPanelEnum.SECURITY,
        },
    ];

    return (
        <div className='account-settings-selector-container'>
            <TabSelector
                tabs={tabs}
                selectedValue={selectedPanel}
                onChange={(value: string) => onSelectPanel(value as AccountSettingsPanel)}
            />
        </div>
    )
}
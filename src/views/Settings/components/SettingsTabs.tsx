import { LuUser, LuFileScan, LuBuilding, LuUnplug, LuLock } from 'react-icons/lu';
import TabSelector from '../../../components/TabSelector';
import '../../../components/TabSelector.css';
import { SettingsPanel, SettingsPanelEnum } from '../types';

const ICON_SIZE = 18;

interface Props {
    onSelectPanel: (panel: SettingsPanel) => void;
    selectedPanel: SettingsPanel;
}

export default function SettingsTabs({ onSelectPanel, selectedPanel }: Props) {
    const tabs = [
        {
            icon: <LuUser size={ICON_SIZE} />,
            label: 'My Information',
            value: SettingsPanelEnum.PERSONAL
        },
        {
            icon: <LuBuilding size={ICON_SIZE} />,
            label: 'My Company',
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
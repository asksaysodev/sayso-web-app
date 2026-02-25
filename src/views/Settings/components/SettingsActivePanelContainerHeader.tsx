import { SettingsPanel, SettingsPanelEnum } from "../types"

interface Props {
    selectedPanel: SettingsPanel;
}

export default function SettingsActivePanelContainerHeader({ selectedPanel }: Props) {

    const panelFormContent = {
        [SettingsPanelEnum.PERSONAL]: {
            title: 'My Information',
            description: 'Fill in general info about yourself'
        },
        [SettingsPanelEnum.COMPANY]: {
            title: 'My Company',
            description: 'Manage your company and team information'
        },
        [SettingsPanelEnum.FILES]: {
            title: 'Context Files',
            description: 'Upload files to give your coach more context about your company or product'
        },
        [SettingsPanelEnum.CONNECTIONS]: {
            title: 'Connections',
            description: 'Connect your software and external accounts'
        },
        [SettingsPanelEnum.SECURITY]: {
            title: 'Security',
            description: 'Manage security settings for your account'
        }
    }

    return (
        <div className='settings-panel-title'>
            <div>
                <h1>{panelFormContent[selectedPanel]?.title}</h1>
                <p>{panelFormContent[selectedPanel]?.description}</p>
            </div>
        </div>
    )
}
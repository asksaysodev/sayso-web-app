import { AccountSettingsPanel, AccountSettingsPanelEnum } from "../types"

interface Props {
    selectedPanel: AccountSettingsPanel;
}

export default function AccountActivePanelContainerHeader({ selectedPanel }: Props) {

    const panelFormContent = {
        [AccountSettingsPanelEnum.PERSONAL]: {
            title: 'My Information',
            description: 'Fill in general info about yourself'
        },
        [AccountSettingsPanelEnum.COMPANY]: {
            title: 'My Company',
            description: 'Manage your company and team information'
        },
        [AccountSettingsPanelEnum.FILES]: {
            title: 'Context Files',
            description: 'Upload files to give your coach more context about your company or product'
        },
        [AccountSettingsPanelEnum.CONNECTIONS]: {
            title: 'Connections',
            description: 'Connect your software and external accounts'
        },
        [AccountSettingsPanelEnum.SECURITY]: {
            title: 'Security',
            description: 'Manage security settings for your account'
        }
    }

    return (
        <div className='account-settings-title-container'>
            <div>
                <h1>{panelFormContent[selectedPanel]?.title}</h1>
                <p>{panelFormContent[selectedPanel]?.description}</p>
            </div>
        </div>
    )
}
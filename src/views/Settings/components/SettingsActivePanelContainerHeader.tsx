import { SettingsPanel, SettingsPanelEnum } from "../types"

interface Props {
    // Only Files still renders the panel header.
    selectedPanel: Exclude<SettingsPanel, 'subscription' | 'personal' | 'connections' | 'security' | 'referral'>;
}

export default function SettingsActivePanelContainerHeader({ selectedPanel }: Props) {

    const panelFormContent = {
        [SettingsPanelEnum.FILES]: {
            title: 'Context Files',
            description: 'Upload files to give your coach more context about your company or product'
        },
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
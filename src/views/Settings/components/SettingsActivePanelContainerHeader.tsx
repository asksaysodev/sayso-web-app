import { SettingsPanel, SettingsPanelEnum } from "../types"

interface Props {
    // Subscription, Profile and Connections render without a panel header.
    selectedPanel: Exclude<SettingsPanel, 'subscription' | 'personal' | 'connections'>;
}

export default function SettingsActivePanelContainerHeader({ selectedPanel }: Props) {

    const panelFormContent = {
        [SettingsPanelEnum.FILES]: {
            title: 'Context Files',
            description: 'Upload files to give your coach more context about your company or product'
        },
        [SettingsPanelEnum.SECURITY]: {
            title: 'Security',
            description: 'Manage security settings for your account'
        },
        [SettingsPanelEnum.REFERRAL]: {
            title: 'Referrals',
            description: 'Share your unique link and earn rewards when friends subscribe to Sayso.'
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
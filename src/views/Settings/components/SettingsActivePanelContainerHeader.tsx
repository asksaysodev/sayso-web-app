import { SettingsPanel, SettingsPanelEnum } from "../types"
import './SettingsConnections/connections.css';

const ArrowIcon = () => (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8h10m-4-4 4 4-4 4" />
    </svg>
);

interface Props {
    selectedPanel: SettingsPanel;
}

export default function SettingsActivePanelContainerHeader({ selectedPanel }: Props) {

    const panelFormContent = {
        [SettingsPanelEnum.PERSONAL]: {
            title: 'Profile',
            description: 'Fill in general info about yourself'
        },
        [SettingsPanelEnum.COMPANY]: {
            title: 'Organization',
            description: 'Manage your organization and team information'
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
            {selectedPanel === SettingsPanelEnum.CONNECTIONS && (
                <button className="connections-request-link">
                    Request integration
                    <span className="arr"><ArrowIcon /></span>
                </button>
            )}
        </div>
    )
}
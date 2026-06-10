import { LuShield } from "react-icons/lu";

interface Props {
    icon?: React.ReactNode;
    title: string;
    description: string;
    rightContent: React.ReactNode;
}

export default function SecuritySettingContainer({ icon, title, description, rightContent }: Props) {
    return (
        <div className='security-setting-item'>
            <div className="security-setting-item-top">
                <div className='security-setting-icon-container'>
                    {icon ?? <LuShield size={22} />}
                </div>
                <div className='security-setting-content'>
                    <h3 className='security-setting-title'>{title}</h3>
                </div>
            </div>
            <p className='security-setting-description'>{description}</p>
            <div className='security-setting-foot'>
                {rightContent}
            </div>
        </div>
    )
}
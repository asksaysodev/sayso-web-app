interface Props {
    icon: React.ReactNode;
    title: string;
    description: string;
    rightContent: React.ReactNode;
}

export default function SecurityFormSettingContainer({ icon, title, description, rightContent }: Props) {
    return (
        <div className='security-setting-item'>
        {icon && <div className='security-setting-icon-container'>
            {icon}
        </div>}
        <div className='security-setting-content'>
            <h3 className='security-setting-title'>{title}</h3>
            <p className='security-setting-description'>
                {description}
            </p>
        </div>
        
        {rightContent && rightContent}
    </div>
    )
}
import './styles/viewLayouts.css';

interface Props {
    title?: string;
    children: React.ReactNode;
    scrollable?: boolean;
    right?: React.ReactNode;
    description?: string;
    className?: string;
}

export default function ViewLayout({ title, children, scrollable = false, right = undefined, description, className = '' }: Props) {
    return (
        <div className={`view-layout-container ${scrollable ? 'scrollable' : ''} ${className}`}>
            {title && (
                <div className='view-container-header'>
                    <div className='view-container-header-top'>
                        <h1>{title}</h1>
                        {right}
                    </div>
                    {description && (
                        <span className='view-container-header-description'>{description}</span>
                    )}
                </div>
            )}

            {children}
        </div>
    )
}
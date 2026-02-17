import './styles/viewLayouts.css';

interface Props {
    title: string;
    children: React.ReactNode;
    scrollable?: boolean;
    rightContent?: React.ReactNode;
}

export default function ViewLayout({ title, children, scrollable = false, rightContent = null }: Props) {
    return (
        <div className={`view-layout-container ${scrollable ? 'scrollable' : ''}`}>
            <div className='view-container-header'>
                <h1>{title}</h1>
                {rightContent && rightContent}
            </div>
            
            {children}
        </div>
    )
}
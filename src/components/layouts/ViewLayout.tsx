import './styles/viewLayouts.css';

interface Props {
    title?: string;
    children: React.ReactNode;
    scrollable?: boolean;
    right?: React.ReactNode;
}

export default function ViewLayout({ title, children, scrollable = false, right = undefined }: Props) {
    return (
        <div className={`view-layout-container ${scrollable ? 'scrollable' : ''}`}>
            {title && (
                <div className='view-container-header'>
                    <h1>{title}</h1>
                    {right && right}
                </div>
            )}

            {children}
        </div>
    )
}
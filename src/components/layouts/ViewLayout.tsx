import './styles/viewLayouts.css';

interface Props {
    title: string;
    children: React.ReactNode;
    scrollable?: boolean;
}

export default function ViewLayout({ title, children, scrollable = false }: Props) {
    return (
        <div className={`view-layout-container ${scrollable ? 'scrollable' : ''}`}>
            <div className='view-container-header'>
                <h1>{title}</h1>
            </div>

            {children}
        </div>
    )
}
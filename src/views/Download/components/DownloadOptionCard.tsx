import { ArrowDownToLine } from 'lucide-react';
import { ReactNode } from 'react';

interface Props {
    title: string;
    description: string;
    icon: ReactNode;
    recommended?: boolean;
    onClick: () => void;
    onMobileClick: () => void;
}

export default function DownloadOptionCard({ title, description, icon, recommended, onClick, onMobileClick }: Props) {
    const handleClick = () => {
        if (window.innerWidth <= 768) {
            onMobileClick();
            return;
        }
        onClick();
    };

    return (
        <div className={`download-option${recommended ? ' download-option--recommended' : ''}`}>
            {recommended && (
                <span className='chip-recommended-badge'>Recommended for your Mac</span>
            )}

            <div className='chip-card-header'>
                <div className='chip-icon-wrapper'>{icon}</div>

                <div className='chip-mobile-header'>
                    <span className='chip-title'>{title}</span>
                    <button className='chip-mobile-download-btn' onClick={handleClick}>
                        <ArrowDownToLine size={22} />
                    </button>
                </div>

                <span className='chip-title chip-title-desktop'>{title}</span>
            </div>

            <span className='chip-description'>{description}</span>
            <button className='chip-download-btn' onClick={handleClick}>Download</button>
        </div>
    )
}

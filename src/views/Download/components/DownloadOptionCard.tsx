import { ReactNode } from 'react';

interface Props {
    logo: string;
    logoAlt: string;
    meta: string;
    title: string;
    description: string;
    recommended: boolean;
    unavailable: boolean;
    actions: ReactNode;
}

export default function DownloadOptionCard({ logo, logoAlt, meta, title, description, recommended, unavailable, actions }: Props) {
    return (
        <div className='download-card'>
            <div className='download-card-info'>
                <div className='download-card-top'>
                    <img src={logo} alt={logoAlt} width={32} height={32} className='download-card-logo' />
                    <span className='download-card-meta'>{meta}</span>
                </div>

                <div className='download-card-text'>
                    <div className='download-card-title-row'>
                        <span className='download-card-title'>{title}</span>
                        {recommended && <span className='download-card-badge'>RECOMMENDED</span>}
                    </div>
                    <span className='download-card-description'>{description}</span>
                </div>
            </div>

            <div className='download-card-footer'>
                <div className='download-card-actions'>{actions}</div>
                {unavailable && (
                    <span className='download-card-unavailable'>
                        Download unavailable right now. Please try again later or contact support.
                    </span>
                )}
            </div>
        </div>
    );
}

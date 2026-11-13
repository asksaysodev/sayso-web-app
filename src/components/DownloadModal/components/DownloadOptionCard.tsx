import { ReactNode } from 'react';

interface Props {
    logo: string;
    logoAlt: string;
    meta: string;
    title: string;
    description: string;
    recommended: boolean;
    unavailable: boolean;
    /** The release (version + download links) is still loading: the meta line shows a skeleton. */
    loading?: boolean;
    actions: ReactNode;
}

export default function DownloadOptionCard({ logo, logoAlt, meta, title, description, recommended, unavailable, loading = false, actions }: Props) {
    return (
        <div className={recommended ? 'download-card download-card--recommended' : 'download-card'}>
            <div className='download-card-info'>
                <div className='download-card-top'>
                    <img src={logo} alt={logoAlt} width={32} height={32} className='download-card-logo' />
                    {loading ? (
                        <span className='skeleton download-card-meta-skeleton' aria-hidden='true' />
                    ) : (
                        <span className='download-card-meta'>{meta}</span>
                    )}
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

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface Props {
    url: string;
    previewUrl?: string | null;
    title: string;
}

const hostnameOf = (url: string) => {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
};

/** A web link from a media notification, with its preview image on top when there is one. */
export default function NotificationLinkCard({ url, previewUrl, title }: Props) {
    const [previewFailed, setPreviewFailed] = useState(false);
    const showPreview = !!previewUrl && !previewFailed;

    return (
        <a className='nw-link-card' href={url} target='_blank' rel='noopener noreferrer'>
            {showPreview && (
                <img
                    className='nw-link-card__preview'
                    src={previewUrl}
                    alt={title}
                    referrerPolicy='no-referrer'
                    onError={() => setPreviewFailed(true)}
                />
            )}
            <span className='nw-link-card__footer'>
                <span className='nw-link-card__text'>
                    <span className='nw-link-card__host'>{hostnameOf(url)}</span>
                    <span className='nw-link-card__url'>{url}</span>
                </span>
                <ExternalLink className='nw-link-card__icon' size={16} />
            </span>
        </a>
    );
}

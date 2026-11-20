import { useState } from 'react';
import { getMediaEmbedUrl } from '../helpers/getMediaEmbedUrl';
import { isFileVideo } from '../helpers/isFileVideo';
import NotificationLinkCard from './NotificationLinkCard';

interface Props {
    url: string;
    previewUrl: string | null;
    title: string;
}

/**
 * One page of a media notification: YouTube/Loom embed, video, link with preview, or image.
 * A URL that doesn't load as an image is shown as a link instead.
 */
export default function NotificationMediaItem({ url, previewUrl, title }: Props) {
    const [imageFailed, setImageFailed] = useState(false);
    const embedUrl = getMediaEmbedUrl(url);

    if (embedUrl) return (
        <iframe
            src={embedUrl}
            title={title}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
        />
    );
    if (isFileVideo(url)) return <video src={url} muted playsInline controls />;
    if (previewUrl || imageFailed) return <NotificationLinkCard url={url} previewUrl={previewUrl} title={title} />;
    return <img src={url} alt={title} referrerPolicy='no-referrer' onError={() => setImageFailed(true)} />;
}

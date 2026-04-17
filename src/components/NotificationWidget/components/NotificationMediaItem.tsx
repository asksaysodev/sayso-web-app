import { getYouTubeEmbedUrl, isFileVideo } from '../helpers/mediaUtils';

interface Props {
    url: string;
    title: string;
}

export default function NotificationMediaItem({ url, title }: Props) {
    const youtubeEmbed = getYouTubeEmbedUrl(url);

    if (youtubeEmbed) return (
        <iframe
            src={youtubeEmbed}
            title={`${title} — YouTube embed`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        />
    );

    if (isFileVideo(url)) return (
        <video src={url} muted playsInline controls />
    );

    return <img src={url} alt={title} referrerPolicy="no-referrer" />;
}

import { useState, useEffect } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { CreatedNotification } from '@/views/Admin/types';
import { getYouTubeEmbedUrl } from '@/views/Admin/components/NotificactionsAdmin/helpers/getYoutubeEmbedUrl';
import { isFileVideo } from '@/views/Admin/components/NotificactionsAdmin/helpers/isFileVideo';

export default function NotificationContent({ notification }: { notification: CreatedNotification }) {
    const { type, media_url, title, body } = notification;
    const [mediaIndex, setMediaIndex] = useState(0);

    useEffect(() => { setMediaIndex(0); }, [notification.id]);

    if (type === 'media' && media_url && media_url.length > 0) {
        const currentUrl = media_url[mediaIndex];
        const total = media_url.length;
        const youtubeEmbed = getYouTubeEmbedUrl(currentUrl);

        const renderItem = () => {
            if (youtubeEmbed) return (
                <iframe
                    src={youtubeEmbed}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            );
            if (isFileVideo(currentUrl)) return (
                <video src={currentUrl} muted playsInline controls />
            );
            return <img src={currentUrl} alt={title} referrerPolicy="no-referrer" />;
        };

        return (
            <div className="nw-media">
                {renderItem()}
                {total > 1 && (
                    <div className="nw-pagination nw-media-pagination">
                        <button
                            className="nw-pagination-btn"
                            onClick={() => setMediaIndex(i => Math.max(0, i - 1))}
                            disabled={mediaIndex === 0}
                        >
                            <LuChevronLeft />
                        </button>
                        <span className="nw-pagination-counter">{mediaIndex + 1} / {total}</span>
                        <button
                            className="nw-pagination-btn"
                            onClick={() => setMediaIndex(i => Math.min(total - 1, i + 1))}
                            disabled={mediaIndex === total - 1}
                        >
                            <LuChevronRight />
                        </button>
                    </div>
                )}
            </div>
        );
    }

    if (type === 'article') {
        return (
            <div className="nw-article">
                {body
                    ? <div className="nw-article-body" dangerouslySetInnerHTML={{ __html: body }} />
                    : <p className="nw-article-empty">No content yet.</p>
                }
            </div>
        );
    }

    return null;
}

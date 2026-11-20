import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CreatedNotification } from '@/views/Admin/types';
import { toMediaItem } from '../helpers/toMediaItem';
import NotificationMediaItem from './NotificationMediaItem';

export default function NotificationContent({ notification }: { notification: CreatedNotification }) {
    const { type, media_url, title, body } = notification;
    const [mediaIndex, setMediaIndex] = useState(0);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setMediaIndex(0); }, [notification.id]);

    if (type === 'media' && media_url && media_url.length > 0) {
        const total = media_url.length;
        const { url, previewUrl } = toMediaItem(media_url[Math.min(mediaIndex, total - 1)]);

        return (
            <div className="nw-media">
                <NotificationMediaItem key={url} url={url} previewUrl={previewUrl} title={title} />
                {total > 1 && (
                    <div className="nw-pagination nw-media-pagination">
                        <button
                            className="nw-pagination-btn"
                            onClick={() => setMediaIndex(i => Math.max(0, i - 1))}
                            disabled={mediaIndex === 0}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="nw-pagination-counter">{mediaIndex + 1} / {total}</span>
                        <button
                            className="nw-pagination-btn"
                            onClick={() => setMediaIndex(i => Math.min(total - 1, i + 1))}
                            disabled={mediaIndex === total - 1}
                        >
                            <ChevronRight size={16} />
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

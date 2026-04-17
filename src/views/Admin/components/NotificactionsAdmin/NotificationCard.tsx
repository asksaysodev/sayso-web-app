import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatedNotification } from "../../types";
import { STATUS_CONFIG } from "./helpers/adminConfig";
import { getStatus } from "./helpers/getStatus";
import { deleteNotification, updateNotification } from "../../services/notificationService";
import { MoreHorizontal, Trash2, PauseCircle, PlayCircle, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getYouTubeEmbedUrl } from "./helpers/getYoutubeEmbedUrl";
import { isFileVideo } from "./helpers/isFileVideo";
import NotificationExpandedViewer from "@/components/NotificationWidget/components/NotificationExpandedViewer";

export default function NotificationCard({ notification }: { notification: CreatedNotification }) {
    const { title, description, type, media_url } = notification;
    const status = getStatus(notification);
    const { label, dot, badge } = STATUS_CONFIG[status];
    const isInactive = status !== 'active';
    const [previewOpen, setPreviewOpen] = useState(false);

    const queryClient = useQueryClient();

    const { mutate: remove } = useMutation({
        mutationFn: () => deleteNotification(notification.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-notifications-bulk'] });
            queryClient.invalidateQueries({ queryKey: ['get-user-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['get-dismissed-notifications'] });
        },
    });

    const { mutate: toggle } = useMutation({
        mutationFn: () => updateNotification(notification.id, { active: !notification.active }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['get-notifications-bulk'] }),
    });

    const renderMedia = () => {
        if (!media_url || media_url.length === 0) return null;
        const firstUrl = media_url[0];
        const youtubeEmbed = getYouTubeEmbedUrl(firstUrl);
        if (youtubeEmbed) return (
            <iframe
                src={youtubeEmbed}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        );
        if (isFileVideo(firstUrl)) return (
            <video src={firstUrl} muted playsInline />
        );
        return <img src={firstUrl} alt={title} referrerPolicy="no-referrer" />;
    }

    return (
        <>
            <div className={cn(
                'notification-card group',
                isInactive && 'opacity-60 grayscale-[0.4] transition-all duration-200',
                isInactive && 'hover:opacity-100 hover:grayscale-0',
            )}>
                <div className="nc-header">
                    <div className="nc-header-top">
                        <div className="nc-header-text">
                            <Badge variant="outline" className={cn('nc-status-badge', badge)}>
                                <span className={cn('nc-status-badge-dot', dot)} />
                                {label}
                            </Badge>
                            <h3 className={cn('nc-title', isInactive && 'text-zinc-400')}>{title}</h3>
                            {description && <p className="nc-description">{description}</p>}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="nc-menu-button">
                                    <MoreHorizontal size={15} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setPreviewOpen(true)}>
                                    <Eye size={14} className="mr-2" /> Preview
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {status === 'expired' ? (
                                    <>
                                        {/* <DropdownMenuItem onClick={() => toggle()}>
                                            <PlayCircle size={14} className="mr-2" /> Re-publish
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator /> */}
                                        <DropdownMenuItem
                                            onClick={() => remove()}
                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                        >
                                            <Trash2 size={14} className="mr-2" /> Delete
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuItem onClick={() => toggle()}>
                                            {notification.active
                                                ? <><PauseCircle size={14} className="mr-2" /> Pause</>
                                                : <><PlayCircle size={14} className="mr-2" /> Activate</>
                                            }
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => remove()}
                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                        >
                                            <Trash2 size={14} className="mr-2" /> Delete
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {type === 'media' && media_url && media_url.length > 0 && (
                    <div className="nc-media">
                        {renderMedia()}
                        {media_url.length > 1 && (
                            <span className="nc-media-count">{media_url.length} items</span>
                        )}
                    </div>
                )}

                {type === 'article' && (
                    <div className="nc-article">
                        {notification.body
                            ? <div className="nc-article-body" dangerouslySetInnerHTML={{ __html: notification.body }} />
                            : <p className="nc-article-empty">No content yet.</p>
                        }
                    </div>
                )}
            </div>

            {previewOpen && (
                <NotificationExpandedViewer
                    notification={notification}
                    onClose={() => setPreviewOpen(false)}
                />
            )}
        </>
    );
}

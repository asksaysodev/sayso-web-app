import { useState, useMemo, useEffect, useCallback } from 'react';
import { CreatedNotification } from '@/types/notifications';
import { LuBellRing, LuX, LuExpand, LuShrink, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import './styles.css';
import SaysoButton from '../SaysoButton';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { NotificationBottomSheet } from './NotificationBottomSheet';
import useNotificationWidget from './hooks/useNotificationWidget';
import { useAuth } from '@/context/AuthContext';
import { getRemindedIds, addRemindedId } from './helpers/remindLater';
import { isNewUser, markWelcomeDone, getVisibleNotifications, isInWelcomeDelay } from './helpers/welcomeBucket';
import NotificationContent from './components/NotificationContent';
import NotificationExpandedViewer from './components/NotificationExpandedViewer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NotificationsHistoryBtnMenubar from './components/NotificationsHistoryBtnMenubar';

export default function NotificationWidget() {
    const { globalUser } = useAuth();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { userNotifications, isLoading, mutateDismissNotification } = useNotificationWidget({
        onDismissError: (id) => setLocalDismissedIds(prev => prev.filter(i => i !== id)),
    });

    const [isCollapsed, setIsCollapsed] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [remindedIds, setRemindedIds] = useState<string[]>(getRemindedIds);
    const [localDismissedIds, setLocalDismissedIds] = useState<string[]>([]);
    const [historyNotification, setHistoryNotification] = useState<CreatedNotification | null>(null);

    const filteredNotifications = useMemo(() => {
        if (!userNotifications) return [];
        return userNotifications.filter(n => !remindedIds.includes(n.id) && !localDismissedIds.includes(n.id));
    }, [userNotifications, remindedIds, localDismissedIds]);

    const userIsNew = useMemo(() =>
        globalUser?.created_at ? isNewUser(globalUser.created_at) : false,
    [globalUser]);

    const visibleNotifications = useMemo(() =>
        getVisibleNotifications(filteredNotifications, userIsNew),
    [filteredNotifications, userIsNew]);

    const notification = visibleNotifications[currentIndex];
    const total = visibleNotifications.length;

    const goPrev = () => setCurrentIndex(i => Math.max(0, i - 1));
    const goNext = () => setCurrentIndex(i => Math.min(total - 1, i + 1));

    const isLastWelcome = (notification?.is_welcome ?? false) &&
        visibleNotifications.filter(n => n.is_welcome).length === 1;

    const handleDismiss = () => {
        if (isLastWelcome) markWelcomeDone();
        setLocalDismissedIds(prev => [...prev, notification.id]);
        mutateDismissNotification(notification.id);
    };

    const handleRemindLater = () => {
        if (isLastWelcome) markWelcomeDone();
        const updated = addRemindedId(notification.id);
        setRemindedIds(updated);
    };
    
    useEffect(() => {
        if (visibleNotifications.length > 0 && currentIndex >= visibleNotifications.length) {
            setCurrentIndex(visibleNotifications.length - 1);
        }
    }, [visibleNotifications, currentIndex]);

    const handleOpenHistory = useCallback((notification: CreatedNotification) => {
        setHistoryNotification(notification);
        setIsCollapsed(false);
    }, []);

    const hideFooter = useMemo(() => !(notification?.remindable) && total <= 1, [notification, total])
    
    if (isLoading || visibleNotifications.length === 0) {
        if (historyNotification) {
            if (isMobile) {
                return (
                    <NotificationBottomSheet
                        notification={historyNotification}
                        currentIndex={0}
                        total={1}
                        readOnly
                        onDismiss={() => setHistoryNotification(null)}
                        onRemindLater={() => {}}
                        onPrev={() => {}}
                        onNext={() => {}}
                    />
                );
            }
            return (
                <NotificationExpandedViewer
                    notification={historyNotification}
                    onClose={() => setHistoryNotification(null)}
                />
            );
        }
        if (userIsNew && isInWelcomeDelay()) return null;
        return <NotificationsHistoryBtnMenubar onOpen={handleOpenHistory} />;
    }
    
    if (isMobile) {
        return (
            <NotificationBottomSheet
                notification={notification}
                currentIndex={currentIndex}
                total={total}
                onDismiss={handleDismiss}
                onRemindLater={handleRemindLater}
                onPrev={goPrev}
                onNext={goNext}
            />
        );
    }

    return (
        <div className={`nw-overlay ${isCollapsed ? 'nw-overlay--collapsed' : 'nw-overlay--expanded'}`}>
            <div className={`notification-widget ${isCollapsed ? 'notification-widget--collapsed' : 'notification-widget--expanded'}`}>

                <div className='nw-header'>
                    <div className='nw-header-left-container'>
                        <span className='nw-header-title'>{notification.title}</span>
                        {!isCollapsed && notification.description && (
                            <span className='nw-header-description'>{notification.description}</span>
                        )}
                    </div>
                    <div className='nw-header-actions'>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className='nw-header-btn' onClick={() => setIsCollapsed(prev => !prev)}>
                                        {isCollapsed ? <LuExpand /> : <LuShrink />}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent className='z-[70] bg-white text-zinc-800 border border-zinc-200 shadow-sm'>
                                    {isCollapsed ? 'Expand' : 'Collapse'}
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className='nw-header-btn' onClick={handleDismiss}>
                                        <LuX />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent className='z-[70] bg-white text-zinc-800 border border-zinc-200 shadow-sm'>
                                    Dismiss
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <div className='nw-content-container'>
                    <NotificationContent notification={notification} />
                </div>

                {!hideFooter && 
                    <div className='nw-footer'>
                        {notification.remindable && (
                            <SaysoButton
                                label='Remind Me Later'
                                icon={<LuBellRing />}
                                variant='outlined'
                                onClick={handleRemindLater}
                            />
                        )}
                        {total > 1 && (
                            <div className='nw-pagination'>
                                <button className='nw-pagination-btn' onClick={goPrev} disabled={currentIndex === 0}>
                                    <LuChevronLeft />
                                </button>
                                <span className='nw-pagination-counter'>{currentIndex + 1} / {total}</span>
                                <button className='nw-pagination-btn' onClick={goNext} disabled={currentIndex === total - 1}>
                                    <LuChevronRight />
                                </button>
                            </div>
                        )}
                    </div>
                }
            </div>
        </div>
    );
}

import {
    Menubar,
    MenubarContent,
    MenubarGroup,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
    MenubarLabel
} from "@/components/ui/menubar"
import useDismissedNotifications from "../hooks/useDismissedNotifications";
import { BookOpen } from 'lucide-react'
import { CreatedNotification } from '@/views/Admin/types';

interface Props {
    onOpen: (notification: CreatedNotification) => void;
}

export default function NotificationsHistoryBtnMenubar({ onOpen }: Props) {
    const { dismissedNotifications, isLoadingDismissedNotifications } = useDismissedNotifications();

    if (isLoadingDismissedNotifications || !dismissedNotifications?.length) return null;
    
    return (
        <div className='nw-history-anchor'>
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger className="p-1">
                        <BookOpen color="var(--sayso-dark)" size={18} />
                    </MenubarTrigger>
                    <MenubarContent align="end" className="nw-history-content">
                        <MenubarLabel className="nw-history-label">What's new</MenubarLabel>
                        <MenubarGroup>
                            {dismissedNotifications?.map((notification, index, arr) => (
                                <MenubarItem key={notification.id} onClick={() => onOpen(notification)} className="nw-history-item">
                                    <div className="nw-history-track">
                                        <div className={`nw-history-line${index === 0 ? ' nw-history-line--hidden' : ''}`} />
                                        <div className="nw-history-dot" />
                                        <div className={`nw-history-line${index === arr.length - 1 ? ' nw-history-line--hidden' : ''}`} />
                                    </div>
                                    <span className="nw-history-item-title">{notification.title}</span>
                                </MenubarItem>
                            ))}
                        </MenubarGroup>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    )
}
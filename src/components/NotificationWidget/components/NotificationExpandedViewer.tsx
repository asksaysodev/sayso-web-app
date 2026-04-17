import { X } from 'lucide-react';
import { CreatedNotification } from '@/types/notifications';
import NotificationContent from './NotificationContent';

interface Props {
    notification: CreatedNotification;
    onClose: () => void;
    zIndex?: number;
}

export default function NotificationExpandedViewer({ notification, onClose, zIndex = 200 }: Props) {
    return (
        <div className="nw-overlay nw-overlay--expanded" style={{ zIndex }}>
            <div className="notification-widget notification-widget--expanded">
                <div className="nw-header">
                    <div className="nw-header-left-container">
                        <span className="nw-header-title">{notification.title}</span>
                        {notification.description && (
                            <span className="nw-header-description">{notification.description}</span>
                        )}
                    </div>
                    <div className="nw-header-actions">
                        <button className="nw-header-btn" onClick={onClose}>
                            <X size={18} />
                        </button>
                    </div>
                </div>
                <div className="nw-content-container">
                    <NotificationContent notification={notification} />
                </div>
            </div>
        </div>
    );
}

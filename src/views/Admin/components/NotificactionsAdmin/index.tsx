import NotificationCard from "./NotificationCard";
import { useNotificationsAdmin } from "./NotificationsAdminContext";
import { BellOff } from "lucide-react";

export default function NotificationsAdmin() {
    const { isLoading, filteredNotifications } = useNotificationsAdmin();

    if (isLoading) return (
        <div className="notifications-admin-feedback">
            <span className="notifications-admin-spinner" />
            <span className="notifications-admin-feedback-text">Loading notifications…</span>
        </div>
    );

    if (filteredNotifications.length === 0) return (
        <div className="notifications-admin-feedback">
            <BellOff size={22} color="var(--sayso-lightgray)" strokeWidth={1.5} />
            <span className="notifications-admin-feedback-text">No notifications created yet.</span>
        </div>
    );

    return (
        <div className="notifications-admin-container">
            {filteredNotifications.map((notification) =>
                <NotificationCard key={notification.id} notification={notification} />
            )}
        </div>
    );
}
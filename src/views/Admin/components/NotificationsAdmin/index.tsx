import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ds/Badge';
import { Button } from '@/components/ds/Button';
import { Card } from '@/components/ds/Card';
import { Table, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from '@/components/ds/Table';
import { useAdminNotifications } from './hooks/useAdminNotifications';
import { AdminNotification } from './types';
import { describeAudience } from './utils/audience';
import { formatCentral } from './utils/centralTime';
import { STATUS_BADGE, hasEmail, isLive } from './utils/notificationForm';
import NotificationFormModal from './components/NotificationFormModal';
import NotificationRowActions from './components/NotificationRowActions';
import './styles/NotificationsAdmin.css';

type OpenForm = { notification?: AdminNotification } | null;

const STATUS_ORDER = ['sending', 'failed', 'scheduled', 'draft', 'published', 'canceled'];

/** Upcoming first (by publish date), then the rest newest first. */
const orderNotifications = (rows: AdminNotification[]) =>
    [...rows].sort((a, b) => {
        const byStatus = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
        if (byStatus) return byStatus;
        const aTime = new Date(a.publish_at ?? a.created_at).getTime();
        const bTime = new Date(b.publish_at ?? b.created_at).getTime();
        return a.status === 'scheduled' ? aTime - bTime : bTime - aTime;
    });

export default function NotificationsAdmin() {
    const { notifications, dryRun, isLoading, isError, isRetrying, refetch } = useAdminNotifications();
    const [openForm, setOpenForm] = useState<OpenForm>(null);

    const renderBody = () => {
        if (isLoading) return <p className='notifications-admin__state' role='status'>Loading notifications…</p>;
        if (isError) {
            return (
                <div className='notifications-admin__state' role='alert'>
                    Couldn't load notifications.
                    <Button variant='secondary' size='sm' onClick={() => refetch()} loading={isRetrying}>Try again</Button>
                </div>
            );
        }
        if (!notifications.length) {
            return <p className='notifications-admin__state'>No notifications yet.</p>;
        }
        return (
            <Table className='notifications-table'>
                <TableHeader>
                    <TableHeadCell>Notification</TableHeadCell>
                    <TableHeadCell>Audience</TableHeadCell>
                    <TableHeadCell>Publish date</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell aria-label='Actions' />
                </TableHeader>
                <TableBody>
                    {orderNotifications(notifications).map(n => {
                        const badge = STATUS_BADGE[n.status];
                        const email = hasEmail(n);
                        return (
                            <TableRow key={n.id}>
                                <TableCell>
                                    <button type='button' className='notifications-table__subject' onClick={() => setOpenForm({ notification: n })}>
                                        {email ? n.email_subject : n.title || 'Untitled'}
                                    </button>
                                    {email && n.in_app_enabled && n.title && (
                                        <span className='notifications-table__secondary'>In-app: {n.title}</span>
                                    )}
                                    {!email && <span className='notifications-table__secondary'>In-app only (no email)</span>}
                                </TableCell>
                                <TableCell className='notifications-table__audience'>{describeAudience(n.audience, n.include_staff)}</TableCell>
                                <TableCell className='notifications-table__date'>
                                    {n.publish_at ? formatCentral(n.publish_at) : <span className='notifications-table__empty'>Not set</span>}
                                </TableCell>
                                <TableCell>
                                    <div className='notifications-admin__badges'>
                                        <Badge tone={badge.tone}>{badge.label}</Badge>
                                        {n.in_app_enabled && <Badge tone='neutral'>In-app</Badge>}
                                        {isLive(n) && n.in_app_enabled && !n.active && <Badge tone='warning'>Paused</Badge>}
                                        {isLive(n) && n.expires_at && new Date(n.expires_at) < new Date() && (
                                            <Badge tone='neutral'>Expired</Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className='notifications-table__actions'>
                                    <NotificationRowActions notification={n} onEdit={() => setOpenForm({ notification: n })} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    };

    return (
        <Card className='notifications-admin'>
            <div className='notifications-admin__header'>
                <div className='notifications-admin__titles'>
                    <div className='notifications-admin__title-row'>
                        <h2 className='notifications-admin__title'>Notifications</h2>
                        {!isLoading && !isError && <span className='notifications-admin__count'>{notifications.length}</span>}
                        {dryRun && <Badge tone='warning'>Dry run: emails only reach the test list</Badge>}
                    </div>
                    <p className='notifications-admin__subtitle'>
                        Emails to an audience, with an optional in-app notification, sent at the publish date (CT).
                    </p>
                </div>
                <Button leftIcon={<Plus size={20} />} onClick={() => setOpenForm({})}>New notification</Button>
            </div>
            {renderBody()}
            {openForm && (
                <NotificationFormModal notification={openForm.notification} dryRun={dryRun} onClose={() => setOpenForm(null)} />
            )}
        </Card>
    );
}

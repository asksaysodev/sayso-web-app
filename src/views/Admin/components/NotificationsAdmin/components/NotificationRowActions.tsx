import { useState } from 'react';
import { Ban, Eye, MoreHorizontal, Pencil, PauseCircle, PlayCircle, Trash2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { ConfirmModal } from '@/components/ds/ConfirmModal';
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from '@/components/ds/Menu';
import NotificationExpandedViewer from '@/components/NotificationWidget/components/NotificationExpandedViewer';
import { CreatedNotification } from '../../../types';
import { useDeleteNotification, useSaveNotification } from '../hooks/useAdminNotifications';
import { AdminNotification } from '../types';
import { isFullyEditable, isLive } from '../utils/notificationForm';

interface Props {
    notification: AdminNotification;
    onEdit: () => void;
}

const toWidgetNotification = (n: AdminNotification): CreatedNotification => ({
    id: n.id,
    created_at: n.created_at,
    title: n.title ?? '',
    description: n.description,
    type: n.type ?? 'media',
    media_url: n.media_url,
    body: n.body,
    remindable: n.remindable,
    is_welcome: n.is_welcome,
    active: n.active,
    expires_at: n.expires_at,
});

/**
 * What each status allows:
 *   draft      edit, delete
 *   scheduled  edit, unschedule, cancel
 *   published  edit in-app, pause/activate, delete
 *   canceled   view, delete
 */
export default function NotificationRowActions({ notification: n, onEdit }: Props) {
    const [confirm, setConfirm] = useState<'delete' | 'cancel' | null>(null);
    const [previewInApp, setPreviewInApp] = useState(false);
    const { save, isSaving } = useSaveNotification();
    const { remove, isDeleting } = useDeleteNotification();

    const live = isLive(n);
    const canDelete = ['draft', 'published', 'failed', 'canceled'].includes(n.status);
    const editLabel = isFullyEditable(n) ? 'Edit' : live && n.in_app_enabled ? 'Edit in-app' : 'View';

    return (
        <>
            <Menu>
                <MenuTrigger asChild>
                    <Button variant='ghost' size='icon' aria-label={`Actions for ${n.email_subject || n.title || 'notification'}`}>
                        <MoreHorizontal size={18} />
                    </Button>
                </MenuTrigger>
                <MenuContent>
                    <MenuItem icon={<Pencil size={16} />} onSelect={onEdit}>{editLabel}</MenuItem>
                    {n.in_app_enabled && n.title && (
                        <MenuItem icon={<Eye size={16} />} onSelect={() => setPreviewInApp(true)}>Preview in-app</MenuItem>
                    )}
                    {n.status === 'scheduled' && (
                        <>
                            <MenuItem
                                icon={<Undo2 size={16} />}
                                onSelect={() => save({ id: n.id, action: 'unschedule' })}
                                disabled={isSaving}
                            >
                                Unschedule
                            </MenuItem>
                            <MenuItem icon={<Ban size={16} />} onSelect={() => setConfirm('cancel')}>Cancel</MenuItem>
                        </>
                    )}
                    {live && n.in_app_enabled && (
                        <MenuItem
                            icon={n.active ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
                            onSelect={() => save({ id: n.id, action: 'save', fields: { active: !n.active } })}
                            disabled={isSaving}
                        >
                            {n.active ? 'Pause in-app' : 'Activate in-app'}
                        </MenuItem>
                    )}
                    {canDelete && (
                        <>
                            <MenuSeparator />
                            <MenuItem icon={<Trash2 size={16} />} tone='destructive' onSelect={() => setConfirm('delete')}>
                                Delete
                            </MenuItem>
                        </>
                    )}
                </MenuContent>
            </Menu>

            {confirm === 'delete' && (
                <ConfirmModal
                    open
                    onOpenChange={open => !open && setConfirm(null)}
                    title='Delete this notification?'
                    description={
                        live
                            ? 'Its in-app notification disappears for everyone. Emails already sent stay in inboxes.'
                            : 'This cannot be undone.'
                    }
                    confirmLabel='Delete'
                    loading={isDeleting}
                    onConfirm={() => remove(n.id, { onSettled: () => setConfirm(null) })}
                />
            )}
            {confirm === 'cancel' && (
                <ConfirmModal
                    open
                    onOpenChange={open => !open && setConfirm(null)}
                    title='Cancel this notification?'
                    description='It will not go out. Use Unschedule instead to keep it as a draft.'
                    confirmLabel='Cancel notification'
                    cancelLabel='Keep it'
                    loading={isSaving}
                    onConfirm={() => save({ id: n.id, action: 'cancel' }, { onSettled: () => setConfirm(null) })}
                />
            )}
            {previewInApp && (
                <NotificationExpandedViewer notification={toWidgetNotification(n)} onClose={() => setPreviewInApp(false)} />
            )}
        </>
    );
}

import { useState, type FormEvent } from 'react';
import { Bell, Eye, Lock, Send } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Checkbox } from '@/components/ds/Checkbox';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import { TextField } from '@/components/ds/TextField';
import { useSaveNotification, useSendNotificationTest } from '../hooks/useAdminNotifications';
import { AdminNotification, NotificationAction, NotificationFormValues } from '../types';
import {
    emptyForm,
    hasEmail,
    isFullyEditable,
    isLive,
    liveEditProblems,
    publishProblems,
    toFormValues,
    toInAppPayload,
    toPayload,
} from '../utils/notificationForm';
import { centralToIso } from '../utils/centralTime';
import AudienceFields from './AudienceFields';
import InAppFields from './InAppFields';
import EmailPreviewModal from './EmailPreviewModal';
import ConfirmPublishModal from './ConfirmPublishModal';
import '../styles/NotificationFormModal.css';

interface Props {
    /** Omit to create a new notification. */
    notification?: AdminNotification;
    dryRun: boolean;
    onClose: () => void;
}

/**
 * Create or edit a notification: an email (subject + pasted HTML) to an audience, with an
 * optional in-app part, going out at the publish date (CT).
 *
 * - new / draft: Save draft, Schedule, Send now
 * - scheduled:   Save changes (stays scheduled), Send now
 * - published:   the email is locked; the in-app part can still change
 */
export default function NotificationFormModal({ notification, dryRun, onClose }: Props) {
    const [initial] = useState<NotificationFormValues>(() => (notification ? toFormValues(notification) : emptyForm()));
    const [values, setValues] = useState<NotificationFormValues>(initial);
    const [showPreview, setShowPreview] = useState(false);
    const [confirm, setConfirm] = useState<'schedule' | 'send_now' | null>(null);
    const { save, isSaving, savingAction } = useSaveNotification();
    const { sendTest, isSendingTest } = useSendNotificationTest();

    const status = notification?.status ?? 'draft';
    const editable = !notification || isFullyEditable(notification);
    const live = !!notification && isLive(notification);
    const canEditInApp = editable || (live && notification.in_app_enabled);
    const readOnly = !editable && !canEditInApp;
    const isDirty = JSON.stringify(values) !== JSON.stringify(initial);
    const legacy = !!notification && !hasEmail(notification);

    const set = <K extends keyof NotificationFormValues>(key: K, value: NotificationFormValues[K]) =>
        setValues(current => ({ ...current, [key]: value }));

    const publishAt = values.publishDate ? centralToIso(values.publishDate, values.publishTime) : null;
    const scheduleProblems = editable ? publishProblems(values) : [];
    const sendNowProblems = editable ? publishProblems(values, { sendNow: true }) : [];
    const liveProblems = live ? liveEditProblems(values) : [];
    // A scheduled notification stays scheduled on save, so it must stay valid.
    const saveProblems = status === 'scheduled' ? scheduleProblems : live ? liveProblems : [];

    const submit = (action: NotificationAction) => {
        const fields = live ? toInAppPayload(values) : toPayload(values);
        save({ id: notification?.id, action, fields }, { onSuccess: onClose });
    };

    const handleSave = (event: FormEvent) => {
        event.preventDefault();
        if (readOnly || saveProblems.length) return;
        submit('save');
    };

    const handleOpenChange = (open: boolean) => {
        if (!open && !isSaving) onClose();
    };

    const title = !notification ? 'New notification' : readOnly ? 'Notification' : 'Edit notification';
    const visibleProblems = status === 'scheduled' || live ? saveProblems : scheduleProblems;

    return (
        <>
            <Modal
                open={!showPreview && !confirm}
                onOpenChange={handleOpenChange}
                hideClose={isSaving}
                className='notification-form-modal'
                aria-describedby={undefined}
            >
                <form onSubmit={handleSave}>
                    <ModalHeader icon={<Bell size={24} />} title={title} />
                    <ModalBody>
                        <div className='notification-form'>
                            {live && (
                                <p className='notification-form__notice'>
                                    <Lock size={18} aria-hidden='true' />
                                    <span>
                                        {legacy
                                            ? 'This notification was created before emails. Only its in-app part can change.'
                                            : notification.in_app_enabled
                                                ? 'The email has gone out, so only the in-app part can change.'
                                                : 'The email has gone out and there is no in-app part, so nothing can change.'}
                                    </span>
                                </p>
                            )}
                            {status === 'canceled' && (
                                <p className='notification-form__notice'>
                                    <Lock size={18} aria-hidden='true' />
                                    <span>This notification was canceled before it went out.</span>
                                </p>
                            )}
                            {notification?.status === 'failed' && notification.email_error && (
                                <p className='notification-form__error' role='alert'>
                                    The email stopped partway: {notification.email_error}. It is retried automatically (attempt{' '}
                                    {notification.email_attempts} of 3).
                                </p>
                            )}

                            {!legacy && (
                                <section className='notification-form__section'>
                                    <h3 className='notification-form__section-title'>Email</h3>
                                    <TextField
                                        label='Subject'
                                        value={values.emailSubject}
                                        onChange={event => set('emailSubject', event.target.value)}
                                        placeholder='e.g. The Ultimate Script Book is here'
                                        disabled={!editable || isSaving}
                                        maxLength={300}
                                    />
                                    <label className='notification-form__html'>
                                        <span>Email HTML</span>
                                        <textarea
                                            rows={12}
                                            value={values.emailHtml}
                                            onChange={event => set('emailHtml', event.target.value)}
                                            placeholder='Paste the full email HTML here. The unsubscribe footer is added for you.'
                                            spellCheck={false}
                                            disabled={!editable || isSaving}
                                        />
                                    </label>
                                    <div className='notification-form__actions-row'>
                                        <Button
                                            variant='secondary'
                                            size='sm'
                                            leftIcon={<Eye size={16} />}
                                            onClick={() => setShowPreview(true)}
                                            disabled={!values.emailHtml.trim()}
                                        >
                                            Preview
                                        </Button>
                                        <Button
                                            variant='secondary'
                                            size='sm'
                                            leftIcon={<Send size={16} />}
                                            onClick={() => sendTest({ subject: values.emailSubject.trim(), html: values.emailHtml })}
                                            loading={isSendingTest}
                                            disabled={!values.emailSubject.trim() || !values.emailHtml.trim()}
                                        >
                                            Send test to me
                                        </Button>
                                    </div>
                                </section>
                            )}

                            {!legacy && (
                                <section className='notification-form__section'>
                                    <h3 className='notification-form__section-title'>Audience</h3>
                                    <p className='notification-form__hint'>Gets the email, and the in-app notification if it has one.</p>
                                    <AudienceFields
                                        audience={values.audience}
                                        includeStaff={values.includeStaff}
                                        onChange={audience => set('audience', audience)}
                                        onIncludeStaffChange={includeStaff => set('includeStaff', includeStaff)}
                                        disabled={!editable || isSaving}
                                    />
                                </section>
                            )}

                            {!legacy && (
                                <section className='notification-form__section'>
                                    <h3 className='notification-form__section-title'>Publish date</h3>
                                    <div className='notification-form__publish'>
                                        <TextField
                                            className='notification-form__date'
                                            label='Date (CT)'
                                            type='date'
                                            value={values.publishDate}
                                            onChange={event => set('publishDate', event.target.value)}
                                            disabled={!editable || isSaving}
                                        />
                                        <TextField
                                            className='notification-form__date'
                                            label='Time (CT)'
                                            type='time'
                                            step={900}
                                            value={values.publishTime}
                                            onChange={event => set('publishTime', event.target.value)}
                                            disabled={!editable || isSaving}
                                        />
                                    </div>
                                    <p className='notification-form__hint'>
                                        The email and the in-app notification go out together, up to 15 minutes after this time.
                                    </p>
                                </section>
                            )}

                            <section className='notification-form__section'>
                                {legacy ? (
                                    <h3 className='notification-form__section-title'>In-app notification</h3>
                                ) : (
                                    <Checkbox
                                        className='notification-form__in-app-toggle'
                                        label='Also show an in-app notification'
                                        checked={values.inAppEnabled}
                                        onChange={event => set('inAppEnabled', event.target.checked)}
                                        disabled={!editable || isSaving}
                                    />
                                )}
                                {values.inAppEnabled && (
                                    <InAppFields values={values} set={set} disabled={!canEditInApp || isSaving} />
                                )}
                            </section>

                            {isDirty && visibleProblems.length > 0 && (
                                <ul className='notification-form__problems'>
                                    {visibleProblems.map(problem => <li key={problem}>{problem}</li>)}
                                </ul>
                            )}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='secondary' onClick={onClose} disabled={isSaving}>
                            {readOnly ? 'Close' : 'Cancel'}
                        </Button>
                        {(status === 'draft' || !notification) && (
                            <>
                                <Button
                                    type='submit'
                                    variant='secondary'
                                    disabled={isSaving || (!!notification && !isDirty)}
                                    loading={savingAction === 'save'}
                                >
                                    Save draft
                                </Button>
                                <Button
                                    variant='secondary'
                                    leftIcon={<Send size={16} />}
                                    onClick={() => setConfirm('send_now')}
                                    disabled={isSaving || sendNowProblems.length > 0}
                                >
                                    Send now
                                </Button>
                                <Button onClick={() => setConfirm('schedule')} disabled={isSaving || scheduleProblems.length > 0}>
                                    Schedule
                                </Button>
                            </>
                        )}
                        {status === 'scheduled' && (
                            <>
                                <Button
                                    variant='secondary'
                                    leftIcon={<Send size={16} />}
                                    onClick={() => setConfirm('send_now')}
                                    disabled={isSaving || sendNowProblems.length > 0}
                                >
                                    Send now
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={isSaving || !isDirty || saveProblems.length > 0}
                                    loading={savingAction === 'save'}
                                >
                                    Save changes
                                </Button>
                            </>
                        )}
                        {live && notification.in_app_enabled && (
                            <Button type='submit' disabled={isSaving || !isDirty || saveProblems.length > 0} loading={isSaving}>
                                Save changes
                            </Button>
                        )}
                    </ModalFooter>
                </form>
            </Modal>

            {showPreview && (
                <EmailPreviewModal
                    subject={values.emailSubject}
                    emailHtml={values.emailHtml}
                    onClose={() => setShowPreview(false)}
                />
            )}
            {confirm && (
                <ConfirmPublishModal
                    mode={confirm}
                    subject={values.emailSubject.trim()}
                    audience={values.audience}
                    includeStaff={values.includeStaff}
                    inAppEnabled={values.inAppEnabled}
                    publishAt={publishAt}
                    dryRun={dryRun}
                    loading={isSaving}
                    onCancel={() => setConfirm(null)}
                    onConfirm={() => submit(confirm)}
                />
            )}
        </>
    );
}

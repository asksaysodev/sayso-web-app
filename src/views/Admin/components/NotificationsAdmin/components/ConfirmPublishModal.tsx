import { CalendarClock, Send } from 'lucide-react';
import { ConfirmModal } from '@/components/ds/ConfirmModal';
import { Audience } from '../types';
import { describeAudience } from '../utils/audience';
import { formatCentral } from '../utils/centralTime';

interface Props {
    mode: 'schedule' | 'send_now';
    subject: string;
    audience: Audience;
    includeStaff: boolean;
    inAppEnabled: boolean;
    /** UTC ISO, for schedule. */
    publishAt: string | null;
    dryRun: boolean;
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

/** Confirms who gets it, in words, before anything is scheduled or sent. No counts, by design. */
export default function ConfirmPublishModal({
    mode,
    subject,
    audience,
    includeStaff,
    inAppEnabled,
    publishAt,
    dryRun,
    loading,
    onConfirm,
    onCancel,
}: Props) {
    const sendNow = mode === 'send_now';
    const when = sendNow ? 'now' : publishAt ? `on ${formatCentral(publishAt)}` : '';

    return (
        <ConfirmModal
            open
            onOpenChange={open => !open && onCancel()}
            tone='primary'
            icon={sendNow ? <Send size={24} /> : <CalendarClock size={24} />}
            title={sendNow ? 'Send this notification now?' : 'Schedule this notification?'}
            description={`“${subject}” goes out ${when}.`}
            confirmLabel={sendNow ? 'Send now' : 'Schedule'}
            onConfirm={onConfirm}
            loading={loading}
        >
            <dl className='notification-confirm'>
                <dt>Email to</dt>
                <dd>{describeAudience(audience, includeStaff)}</dd>
                <dt>In-app notification</dt>
                <dd>{inAppEnabled ? 'Yes, for the same audience' : 'No, email only'}</dd>
            </dl>
            {dryRun && (
                <p className='notification-confirm__dry-run'>
                    Dry run is on: emails only go to the server's test list. The in-app part still goes live for this audience.
                </p>
            )}
        </ConfirmModal>
    );
}

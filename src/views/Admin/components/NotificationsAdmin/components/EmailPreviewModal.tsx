import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import { SegmentedControl } from '@/components/ds/SegmentedControl';
import { usePreviewNotificationEmail } from '../hooks/useAdminNotifications';
import '../styles/EmailPreviewModal.css';

type Width = 'desktop' | 'mobile';
const WIDTH_ITEMS: { value: Width; label: string }[] = [
    { value: 'desktop', label: 'Desktop' },
    { value: 'mobile', label: 'Mobile' },
];

interface Props {
    subject: string;
    emailHtml: string;
    onClose: () => void;
}

/**
 * The email as recipients get it: the pasted HTML plus the unsubscribe footer, rendered by
 * the server. The iframe is fully sandboxed (no scripts, no same-origin), so pasted HTML
 * can't run code or reach the app's session, and its styles can't leak into the page.
 */
export default function EmailPreviewModal({ subject, emailHtml, onClose }: Props) {
    const [width, setWidth] = useState<Width>('desktop');
    const { html, isLoading, isError } = usePreviewNotificationEmail(emailHtml, true);

    return (
        <Modal open onOpenChange={open => !open && onClose()} className='email-preview-modal' aria-describedby={undefined}>
            <ModalHeader icon={<Mail size={24} />} title='Email preview' description={subject || 'No subject yet'} />
            <ModalBody>
                <div className='email-preview'>
                    <SegmentedControl aria-label='Preview width' items={WIDTH_ITEMS} value={width} onChange={setWidth} />
                    {isLoading && <p className='email-preview__state' role='status'>Rendering…</p>}
                    {isError && <p className='email-preview__state' role='alert'>Couldn't render the preview. Please try again.</p>}
                    {html && (
                        <div className={`email-preview__frame email-preview__frame--${width}`}>
                            <iframe title='Email preview' sandbox='' srcDoc={html} />
                        </div>
                    )}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button variant='secondary' onClick={onClose}>Close</Button>
            </ModalFooter>
        </Modal>
    );
}

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import { SegmentedControl } from '@/components/ds/SegmentedControl';
import { usePreviewNotificationEmail } from '../hooks/useAdminNotifications';
import { EmailSource } from '../services/notificationsApi';
import '../styles/EmailPreviewModal.css';

type Width = 'desktop' | 'mobile';
const WIDTH_ITEMS: { value: Width; label: string }[] = [
    { value: 'desktop', label: 'Desktop' },
    { value: 'mobile', label: 'Mobile' },
];

type Theme = 'light' | 'dark';
const THEME_ITEMS: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
];

/**
 * The email follows the reader's system theme through `prefers-color-scheme`. To show a
 * chosen theme whatever the admin's own setting, the dark block is forced on or off.
 */
const DARK_QUERY = /@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)/gi;
const withTheme = (html: string, theme: Theme) =>
    html.replace(DARK_QUERY, theme === 'dark' ? '@media all' : '@media not all');

interface Props {
    subject: string;
    source: EmailSource;
    onClose: () => void;
}

/**
 * The email as recipients get it, rendered by the server: the Sayso header, the built
 * content and the footer (or an older row's pasted HTML). The iframe is fully sandboxed
 * (no scripts, no same-origin), so nothing in it can run code or reach the app's session,
 * and its styles can't leak into the page.
 */
export default function EmailPreviewModal({ subject, source, onClose }: Props) {
    const [width, setWidth] = useState<Width>('desktop');
    const [theme, setTheme] = useState<Theme>('light');
    const { html, isLoading, isError } = usePreviewNotificationEmail(source, true);

    return (
        <Modal open onOpenChange={open => !open && onClose()} className='email-preview-modal' aria-describedby={undefined}>
            <ModalHeader icon={<Mail size={24} />} title='Email preview' description={subject || 'No subject yet'} />
            <ModalBody>
                <div className='email-preview'>
                    <div className='email-preview__controls'>
                        <SegmentedControl aria-label='Preview width' items={WIDTH_ITEMS} value={width} onChange={setWidth} />
                        <SegmentedControl aria-label='Preview theme' items={THEME_ITEMS} value={theme} onChange={setTheme} />
                    </div>
                    {isLoading && <p className='email-preview__state' role='status'>Rendering…</p>}
                    {isError && <p className='email-preview__state' role='alert'>Couldn't render the preview. Please try again.</p>}
                    {html && (
                        <div className={`email-preview__frame email-preview__frame--${width} email-preview__frame--${theme}`}>
                            <iframe title='Email preview' sandbox='' srcDoc={withTheme(html, theme)} />
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

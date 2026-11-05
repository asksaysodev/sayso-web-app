import { useState } from 'react';
import { CloudAlert, LoaderCircle, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Modal, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import { useToast } from '@/context/ToastContext';
import useCrmResync from '../hooks/useCrmResync';
import '../styles/CrmResyncModal.css';

type Stage = 'confirm' | 'loading' | 'error';

interface Props {
    conversationId: string;
    leadName: string;
    providerLabel: string;
    onClose: () => void;
}

/** Mount it only while open: each mount starts at the confirm step. */
export default function CrmResyncModal({ conversationId, leadName, providerLabel, onClose }: Props) {
    const [stage, setStage] = useState<Stage>('confirm');
    const { resync } = useCrmResync();
    const { showToast } = useToast();

    const startResync = async () => {
        setStage('loading');
        if (await resync(conversationId)) {
            onClose();
            showToast('success', 'Notes saved. Conversation resynced.');
        } else {
            setStage('error');
        }
    };

    const target = (
        <>
            <strong>{leadName}</strong> in <strong>{providerLabel}</strong>
        </>
    );

    return (
        <Modal
            open
            onOpenChange={next => { if (!next && stage !== 'loading') onClose(); }}
            hideClose={stage === 'loading'}
            className={`crm-resync-modal crm-resync-modal--${stage}`}
        >
            {stage === 'confirm' && (
                <>
                    <ModalHeader
                        icon={<TriangleAlert size={32} />}
                        title="Resync this conversation?"
                        description={<>This conversation is synced with {target}. Your captured notes have changed.</>}
                    />
                    <ModalFooter>
                        <Button variant="secondary" onClick={onClose}>Dismiss</Button>
                        <Button onClick={() => void startResync()}>Yes, resync</Button>
                    </ModalFooter>
                </>
            )}
            {stage === 'loading' && (
                <>
                    <ModalHeader
                        icon={<LoaderCircle size={32} className="crm-resync-spinner" />}
                        title="Resyncing conversation..."
                        description={<>Your notes are saved in Sayso. We’re resyncing this conversation with {target}.</>}
                    />
                    <ModalFooter>
                        <Button loading disabled>Resyncing...</Button>
                    </ModalFooter>
                </>
            )}
            {stage === 'error' && (
                <>
                    <ModalHeader
                        tone="danger"
                        icon={<CloudAlert size={32} />}
                        title="Couldn’t resync conversation"
                        description={<>Your original notes have been saved. We couldn’t resync this conversation with {target}.</>}
                    />
                    <ModalFooter>
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button onClick={() => void startResync()}>Retry</Button>
                    </ModalFooter>
                </>
            )}
        </Modal>
    );
}

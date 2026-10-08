import { useState } from 'react';
import { Card } from '@/components/ds/Card';
import { useAdminPlaybooks } from './hooks/useAdminPlaybooks';
import { AdminPlaybook } from './types';
import PlaybooksCardHeader from './components/PlaybooksCardHeader';
import PlaybooksProcessingNote from './components/PlaybooksProcessingNote';
import PlaybooksState from './components/PlaybooksState';
import PlaybooksTable from './components/PlaybooksTable';
import UploadPlaybookModal from './components/UploadPlaybookModal';
import DeletePlaybookModal from './components/DeletePlaybookModal';
import './styles/PlaybooksAdmin.css';

type OpenModal = { kind: 'upload' } | { kind: 'delete'; playbook: AdminPlaybook } | null;

export default function PlaybooksAdmin() {
    const { playbooks, isLoading, isError, isRetrying, refetch, isEmpty, processingCount } = useAdminPlaybooks();
    const [openModal, setOpenModal] = useState<OpenModal>(null);

    const openUpload = () => setOpenModal({ kind: 'upload' });
    const closeModal = () => setOpenModal(null);

    const renderBody = () => {
        if (isLoading) return <PlaybooksState state='loading' />;
        if (isError) return <PlaybooksState state='error' onRetry={refetch} isRetrying={isRetrying} />;
        if (isEmpty) return <PlaybooksState state='empty' onUpload={openUpload} />;
        return (
            <>
                {processingCount > 0 && <PlaybooksProcessingNote count={processingCount} />}
                <PlaybooksTable playbooks={playbooks} onDelete={playbook => setOpenModal({ kind: 'delete', playbook })} />
            </>
        );
    };

    return (
        <Card className='playbooks-admin'>
            <PlaybooksCardHeader
                count={isLoading || isError ? undefined : playbooks.length}
                isRefreshing={isRetrying}
                onRefresh={refetch}
                onUpload={openUpload}
            />
            {renderBody()}
            {openModal?.kind === 'upload' && <UploadPlaybookModal onClose={closeModal} />}
            {openModal?.kind === 'delete' && <DeletePlaybookModal playbook={openModal.playbook} onClose={closeModal} />}
        </Card>
    );
}

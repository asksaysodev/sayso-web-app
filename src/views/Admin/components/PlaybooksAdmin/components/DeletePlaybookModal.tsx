import { ConfirmModal } from '@/components/ds/ConfirmModal';
import { useDeletePlaybook } from '../hooks/useDeletePlaybook';
import { AdminPlaybook } from '../types';
import playbookDisplayName from '../utils/playbookDisplayName';
import DeletePlaybookWarning from './DeletePlaybookWarning';
import '../styles/DeletePlaybookModal.css';

interface Props {
    playbook: AdminPlaybook;
    onClose: () => void;
}

export default function DeletePlaybookModal({ playbook, onClose }: Props) {
    const { deletePlaybook, isPending } = useDeletePlaybook();
    const { defaultUsersCount, isSystemDefault } = playbook;
    const hasWarnings = defaultUsersCount > 0 || isSystemDefault;

    const handleConfirm = () => {
        deletePlaybook(playbook.id, { onSettled: onClose });
    };

    return (
        <ConfirmModal
            open
            onOpenChange={open => !open && onClose()}
            title={`Delete "${playbookDisplayName(playbook)}"?`}
            description="This removes the script for all Sayso users. This action can't be undone."
            confirmLabel='Yes, delete'
            onConfirm={handleConfirm}
            loading={isPending}
        >
            {hasWarnings && (
                <div className='delete-playbook-modal__warnings'>
                    {defaultUsersCount > 0 && (
                        <DeletePlaybookWarning tone='warning'>
                            <strong>{defaultUsersCount === 1 ? '1 user has' : `${defaultUsersCount} users have`}</strong>{' '}
                            this as their default playbook. Their default will be removed.
                        </DeletePlaybookWarning>
                    )}
                    {isSystemDefault && (
                        <DeletePlaybookWarning tone='error'>
                            <strong>This is the system default.</strong> Users without their own default won't have a default playbook at all.
                        </DeletePlaybookWarning>
                    )}
                </div>
            )}
        </ConfirmModal>
    );
}

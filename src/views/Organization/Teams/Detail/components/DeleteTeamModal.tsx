import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from '@/components/ds/ConfirmModal';
import ModalError from '@/views/Organization/shared/components/ModalError';
import useDeleteTeam from '../../hooks/useDeleteTeam';

interface Props {
    teamId: string;
    onClose: () => void;
}

export default function DeleteTeamModal({ teamId, onClose }: Props) {
    const navigate = useNavigate();
    const { deleteTeam, isPending, errorMessage } = useDeleteTeam();

    const handleConfirm = () => {
        deleteTeam(teamId, { onSuccess: () => navigate('/organization?tab=teams', { replace: true }) });
    };

    return (
        <ConfirmModal
            open
            onOpenChange={(open) => !open && onClose()}
            tone='danger'
            title='Are you sure you want to delete this team?'
            description='Its members stay in your organization without a team. This action cannot be undone.'
            confirmLabel='Yes, delete'
            onConfirm={handleConfirm}
            loading={isPending}
        >
            {errorMessage && <ModalError message={errorMessage} />}
        </ConfirmModal>
    );
}

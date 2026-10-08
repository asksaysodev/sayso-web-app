import { ConfirmModal } from '@/components/ds/ConfirmModal';
import ModalError from '@/views/Organization/shared/components/ModalError';
import useRemoveTeamMember from '../../hooks/useRemoveTeamMember';

interface Props {
    teamId: string;
    accountId: string;
    onClose: () => void;
}

export default function RemoveFromTeamModal({ teamId, accountId, onClose }: Props) {
    const { removeTeamMember, isPending, errorMessage } = useRemoveTeamMember();

    return (
        <ConfirmModal
            open
            onOpenChange={(open) => !open && onClose()}
            tone='danger'
            title='Are you sure you want to remove this team member?'
            description='They stay in your organization without a team. You can add them to a team again later.'
            confirmLabel='Yes, remove'
            onConfirm={() => removeTeamMember({ teamId, accountId }, { onSuccess: onClose })}
            loading={isPending}
        >
            {errorMessage && <ModalError message={errorMessage} />}
        </ConfirmModal>
    );
}

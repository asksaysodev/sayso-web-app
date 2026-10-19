import { ConfirmModal } from '@/components/ds/ConfirmModal';
import useRemoveMember from '../hooks/useRemoveMember';
import useRevokeInvite from '../hooks/useRevokeInvite';
import type { CompanyMemberRow } from '../types';
import ModalError from '@/views/Organization/shared/components/ModalError';

interface Props {
    row: CompanyMemberRow;
    onClose: () => void;
}

/** Remove a real member, or revoke an invite — an invite is not an account, so it never hits the member endpoint. */
export default function RemoveMemberModal({ row, onClose }: Props) {
    const remove = useRemoveMember();
    const revoke = useRevokeInvite();
    const { isPending, errorMessage } = row.isInvite ? revoke : remove;

    const handleConfirm = () => {
        const options = { onSuccess: onClose };
        if (row.isInvite) revoke.revokeInvite(row.id, options);
        else remove.removeMember(row.id, options);
    };

    return (
        <ConfirmModal
            open
            onOpenChange={(open) => !open && onClose()}
            tone='danger'
            title={row.isInvite ? 'Are you sure you want to revoke this invite?' : 'Are you sure you want to remove this member from this company?'}
            description={
                row.isInvite
                    ? `${row.email} won't be able to join with this invite. You can send a new one later.`
                    : "This action cannot be undone. Their account and history are permanently deleted, not deactivated. If you want to add them again, you'll need to send a new invite."
            }
            confirmLabel={row.isInvite ? 'Yes, revoke' : 'Yes, remove'}
            onConfirm={handleConfirm}
            loading={isPending}
        >
            {errorMessage && <ModalError message={errorMessage} />}
        </ConfirmModal>
    );
}

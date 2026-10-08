import { useMemo, useState, type FormEvent } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import useCompanyMembers from '@/views/Organization/Company/hooks/useCompanyMembers';
import MemberPicker from '@/views/Organization/shared/components/MemberPicker/MemberPicker';
import ModalError from '@/views/Organization/shared/components/ModalError';
import useAddTeamMembers from '../../hooks/useAddTeamMembers';
import './AddTeamMemberModal.css';

interface Props {
    teamId: string;
    teamName: string;
    onClose: () => void;
}

export default function AddTeamMemberModal({ teamId, teamName, onClose }: Props) {
    const { addTeamMembers, isPending, errorMessage, reset } = useAddTeamMembers();
    const { members, isLoading, isError } = useCompanyMembers();
    const [accountIds, setAccountIds] = useState<string[]>([]);

    const accounts = useMemo(() => members.filter((member) => !member.isInvite), [members]);
    const selectableIds = accountIds.filter((id) => accounts.some((account) => account.id === id && !account.team_id));

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (selectableIds.length === 0 || isPending) return;
        addTeamMembers({ teamId, accountIds: selectableIds }, { onSuccess: onClose });
    };

    return (
        <Modal open onOpenChange={(open) => !open && !isPending && onClose()}>
            <ModalContent hideClose={isPending}>
                <form className='add-team-member-modal__form' onSubmit={handleSubmit}>
                    <ModalHeader
                        icon={<UserPlus size={24} />}
                        title='Add member'
                        description={`Add company members to ${teamName}.`}
                    />
                    <ModalBody>
                        <MemberPicker
                            label='Members'
                            members={accounts}
                            value={selectableIds}
                            onChange={(ids) => {
                                setAccountIds(ids);
                                if (errorMessage) reset();
                            }}
                            isLoading={isLoading}
                            isError={isError}
                            disabled={isPending}
                        />
                        <ModalError message={errorMessage} />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='secondary' onClick={onClose} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type='submit' disabled={selectableIds.length === 0} loading={isPending}>
                            Save
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

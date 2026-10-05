import { useMemo, useState, type FormEvent } from 'react';
import { BookUser } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import { NumberField } from '@/components/ds/NumberField';
import { TextField } from '@/components/ds/TextField';
import useCompanyMembers from '@/views/Organization/Company/hooks/useCompanyMembers';
import MemberPicker from '@/views/Organization/shared/components/MemberPicker/MemberPicker';
import ModalError from '@/views/Organization/shared/components/ModalError';
import useCreateTeam from '../hooks/useCreateTeam';
import TeamCreated from './TeamCreated';
import './AddTeamModal.css';

const NAME_MAX_LENGTH = 80;
const HOUR_CAP_MAX = 10000;

interface Props {
    onClose: () => void;
}

export default function AddTeamModal({ onClose }: Props) {
    const { createTeam, isPending, created, error, reset } = useCreateTeam();
    const { members, isLoading: membersLoading, isError: membersError } = useCompanyMembers();
    const [name, setName] = useState('');
    const [accountIds, setAccountIds] = useState<string[]>([]);
    const [hourCap, setHourCap] = useState<number | null>(null);

    const accounts = useMemo(() => members.filter((member) => !member.isInvite), [members]);
    const selectableIds = accountIds.filter((id) => accounts.some((account) => account.id === id && !account.team_id));
    const trimmedName = name.trim();

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (!trimmedName || isPending) return;
        createTeam({ name: trimmedName, hourCap, accountIds: selectableIds });
    };

    const clearError = () => {
        if (error) reset();
    };

    return (
        <Modal open onOpenChange={(open) => !open && !isPending && onClose()}>
            <ModalContent hideClose={isPending}>
                {created ? (
                    <TeamCreated created={created} onClose={onClose} />
                ) : (
                    <form className='add-team-modal__form' onSubmit={handleSubmit}>
                        <ModalHeader
                            icon={<BookUser size={24} />}
                            title='Add team'
                            description='Create a new team, add its members, and their allocated hours.'
                        />
                        <ModalBody>
                            <TextField
                                label={
                                    <>
                                        Team name<span className='add-team-modal__required'>*</span>
                                    </>
                                }
                                value={name}
                                onChange={(event) => {
                                    setName(event.target.value);
                                    clearError();
                                }}
                                maxLength={NAME_MAX_LENGTH}
                                disabled={isPending}
                                error={error?.field === 'name' ? error.message : undefined}
                                autoFocus
                            />
                            <MemberPicker
                                label='Add members'
                                members={accounts}
                                value={selectableIds}
                                onChange={(ids) => {
                                    setAccountIds(ids);
                                    clearError();
                                }}
                                isLoading={membersLoading}
                                isError={membersError}
                                disabled={isPending}
                            />
                            <NumberField
                                label='Set allocated hours'
                                value={hourCap}
                                onChange={(value) => {
                                    setHourCap(value);
                                    clearError();
                                }}
                                min={1}
                                max={HOUR_CAP_MAX}
                                disabled={isPending}
                            />
                            <ModalError message={error?.field === 'form' ? error.message : null} />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant='secondary' onClick={onClose} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type='submit' disabled={!trimmedName} loading={isPending}>
                                Save
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    );
}

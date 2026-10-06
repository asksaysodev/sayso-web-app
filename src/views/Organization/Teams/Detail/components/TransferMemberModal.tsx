import { useMemo, useState, type FormEvent } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import { SelectField, type SelectFieldOption } from '@/components/ds/SelectField';
import useTeams from '@/views/Organization/shared/hooks/useTeams';
import ModalError from '@/views/Organization/shared/components/ModalError';
import useTransferTeamMember from '../../hooks/useTransferTeamMember';
import type { TeamMember } from '../../types';
import SelectedMember from './SelectedMember';
import './TransferMemberModal.css';

interface Props {
    teamId: string;
    teamName: string;
    member: TeamMember;
    onClose: () => void;
}

export default function TransferMemberModal({ teamId, teamName, member, onClose }: Props) {
    const { transferMember, isPending, errorMessage, reset } = useTransferTeamMember();
    const { teams, isLoading } = useTeams();
    const [toTeamId, setToTeamId] = useState<string | undefined>(undefined);

    const toOptions = useMemo<SelectFieldOption<string>[]>(
        () => teams.filter((team) => team.id !== teamId).map((team) => ({ value: team.id, label: team.name })),
        [teams, teamId],
    );
    const hasNoOtherTeams = !isLoading && toOptions.length === 0;

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const toTeam = teams.find((team) => team.id === toTeamId);
        if (!toTeam || isPending) return;
        transferMember(
            { teamId, accountId: member.accountId, toTeamId: toTeam.id, toTeamName: toTeam.name },
            { onSuccess: onClose },
        );
    };

    return (
        <Modal open onOpenChange={(open) => !open && !isPending && onClose()}>
            <ModalContent hideClose={isPending}>
                <form className='transfer-member-modal__form' onSubmit={handleSubmit}>
                    <ModalHeader
                        icon={<ArrowLeftRight size={24} />}
                        title='Transfer member'
                        description='Select which team you want to transfer the selected member to'
                    />
                    <ModalBody className='transfer-member-modal__body'>
                        <SelectedMember member={member} />
                        <div className='transfer-member-modal__teams'>
                            <SelectField
                                className='transfer-member-modal__team'
                                label='From'
                                options={[{ value: teamId, label: teamName }]}
                                value={teamId}
                                onChange={() => {}}
                                disabled
                            />
                            <ArrowLeftRight className='transfer-member-modal__arrow' size={16} aria-hidden />
                            <SelectField
                                className='transfer-member-modal__team'
                                label='To'
                                options={toOptions}
                                value={toTeamId}
                                onChange={(value) => {
                                    setToTeamId(value);
                                    if (errorMessage) reset();
                                }}
                                placeholder={isLoading ? 'Loading teams…' : 'Select a team'}
                                helperText={hasNoOtherTeams ? 'No other teams yet' : undefined}
                                disabled={isPending || isLoading || hasNoOtherTeams}
                            />
                        </div>
                        <ModalError message={errorMessage} />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='secondary' onClick={onClose} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type='submit' disabled={toTeamId === undefined} loading={isPending}>
                            Save
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

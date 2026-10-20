import { useMemo, useState } from 'react';
import { ArrowLeftRight, Mail } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import { SelectField, type SelectFieldOption } from '@/components/ds/SelectField';
import { TextField } from '@/components/ds/TextField';
import useTeams from '@/views/Organization/shared/hooks/useTeams';
import ModalError from '@/views/Organization/shared/components/ModalError';
import useUpdateInviteTeam from '../hooks/useUpdateInviteTeam';
import type { CompanyMemberRow } from '../types';
import './ChangeInviteTeamModal.css';

interface Props {
    row: CompanyMemberRow;
    onClose: () => void;
}

/** Sets the team a pending invitee joins on accept, or no team. */
export default function ChangeInviteTeamModal({ row, onClose }: Props) {
    const currentTeamId = row.team_id ?? null;
    const { teams, isLoading } = useTeams();
    const { updateInviteTeam, isPending, errorMessage, reset } = useUpdateInviteTeam();
    const [teamId, setTeamId] = useState<string | null>(currentTeamId);

    const teamOptions = useMemo<SelectFieldOption<string | null>[]>(
        () => [{ value: null, label: 'No team' }, ...teams.map((team) => ({ value: team.id, label: team.name }))],
        [teams],
    );

    const handleOpenChange = (open: boolean) => {
        if (!open && !isPending) onClose();
    };

    const handleSave = () => {
        updateInviteTeam({ inviteId: row.id, teamId }, { onSuccess: onClose });
    };

    return (
        <Modal open onOpenChange={handleOpenChange} hideClose={isPending}>
            <ModalHeader
                icon={<ArrowLeftRight size={24} />}
                title='Change invite team'
                description='The invitee joins this team when they accept the invite.'
            />
            <ModalBody>
                <div className='change-invite-team-modal__fields'>
                    <TextField
                        className='change-invite-team-modal__invitee'
                        label='Invitee'
                        leadingIcon={<Mail size={20} />}
                        value={row.email}
                        disabled
                        readOnly
                    />
                    <SelectField
                        className='change-invite-team-modal__team'
                        label='Team'
                        options={teamOptions}
                        value={teamId}
                        onChange={(value) => {
                            setTeamId(value);
                            if (errorMessage) reset();
                        }}
                        placeholder={isLoading ? 'Loading teams…' : undefined}
                        disabled={isPending || isLoading}
                    />
                </div>
                <ModalError message={errorMessage} />
            </ModalBody>
            <ModalFooter>
                <Button variant='secondary' onClick={onClose} disabled={isPending}>
                    Cancel
                </Button>
                <Button onClick={handleSave} disabled={teamId === currentTeamId} loading={isPending}>
                    Save
                </Button>
            </ModalFooter>
        </Modal>
    );
}

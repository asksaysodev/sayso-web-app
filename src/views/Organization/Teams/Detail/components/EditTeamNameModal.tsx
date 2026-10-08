import { useState, type FormEvent } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import { TextField } from '@/components/ds/TextField';
import ModalError from '@/views/Organization/shared/components/ModalError';
import useUpdateTeam from '../../hooks/useUpdateTeam';
import { TEAM_NAME_MAX_LENGTH } from '../../constants';
import './EditTeamNameModal.css';

interface Props {
    teamId: string;
    currentName: string;
    onClose: () => void;
}

export default function EditTeamNameModal({ teamId, currentName, onClose }: Props) {
    const { updateTeam, isPending, error, reset } = useUpdateTeam();
    const [name, setName] = useState(currentName);
    const trimmedName = name.trim();
    const canSave = trimmedName !== '' && trimmedName !== currentName;

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (!canSave || isPending) return;
        updateTeam({ teamId, name: trimmedName }, { onSuccess: onClose });
    };

    return (
        <Modal open onOpenChange={(open) => !open && !isPending && onClose()}>
            <ModalContent hideClose={isPending} aria-describedby={undefined}>
                <form className='edit-team-name-modal__form' onSubmit={handleSubmit}>
                    <ModalHeader icon={<Pencil size={24} />} title='Edit team name' />
                    <ModalBody>
                        <TextField
                            label='Team name'
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                                if (error) reset();
                            }}
                            maxLength={TEAM_NAME_MAX_LENGTH}
                            disabled={isPending}
                            error={error?.field === 'name' ? error.message : undefined}
                            autoFocus
                        />
                        <ModalError message={error?.field === 'form' ? error.message : null} />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='secondary' onClick={onClose} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type='submit' disabled={!canSave} loading={isPending}>
                            Save
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import { NumberField } from '@/components/ds/NumberField';
import ModalError from '@/views/Organization/shared/components/ModalError';
import { HOUR_CAP_MAX } from '../../constants';
import useUpdateTeam from '../../hooks/useUpdateTeam';
import type { TeamDetail } from '../../types';
import capPercent from '../../utils/capPercent';
import hourCapPayload from '../../utils/hourCapPayload';
import teamCapStatus from '../../utils/teamCapStatus';
import AllocationUsage from './AllocationUsage';
import './EditHoursModal.css';

const QUICK_ADD_HOURS = [10, 20, 30];

interface Props {
    team: TeamDetail['team'];
    onClose: () => void;
}

export default function EditHoursModal({ team, onClose }: Props) {
    const { updateTeam, isPending, error, reset } = useUpdateTeam();
    const [hourCap, setHourCap] = useState<number | null>(team.hourCap);
    const canSave = hourCap !== team.hourCap;
    const preview = canSave
        ? {
              percent: hourCap === null ? null : capPercent(team.usedMinutes, hourCap),
              status: teamCapStatus(team.usedMinutes, hourCap, hourCapPayload(hourCap).notify_at_percent),
          }
        : { percent: team.capPercent, status: team.status };

    const changeHourCap = (value: number | null) => {
        setHourCap(value);
        if (error) reset();
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (!canSave || isPending) return;
        updateTeam({ teamId: team.id, hourCap }, { onSuccess: onClose });
    };

    return (
        <Modal open onOpenChange={(open) => !open && !isPending && onClose()}>
            <ModalContent hideClose={isPending}>
                <form className='edit-hours-modal__form' onSubmit={handleSubmit}>
                    <ModalHeader align='start' title='Allocated hours' description={team.name} />
                    <ModalBody className='edit-hours-modal__body'>
                        <div className='edit-hours-modal__used'>
                            <AllocationUsage
                                title='Used so far'
                                usedHours={team.usedHours}
                                capHours={hourCap}
                                capPercent={preview.percent}
                                status={preview.status}
                                variant='panel'
                            />
                        </div>
                        <div className='edit-hours-modal__fields'>
                            <NumberField
                                label='Allocated hours'
                                value={hourCap}
                                onChange={changeHourCap}
                                min={1}
                                max={HOUR_CAP_MAX}
                                disabled={isPending}
                            />
                            <div className='edit-hours-modal__quick-add'>
                                <span className='edit-hours-modal__quick-add-label'>Quick add</span>
                                <div className='edit-hours-modal__quick-add-buttons'>
                                    {QUICK_ADD_HOURS.map((hours) => (
                                        <Button
                                            key={hours}
                                            variant='secondary'
                                            size='sm'
                                            leftIcon={<Plus size={16} />}
                                            onClick={() => changeHourCap(Math.min((hourCap ?? 0) + hours, HOUR_CAP_MAX))}
                                            disabled={isPending || hourCap === HOUR_CAP_MAX}
                                        >
                                            {hours} hs
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <ModalError message={error?.message ?? null} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='secondary' onClick={onClose} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type='submit' disabled={!canSave} loading={isPending}>
                            Save changes
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

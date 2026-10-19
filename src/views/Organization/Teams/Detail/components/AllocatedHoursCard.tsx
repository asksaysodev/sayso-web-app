import { useState } from 'react';
import { Clock, Pencil, Plus } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Card } from '@/components/ds/Card';
import type { TeamDetail } from '../../types';
import allocationTone from '../../utils/allocationTone';
import AllocationUsage from './AllocationUsage';
import EditHoursModal from './EditHoursModal';
import './AllocatedHoursCard.css';

interface Props {
    team: TeamDetail['team'];
}

export default function AllocatedHoursCard({ team }: Props) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const tone = allocationTone(team.status)?.tone ?? 'primary';
    const isUncapped = team.capHours === null;

    return (
        <Card className='allocated-hours-card'>
            <div className='allocated-hours-card__main'>
                <span className={`allocated-hours-card__tile allocated-hours-card__tile--${tone}`} aria-hidden='true'>
                    <Clock size={32} />
                </span>
                {isUncapped ? (
                    <div className='allocated-hours-card__empty'>
                        <span className='allocated-hours-card__title'>Allocated hours</span>
                        <p className='allocated-hours-card__text'>This team has no allocated hours.</p>
                    </div>
                ) : (
                    <AllocationUsage
                        title='Allocated hours'
                        usedHours={team.usedHours}
                        capHours={team.capHours}
                        capPercent={team.capPercent}
                        status={team.status}
                        variant='card'
                    />
                )}
            </div>
            <Button
                variant='secondary'
                size='md'
                leftIcon={isUncapped ? <Plus size={20} /> : <Pencil size={20} />}
                onClick={() => setIsEditOpen(true)}
            >
                {isUncapped ? 'Set hours' : 'Edit hours'}
            </Button>
            {isEditOpen && <EditHoursModal team={team} onClose={() => setIsEditOpen(false)} />}
        </Card>
    );
}

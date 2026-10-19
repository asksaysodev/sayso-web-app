import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import type { TeamDetail } from '../../types';
import memberCountLabel from '../../utils/memberCountLabel';
import DeleteTeamModal from './DeleteTeamModal';
import EditTeamNameModal from './EditTeamNameModal';
import './TeamDetailHeader.css';

interface Props {
    team: TeamDetail['team'];
}

export default function TeamDetailHeader({ team }: Props) {
    const [openModal, setOpenModal] = useState<'rename' | 'delete' | null>(null);
    const closeModal = () => setOpenModal(null);

    return (
        <header className='team-detail-header'>
            <div className='team-detail-header__text'>
                <div className='team-detail-header__title-row'>
                    <h1 className='team-detail-header__title'>{team.name}</h1>
                    <Button
                        variant='ghost'
                        size='icon'
                        className='team-detail-header__edit'
                        aria-label='Edit team name'
                        onClick={() => setOpenModal('rename')}
                    >
                        <Pencil size={24} />
                    </Button>
                </div>
                <p className='team-detail-header__members'>{memberCountLabel(team.memberCount)}</p>
            </div>
            <Button
                variant='secondary'
                className='team-detail-header__delete'
                leftIcon={<Trash2 size={20} />}
                onClick={() => setOpenModal('delete')}
            >
                Delete team
            </Button>
            {openModal === 'rename' && (
                <EditTeamNameModal teamId={team.id} currentName={team.name} onClose={closeModal} />
            )}
            {openModal === 'delete' && <DeleteTeamModal teamId={team.id} onClose={closeModal} />}
        </header>
    );
}

import { Plus, UsersRound } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import './TeamsEmptyState.css';

export default function TeamsEmptyState() {
    return (
        <div className='teams-empty'>
            <span className='teams-empty__icon'>
                <UsersRound size={24} />
            </span>
            <h3 className='teams-empty__title'>Create your first team</h3>
            <p className='teams-empty__text'>
                Bring your people together to manage members and track activity by team.
            </p>
            <Button leftIcon={<Plus size={20} />}>Add team</Button>
        </div>
    );
}

import { UsersRound } from 'lucide-react';
import { Card } from '@/components/ds/Card';
import './TeamsComingSoon.css';

export default function TeamsComingSoon() {
    return (
        <Card className='teams-coming-soon'>
            <span className='teams-coming-soon__icon'>
                <UsersRound size={24} />
            </span>
            <h2 className='teams-coming-soon__title'>Teams are coming soon</h2>
            <p className='teams-coming-soon__text'>
                Group members into teams, set hour caps and see how each team is doing.
            </p>
        </Card>
    );
}

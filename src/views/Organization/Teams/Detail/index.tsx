import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import useTeam from '../hooks/useTeam';
import AllocatedHoursCard from './components/AllocatedHoursCard';
import TeamDetailHeader from './components/TeamDetailHeader';
import TeamDetailStatus from './components/TeamDetailStatus';
import '@/views/Organization/Organization.css';
import './TeamDetail.css';

export default function TeamDetail() {
    const { teamId = '' } = useParams();
    const { detail, isLoading, isNotFound, isRetrying, retry } = useTeam(teamId);

    const renderContent = () => {
        if (isLoading) return <TeamDetailStatus loading>Loading team…</TeamDetailStatus>;
        if (isNotFound) {
            return (
                <TeamDetailStatus title='Team not found'>
                    This team doesn't exist or was deleted.
                </TeamDetailStatus>
            );
        }
        if (!detail) {
            return (
                <TeamDetailStatus
                    title="Couldn't load this team"
                    action={
                        <Button variant='secondary' size='sm' onClick={() => retry()} loading={isRetrying}>
                            Try again
                        </Button>
                    }
                >
                    Something went wrong. Please try again.
                </TeamDetailStatus>
            );
        }
        return (
            <>
                <TeamDetailHeader team={detail.team} />
                <AllocatedHoursCard team={detail.team} />
            </>
        );
    };

    return (
        <main className='organization-page'>
            <Link to='/organization?tab=teams' className='team-detail__back'>
                <ArrowLeft size={16} aria-hidden />
                Teams
            </Link>
            {renderContent()}
        </main>
    );
}

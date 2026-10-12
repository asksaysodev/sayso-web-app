import { Phone } from 'lucide-react';
import formatHoursMinutes from '@/utils/formatters/formatHoursMinutes';
import OverviewTile from './OverviewTile';
import OverviewTileSkeleton from './OverviewTileSkeleton';
import type { DashboardOverview, DashboardResponseScope } from '../../types';

const SCOPE_CAPTIONS: Record<DashboardResponseScope, string> = {
    company: 'Across this organization',
    team: 'Across this team',
    account: 'For this account',
};

interface Props {
    overview: DashboardOverview | null;
}

export default function ConversationTimeTile({ overview }: Props) {
    return (
        <OverviewTile icon={<Phone size={20} />} label='Conversation time'>
            {overview ? (
                <>
                    <p className='dashboard-overview-tile__value'>{formatHoursMinutes(overview.totalMinutes)}</p>
                    <p className='dashboard-overview-tile__caption'>{SCOPE_CAPTIONS[overview.scope]}</p>
                </>
            ) : (
                <OverviewTileSkeleton />
            )}
        </OverviewTile>
    );
}

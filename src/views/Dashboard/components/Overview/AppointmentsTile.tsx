import { CalendarCheck } from 'lucide-react';
import OverviewTile from './OverviewTile';
import OverviewTileSkeleton from './OverviewTileSkeleton';
import DeltaBadge from './DeltaBadge';
import type { DashboardOverview } from '../../types';

interface Props {
    overview: DashboardOverview | null;
    comparison: string;
}

export default function AppointmentsTile({ overview, comparison }: Props) {
    return (
        <OverviewTile icon={<CalendarCheck size={20} />} label='Appointments booked'>
            {overview ? (
                <>
                    <div className='dashboard-overview-tile__value-row'>
                        <p className='dashboard-overview-tile__value'>{overview.appointmentsBooked}</p>
                        <DeltaBadge delta={overview.appointmentsDelta} comparison={comparison} />
                    </div>
                    <p className='dashboard-overview-tile__caption'>New appointments</p>
                </>
            ) : (
                <OverviewTileSkeleton />
            )}
        </OverviewTile>
    );
}

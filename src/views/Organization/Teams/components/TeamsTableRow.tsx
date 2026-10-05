import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ds/Badge';
import { TableCell, TableRow } from '@/components/ds/Table';
import type { TeamSummary } from '@/views/Organization/shared/types';
import formatAllocatedHours from '../utils/formatAllocatedHours';
import memberCountLabel from '../utils/memberCountLabel';
import teamStatusBadge from '../utils/teamStatusBadge';

interface Props {
    team: TeamSummary;
}

export default function TeamsTableRow({ team }: Props) {
    const navigate = useNavigate();
    const status = teamStatusBadge(team.status);
    const href = `/organization/teams/${team.id}`;

    return (
        <TableRow className='teams-table__row' onClick={() => navigate(href)}>
            <TableCell>
                <Link to={href} className='teams-table__name'>
                    {team.name}
                </Link>
            </TableCell>
            <TableCell className='teams-table__muted'>{memberCountLabel(team.member_count)}</TableCell>
            <TableCell className='teams-table__muted'>{formatAllocatedHours(team)}</TableCell>
            <TableCell>
                <Badge tone={status.tone}>{status.label}</Badge>
            </TableCell>
            <TableCell className='teams-table__chevron'>
                <ChevronRight size={20} aria-hidden />
            </TableCell>
        </TableRow>
    );
}

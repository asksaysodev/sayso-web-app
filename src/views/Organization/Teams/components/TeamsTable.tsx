import { Button } from '@/components/ds/Button';
import { Table, TableBody, TableHeadCell, TableHeader, TableStateRow } from '@/components/ds/Table';
import useSortableRows from '@/hooks/useSortableRows';
import type { TeamSummary } from '@/views/Organization/shared/types';
import type { TeamSortKey } from '../types';
import { TEAM_COMPARATORS } from '../utils/teamComparators';
import TeamsTableRow from './TeamsTableRow';
import './TeamsTable.css';

const COLUMNS: { key: TeamSortKey; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'members', label: 'Members' },
    { key: 'hours', label: 'Hours allocated' },
    { key: 'status', label: 'Team status' },
];

const COLUMN_COUNT = COLUMNS.length + 1;

interface Props {
    teams: TeamSummary[];
    isLoading: boolean;
    isError: boolean;
    isRetrying: boolean;
    onRetry: () => void;
    isFiltered: boolean;
}

export default function TeamsTable({ teams, isLoading, isError, isRetrying, onRetry, isFiltered }: Props) {
    const { sortedRows, sortKey, direction, toggleSort } = useSortableRows(teams, TEAM_COMPARATORS, {
        key: 'name',
        direction: 'asc',
    });

    const renderBody = () => {
        if (isLoading) {
            return <TableStateRow state='loading' colSpan={COLUMN_COUNT}>Loading teams…</TableStateRow>;
        }
        if (isError) {
            return (
                <TableStateRow
                    state='error'
                    colSpan={COLUMN_COUNT}
                    action={
                        <Button variant='secondary' size='sm' onClick={onRetry} loading={isRetrying}>
                            Try again
                        </Button>
                    }
                >
                    Couldn't load teams.
                </TableStateRow>
            );
        }
        if (sortedRows.length === 0) {
            return (
                <TableStateRow state='empty' colSpan={COLUMN_COUNT}>
                    {isFiltered ? 'No teams match your search.' : 'No teams yet.'}
                </TableStateRow>
            );
        }
        return sortedRows.map((team) => <TeamsTableRow key={team.id} team={team} />);
    };

    return (
        <Table className='teams-table'>
            <TableHeader>
                {COLUMNS.map(({ key, label }) => (
                    <TableHeadCell
                        key={key}
                        sortable
                        sortDirection={sortKey === key ? direction : undefined}
                        onSort={() => toggleSort(key)}
                    >
                        {label}
                    </TableHeadCell>
                ))}
                <TableHeadCell aria-label='Open team' />
            </TableHeader>
            <TableBody>{renderBody()}</TableBody>
        </Table>
    );
}

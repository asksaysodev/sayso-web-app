import { Table, TableBody, TableHeadCell, TableHeader, TableStateRow } from '@/components/ds/Table';
import useSortableRows from '@/hooks/useSortableRows';
import type { CompanyViewer } from '@/views/Organization/Company/types';
import type { TeamMember, TeamMemberAction, TeamMemberSortKey } from '../../types';
import getTeamMemberActions from '../../utils/getTeamMemberActions';
import { TEAM_MEMBER_COMPARATORS } from '../../utils/teamMemberComparators';
import TeamMembersTableRow from './TeamMembersTableRow';
import './TeamMembersTable.css';

const COLUMNS: { key: TeamMemberSortKey; label: string }[] = [
    { key: 'member', label: 'Member' },
    { key: 'email', label: 'E-mail' },
    { key: 'role', label: 'Role' },
    { key: 'lastConversation', label: 'Last conversation' },
];

const COLUMN_COUNT = COLUMNS.length + 1;

interface Props {
    members: TeamMember[];
    viewer: CompanyViewer;
    isFiltered: boolean;
    onAction: (action: TeamMemberAction, member: TeamMember) => void;
}

export default function TeamMembersTable({ members, viewer, isFiltered, onAction }: Props) {
    const { sortedRows, sortKey, direction, toggleSort } = useSortableRows(members, TEAM_MEMBER_COMPARATORS, {
        key: 'member',
        direction: 'asc',
    });

    return (
        <Table className='team-members-table'>
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
                <TableHeadCell aria-label='Actions' />
            </TableHeader>
            <TableBody>
                {sortedRows.length === 0 ? (
                    <TableStateRow state='empty' colSpan={COLUMN_COUNT}>
                        {isFiltered ? 'No members match your search.' : 'No members in this team yet.'}
                    </TableStateRow>
                ) : (
                    sortedRows.map((member) => (
                        <TeamMembersTableRow
                            key={member.accountId}
                            member={member}
                            actions={getTeamMemberActions(member, viewer)}
                            onAction={onAction}
                        />
                    ))
                )}
            </TableBody>
        </Table>
    );
}

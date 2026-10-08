import { Button } from '@/components/ds/Button';
import { Table, TableBody, TableHeadCell, TableHeader, TableStateRow } from '@/components/ds/Table';
import useSortableRows from '@/hooks/useSortableRows';
import type { CompanyMemberRow, CompanyViewer, MemberRowAction, MemberSortKey } from '../types';
import getRowActions from '../utils/getRowActions';
import { MEMBER_COMPARATORS } from '../utils/memberComparators';
import CompanyMembersTableRow from './CompanyMembersTableRow';
import './CompanyMembersTable.css';

const COLUMNS: { key: MemberSortKey; label: string }[] = [
    { key: 'member', label: 'Member' },
    { key: 'email', label: 'E-mail' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
];

const COLUMN_COUNT = COLUMNS.length + 1;

interface Props {
    rows: CompanyMemberRow[];
    viewer: CompanyViewer;
    isLoading: boolean;
    isError: boolean;
    isRetrying: boolean;
    onRetry: () => void;
    /** Search or filter active — changes the empty-state copy. */
    isFiltered: boolean;
    onAction: (action: MemberRowAction, row: CompanyMemberRow) => void;
}

export default function CompanyMembersTable({ rows, viewer, isLoading, isError, isRetrying, onRetry, isFiltered, onAction }: Props) {
    const { sortedRows, sortKey, direction, toggleSort } = useSortableRows(rows, MEMBER_COMPARATORS, {
        key: 'member',
        direction: 'asc',
    });

    const renderBody = () => {
        if (isLoading) {
            return <TableStateRow state='loading' colSpan={COLUMN_COUNT}>Loading members…</TableStateRow>;
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
                    Couldn't load company members.
                </TableStateRow>
            );
        }
        if (sortedRows.length === 0) {
            return (
                <TableStateRow state='empty' colSpan={COLUMN_COUNT}>
                    {isFiltered ? 'No members match your search.' : 'No members yet.'}
                </TableStateRow>
            );
        }
        return sortedRows.map((row) => (
            <CompanyMembersTableRow key={row.id} row={row} actions={getRowActions(row, viewer)} onAction={onAction} />
        ));
    };

    return (
        <Table className='company-members-table'>
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
            <TableBody>{renderBody()}</TableBody>
        </Table>
    );
}

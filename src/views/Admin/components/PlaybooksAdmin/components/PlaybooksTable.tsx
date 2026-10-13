import { Table, TableBody, TableHeadCell, TableHeader } from '@/components/ds/Table';
import useSortableRows from '@/hooks/useSortableRows';
import { AdminPlaybook, PlaybookSortKey } from '../types';
import { PLAYBOOK_COMPARATORS } from '../utils/playbookComparators';
import PlaybooksTableRow from './PlaybooksTableRow';
import '../styles/PlaybooksTable.css';

const COLUMNS: { key: PlaybookSortKey; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
    { key: 'defaultUsers', label: 'Default for' },
    { key: 'createdAt', label: 'Created' },
];

interface Props {
    playbooks: AdminPlaybook[];
    onDelete: (playbook: AdminPlaybook) => void;
}

export default function PlaybooksTable({ playbooks, onDelete }: Props) {
    const { sortedRows, sortKey, direction, toggleSort } = useSortableRows(playbooks, PLAYBOOK_COMPARATORS, {
        key: 'createdAt',
        direction: 'desc',
    });

    return (
        <Table className='playbooks-table'>
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
                {sortedRows.map(playbook => (
                    <PlaybooksTableRow key={playbook.id} playbook={playbook} onDelete={() => onDelete(playbook)} />
                ))}
            </TableBody>
        </Table>
    );
}

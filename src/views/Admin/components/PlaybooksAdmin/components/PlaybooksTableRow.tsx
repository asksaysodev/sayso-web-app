import dayjs from 'dayjs';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ds/Badge';
import { Button } from '@/components/ds/Button';
import { TableCell, TableRow } from '@/components/ds/Table';
import { AdminPlaybook } from '../types';
import playbookDisplayName from '../utils/playbookDisplayName';
import formatUsersCount from '../utils/formatUsersCount';
import PlaybookFileTile from './PlaybookFileTile';
import PlaybookStatusBadge from './PlaybookStatusBadge';

interface Props {
    playbook: AdminPlaybook;
    onDelete: () => void;
}

export default function PlaybooksTableRow({ playbook, onDelete }: Props) {
    const name = playbookDisplayName(playbook);
    const showFileName = name !== playbook.fileName;

    return (
        <TableRow>
            <TableCell>
                <div className='playbooks-table__name'>
                    <PlaybookFileTile fileName={playbook.fileName} />
                    <div className='playbooks-table__name-text'>
                        <div className='playbooks-table__alias-row'>
                            <span className='playbooks-table__alias' title={name}>{name}</span>
                            {playbook.isSystemDefault && <Badge tone='info'>System default</Badge>}
                        </div>
                        {showFileName && <span className='playbooks-table__file' title={playbook.fileName}>{playbook.fileName}</span>}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className='playbooks-table__status'>
                    <PlaybookStatusBadge status={playbook.status} />
                    {playbook.status === 'failed' && playbook.failureReason && (
                        <span className='playbooks-table__failure'>{playbook.failureReason}</span>
                    )}
                </div>
            </TableCell>
            <TableCell className='playbooks-table__number'>
                {playbook.defaultUsersCount > 0
                    ? formatUsersCount(playbook.defaultUsersCount)
                    : <span className='playbooks-table__empty-value'>—</span>}
            </TableCell>
            <TableCell className='playbooks-table__date'>{dayjs(playbook.createdAt).format('MMM D, YYYY')}</TableCell>
            <TableCell className='playbooks-table__actions'>
                <Button
                    variant='ghost'
                    size='icon'
                    className='playbooks-table__delete'
                    aria-label={`Delete ${name}`}
                    onClick={onDelete}
                >
                    <Trash2 size={18} />
                </Button>
            </TableCell>
        </TableRow>
    );
}

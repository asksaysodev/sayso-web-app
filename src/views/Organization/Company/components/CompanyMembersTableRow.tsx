import { Avatar } from '@/components/ds/Avatar';
import { Badge } from '@/components/ds/Badge';
import { TableCell, TableRow } from '@/components/ds/Table';
import { getInitials } from '@/utils/helpers/getInitials';
import type { CompanyMemberRow, MemberRowAction } from '../types';
import displayName from '../utils/displayName';
import roleLabel from '../utils/roleLabel';
import statusBadge from '../utils/statusBadge';
import MemberRowMenu from './MemberRowMenu';

interface Props {
    row: CompanyMemberRow;
    actions: MemberRowAction[];
    onAction: (action: MemberRowAction, row: CompanyMemberRow) => void;
}

export default function CompanyMembersTableRow({ row, actions, onAction }: Props) {
    const name = displayName(row);
    const status = statusBadge(row.status);

    return (
        <TableRow>
            <TableCell>
                <div className='company-members-table__member'>
                    <Avatar initials={getInitials(row.name ?? '', row.lastname ?? '', row.email)} />
                    <span className='company-members-table__name'>{name}</span>
                </div>
            </TableCell>
            <TableCell className='company-members-table__muted'>{row.email}</TableCell>
            <TableCell className='company-members-table__muted'>
                {row.role === 'superadmin' ? <Badge tone='info'>{roleLabel(row.role)}</Badge> : roleLabel(row.role)}
            </TableCell>
            <TableCell>
                <Badge tone={status.tone}>{status.label}</Badge>
            </TableCell>
            <TableCell className='company-members-table__actions'>
                {actions.length > 0 && (
                    <MemberRowMenu actions={actions} memberLabel={name} onAction={(action) => onAction(action, row)} />
                )}
            </TableCell>
        </TableRow>
    );
}

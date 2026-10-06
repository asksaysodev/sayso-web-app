import { Avatar } from '@/components/ds/Avatar';
import { Badge } from '@/components/ds/Badge';
import { TableCell, TableRow } from '@/components/ds/Table';
import { getInitials } from '@/utils/helpers/getInitials';
import MemberRowMenu from '@/views/Organization/shared/components/MemberRowMenu';
import displayName from '@/views/Organization/shared/utils/displayName';
import roleLabel from '@/views/Organization/shared/utils/roleLabel';
import type { TeamMember, TeamMemberAction } from '../../types';
import formatLastConversation from '../../utils/formatLastConversation';
import { TEAM_MEMBER_ACTION_CONFIG } from '../../utils/teamMemberActionConfig';

interface Props {
    member: TeamMember;
    actions: TeamMemberAction[];
    onAction: (action: TeamMemberAction, member: TeamMember) => void;
}

export default function TeamMembersTableRow({ member, actions, onAction }: Props) {
    const name = displayName(member);

    return (
        <TableRow>
            <TableCell>
                <div className='team-members-table__member'>
                    <Avatar initials={getInitials(member.name ?? '', member.lastname ?? '', member.email)} />
                    <span className='team-members-table__name'>{name}</span>
                </div>
            </TableCell>
            <TableCell className='team-members-table__muted'>{member.email}</TableCell>
            <TableCell className='team-members-table__muted'>
                {member.role === 'superadmin' ? <Badge tone='info'>{roleLabel(member.role)}</Badge> : roleLabel(member.role)}
            </TableCell>
            <TableCell className='team-members-table__muted'>{formatLastConversation(member.lastConversationAt)}</TableCell>
            <TableCell className='team-members-table__actions'>
                {actions.length > 0 && (
                    <MemberRowMenu
                        actions={actions}
                        config={TEAM_MEMBER_ACTION_CONFIG}
                        memberLabel={name}
                        onAction={(action) => onAction(action, member)}
                    />
                )}
            </TableCell>
        </TableRow>
    );
}

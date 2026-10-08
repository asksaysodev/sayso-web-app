import { Avatar } from '@/components/ds/Avatar';
import { getInitials } from '@/utils/helpers/getInitials';
import displayName from '@/views/Organization/shared/utils/displayName';
import type { TeamMember } from '../../types';
import './SelectedMember.css';

interface Props {
    member: TeamMember;
}

export default function SelectedMember({ member }: Props) {
    return (
        <div className='selected-member'>
            <span className='selected-member__label'>Selected member:</span>
            <div className='selected-member__pill'>
                <Avatar initials={getInitials(member.name ?? '', member.lastname ?? '', member.email)} />
                <span className='selected-member__identity'>
                    <span className='selected-member__name'>{displayName(member)}</span>
                    <span className='selected-member__email'>{member.email}</span>
                </span>
            </div>
        </div>
    );
}

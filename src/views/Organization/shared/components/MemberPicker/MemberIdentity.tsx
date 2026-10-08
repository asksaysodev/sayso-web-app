import { User } from 'lucide-react';
import displayName from '@/views/Organization/shared/utils/displayName';
import type { PickerMember } from './types';

interface Props {
    member: PickerMember;
    detail: string;
}

export default function MemberIdentity({ member, detail }: Props) {
    return (
        <>
            <span className='member-picker__avatar' aria-hidden='true'>
                <User size={22} />
            </span>
            <span className='member-picker__identity'>
                <span className='member-picker__name'>{displayName(member)}</span>
                <span className='member-picker__detail'>{detail}</span>
            </span>
        </>
    );
}

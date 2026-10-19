import type { SkippedInvite } from '../types';
import './SkippedInvitesList.css';

interface Props {
    skipped: SkippedInvite[];
}

/** Addresses the server did not invite (207 / 400), each with its reason. */
export default function SkippedInvitesList({ skipped }: Props) {
    if (skipped.length === 0) return null;
    return (
        <div className='skipped-invites' role='alert'>
            <p className='skipped-invites__title'>
                {skipped.length === 1 ? "This address wasn't invited:" : `These ${skipped.length} addresses weren't invited:`}
            </p>
            <ul className='skipped-invites__list'>
                {skipped.map(({ email, reason }) => (
                    <li key={email}>
                        <span className='skipped-invites__email'>{email}</span> — {reason}
                    </li>
                ))}
            </ul>
        </div>
    );
}

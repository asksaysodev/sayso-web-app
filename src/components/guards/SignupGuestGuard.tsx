import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

import getPostSignupPath from '@/utils/getPostSignupPath';
import GuestGuard from './GuestGuard';

interface Props {
    children: ReactNode;
}

/** GuestGuard for /signup: the session that sign-up creates continues the flow. */
export default function SignupGuestGuard({ children }: Props) {
    const [searchParams] = useSearchParams();

    return <GuestGuard redirectTo={getPostSignupPath(searchParams.get('invite'))}>{children}</GuestGuard>;
}

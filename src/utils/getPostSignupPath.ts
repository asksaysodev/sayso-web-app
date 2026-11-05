/**
 * Where sign-up continues once the session exists. Invited sign-ups already have a plan,
 * so they skip /signup/plan (SAYSO-575). GuestGuard and the form's navigate race for this
 * redirect, so both must read it from here.
 */
export default function getPostSignupPath(inviteToken: string | null): string {
    return inviteToken ? '/signup/download' : '/signup/plan';
}

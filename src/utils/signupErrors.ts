import { AxiosError } from 'axios';
import { SignupErrorCode } from '@/types/user';

/**
 * The message shown when POST /accounts/signup succeeded but the sign-in that follows it
 * did not — a failure mode that did not exist before signup moved server-side (SAYSO-387).
 *
 * It matters because the account is already created. Retrying signup collides on the email
 * and comes back as "already registered", which reads as "someone else has this address"
 * and sends the user off to recover a password they just set. Naming the real state is the
 * difference between one click and a support ticket.
 */
export const ACCOUNT_CREATED_SIGN_IN_FAILED =
  'Your account was created, but we could not sign you in. Please try signing in.';

const MESSAGES: Record<SignupErrorCode, string> = {
  EMAIL_TAKEN: 'An account with this email already exists. Try signing in instead.',
  INVALID_INPUT: 'Please check the details you entered and try again.',
  INVITE_INVALID: 'This invite link is not valid or has expired.',
  INVITE_CLAIMED: 'This invite has already been used.',
  INVITE_EMAIL_MISMATCH: 'This invitation was issued to a different email address.',
  INVITATION_INVALID: 'This invitation link is not valid. Please contact your administrator.',
  INVITATION_CLAIMED: 'This invitation has already been claimed.',
};

/**
 * Turns an axios failure from the signup endpoint into an Error carrying a message worth
 * showing. The server sends a `code`, so the UI maps codes rather than matching on prose —
 * message wording can change without silently breaking the client.
 *
 * A 429 is called out separately: both signup limiters live on that route, and "too many
 * attempts" is actionable in a way that a generic failure is not.
 */
export function toSignupError(err: unknown): Error {
  const axiosErr = err as AxiosError<{ error?: string; code?: SignupErrorCode }>;
  const status = axiosErr?.response?.status;
  const body = axiosErr?.response?.data;

  if (status === 429) {
    return new Error(body?.error || 'Too many signup attempts. Please try again later.');
  }

  const code = body?.code;
  if (code && MESSAGES[code]) {
    const mapped = new Error(MESSAGES[code]);
    (mapped as Error & { code?: string }).code = code;
    return mapped;
  }

  // Falls back to the server's own message before a generic one, so an unmapped code still
  // says something useful rather than "Authentication failed".
  return new Error(body?.error || 'We could not create your account. Please try again.');
}

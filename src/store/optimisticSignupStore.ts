import { create } from 'zustand';

import type { SignupFormData } from '@/views/Signup/types';

/**
 * Optimistic self sign-up: the form moves to /signup/plan as soon as it is submitted and
 * the account is created in the background.
 *
 * - `pending`: account creation in flight (no session yet).
 * - `created`: the account exists; the session and account fetch are still settling.
 *   AuthGuard clears this back to `idle` once the account has loaded.
 * - `failed`: creation failed; /signup/plan sends the user back to `returnTo`, where the
 *   form restores `draft` on step 2 and resets the store.
 *
 * In memory only (never persisted): `draft` holds the password.
 */
type OptimisticSignupStatus = 'idle' | 'pending' | 'created' | 'failed';

interface OptimisticSignupStore {
    status: OptimisticSignupStatus;
    draft: SignupFormData | null;
    returnTo: string;
    start: (draft: SignupFormData, returnTo: string) => void;
    markCreated: () => void;
    fail: () => void;
    reset: () => void;
}

export const useOptimisticSignupStore = create<OptimisticSignupStore>((set) => ({
    status: 'idle',
    draft: null,
    returnTo: '/signup',
    start: (draft, returnTo) => set({ status: 'pending', draft, returnTo }),
    markCreated: () => set({ status: 'created', draft: null }),
    fail: () => set({ status: 'failed' }),
    reset: () => set({ status: 'idle', draft: null, returnTo: '/signup' }),
}));

/** True while the plan step is shown ahead of a usable account (pending or still settling). */
export const isOptimisticSignupActive = (status: OptimisticSignupStatus) =>
    status === 'pending' || status === 'created';

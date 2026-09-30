import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import sendTeamInvite from '../services/sendTeamInvite';
import type { SkippedInvite } from '../types';
import { COMPANY_MEMBERS_QUERY_KEY } from './queryKeys';

export interface InviteMembersInput {
    emails: string[];
    teamId: string | null;
}

const skippedFromError = (error: unknown): SkippedInvite[] => {    
    return axios.isAxiosError<{ skipped?: SkippedInvite[] }>(error) ? (error.response?.data?.skipped ?? []) : [];
}

/**
 * 202 → all sent. 207 → some sent, the rest in `skipped` with a reason.
 * 400 with `skipped` → none sent. Other errors (404 team, 409 over cap) → `errorMessage`.
 */
export default function useInviteMembers() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending, data, error, reset } = useMutation({
        mutationFn: ({ emails, teamId }: InviteMembersInput) => sendTeamInvite(emails, teamId),
        onSuccess: ({ invites }) => {
            queryClient.invalidateQueries({ queryKey: COMPANY_MEMBERS_QUERY_KEY });
            showToast('success', invites.length === 1 ? 'Invite sent.' : `${invites.length} invites sent.`);
        },
        onError: (err) => {
            reportApiError(err, { feature: 'company-members', operation: 'sendTeamInvite' });
        },
    });

    const skipped = data?.skipped ?? skippedFromError(error);

    return {
        invite: mutate,
        isPending,
        skipped,
        errorMessage: error && skipped.length === 0 ? getApiErrorMessage(error, 'Failed to send invites. Please try again.') : null,
        reset,
    };
}

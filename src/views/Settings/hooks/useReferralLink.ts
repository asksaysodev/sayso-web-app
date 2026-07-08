import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import * as Sentry from '@sentry/react';
import { enrollReferralParticipant, getCampaign } from '@/services/referralRocket';

export default function useReferralLink() {
  const { globalUser } = useAuth();
  const email = globalUser?.email ?? null;

  const { data: referralLink, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['referral-link', email],
    enabled: !!email,
    staleTime: 1000 * 60 * 10,
    retry: 2,
    queryFn: async () => {
      try {
        const enrolled = await enrollReferralParticipant({
          email: email!,
          fName: globalUser?.name ?? undefined,
          lName: globalUser?.lastname ?? undefined,
        });
        if (!enrolled) throw new Error('referral-enrollment-failed');
        const campaign = await getCampaign();
        const participant = await campaign.getParticipantDetail({ email: email! });
        if (!participant) throw new Error('referral-enrollment-failed');
        return participant.shareLink;
      } catch (e) {
        Sentry.captureException(e);
        throw e;
      }
    },
  });

  return { referralLink, isLoading, isError, error, refetch };
}

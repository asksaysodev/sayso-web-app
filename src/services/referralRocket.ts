import * as Sentry from '@sentry/react';

const POLL_INTERVAL_MS = 100;
const POLL_MAX_ATTEMPTS = 50; // 5 seconds

function waitForRocketSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const timer = setInterval(() => {
      if (window.Rocket) {
        clearInterval(timer);
        resolve();
      } else if (++attempts >= POLL_MAX_ATTEMPTS) {
        clearInterval(timer);
        reject(new Error('Referral Rocket SDK failed to load'));
      }
    }, POLL_INTERVAL_MS);
  });
}

export async function getCampaign(): Promise<ReferralRocketCampaign> {
  await waitForRocketSDK();
  return window.Rocket!.getCampaign();
}

export async function getParticipantReferrer(email: string): Promise<{ referredByCode: string | null; referrerEmail: string | null }> {
  try {
    const campaign = await getCampaign();
    const participant = await campaign.getParticipantDetail({ email });
    const referredByCode = participant.referredByCode ?? null;
    const referrerEmail = participant.referrerEmail || null;
    return { referredByCode, referrerEmail };
  } catch (err) {
    Sentry.captureException(err);
    return { referredByCode: null, referrerEmail: null };
  }
}

export async function enrollReferralParticipant(params: {
  email: string;
  fName?: string;
  lName?: string;
}): Promise<void> {
  const campaign = await getCampaign();
  try {
    await campaign.addParticipant({
      email: params.email,
      fName: params.fName,
      lName: params.lName,
    });
  } catch (err) {
    Sentry.captureException(err);
  }
}

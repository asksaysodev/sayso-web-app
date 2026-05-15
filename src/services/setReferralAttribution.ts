import apiClient from '@/config/axios';

export async function setReferralAttribution(params: {
    referralCodeUsed: string;
    referrerEmail: string;
}): Promise<void> {
    await apiClient.post('/accounts/referral-attribution', params);
}

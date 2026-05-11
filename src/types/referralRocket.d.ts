export {};

declare global {
  interface ReferralRocketParticipant {
    campaignId: string;
    participantId: number;
    email: string;
    firstName: string;
    lastName: string;
    shareLink: string;
    referralCode: string;
    referredByCode: string | null;
    referrerEmail: string;
    referrerFName: string;
    referrerLName: string;
    refereeReward: number;
    refereeRewardBalance: number;
    refereeRewardRedeemed: number;
    referralReward: number;
    referralRewardBalance: number;
    referralRewardRedeemed: number;
    rewardDue: number;
    rewardEventCompleted: boolean;
    rewardPaid: number;
    revenueGenerated: number;
    fraudScore: string;
    totalImpressions: number;
    totalReferrals: number;
    totalCompletedReferred: number;
    createdOn: string;
    [key: string]: unknown;
  }

  interface ReferralRocketCampaign {
    addParticipant(data: { email: string; fName?: string; lName?: string }): Promise<void>;
    getParticipantDetail(data: { email: string }): Promise<ReferralRocketParticipant>;
    qualifyParticipant(data: { email: string }): Promise<void>;
    issueDirectReward(data: { email: string }): Promise<void>;
    getReferralCode(): string | null;
    getCampaignId(): string;
    getCampaignDetail(): Promise<unknown>;
    validateCode(code: string): Promise<boolean>;
  }

  interface ReferralRocketSDK {
    getCampaign(): Promise<ReferralRocketCampaign>;
  }

  interface Window {
    Rocket?: ReferralRocketSDK;
  }
}

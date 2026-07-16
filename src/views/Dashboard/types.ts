export type WeeklyActivityDirection = 'prev' | 'next';
export type InsightRating = null | 'up' | 'down';

export interface ConversationTimeProps {
    totalMinutes: number;
    isRefetching: boolean;
    isLoading: boolean;
}

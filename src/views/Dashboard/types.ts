import { AccountUsage } from "@/types/user";

export type WeeklyActivityDirection = 'prev' | 'next';
export type InsightRating = null | 'up' | 'down';

export interface TimeWidgetsSharedProps {
    accountUsage: AccountUsage;
    isRefetching: boolean;
    isLoading: boolean;   
}
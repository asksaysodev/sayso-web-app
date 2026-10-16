import type { ScopeSelectionScope } from '@/types/scope';

export type InsightRating = null | 'up' | 'down';

export interface ConversationFilter {
    key: 'lead_type' | 'appointment_booked' | 'has_summary';
    value: string;
}

export interface ConversationRequestParams {
    scope?: 'company' | ScopeSelectionScope;
    scopeId?: string;
}

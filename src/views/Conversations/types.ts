import type { ScopeSelectionScope } from '@/types/scope';

export type InsightRating = null | 'up' | 'down';

export interface ConversationFilter {
    key: 'lead_type' | 'appointment_booked' | 'lead_name' | 'has_summary';
    value: string;
}

export interface ConversationRequestParams {
    scope?: 'company' | ScopeSelectionScope;
    scopeId?: string;
}

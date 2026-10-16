import type { ConversationFilter } from '../types';

export type LeadTypeValue = 'all' | 'buyer' | 'seller';
export type AppointmentValue = 'all' | 'booked' | 'not booked';

export interface ConversationFilterState {
    hasSummary: boolean;
    leadType: LeadTypeValue;
    appointment: AppointmentValue;
    leadName: string;
}

export const DEFAULT_CONVERSATION_FILTERS: ConversationFilterState = {
    hasSummary: true,
    leadType: 'all',
    appointment: 'all',
    leadName: '',
};

export const CLEARED_CONVERSATION_FILTERS: ConversationFilterState = {
    ...DEFAULT_CONVERSATION_FILTERS,
    hasSummary: false,
};

export const LEAD_TYPE_OPTIONS: { value: LeadTypeValue; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'buyer', label: 'Buyer' },
    { value: 'seller', label: 'Seller' },
];

export const APPOINTMENT_OPTIONS: { value: AppointmentValue; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'booked', label: 'Booked' },
    { value: 'not booked', label: 'Not booked' },
];

const optionLabel = <T extends string>(options: { value: T; label: string }[], value: T) =>
    options.find((option) => option.value === value)?.label ?? value;

/** Shape `getConversations` expects. */
export function toRequestFilters(state: ConversationFilterState): ConversationFilter[] {
    const filters: ConversationFilter[] = [];
    if (state.hasSummary) filters.push({ key: 'has_summary', value: 'true' });
    if (state.leadType !== 'all') filters.push({ key: 'lead_type', value: state.leadType });
    if (state.appointment !== 'all') filters.push({ key: 'appointment_booked', value: state.appointment });
    if (state.leadName.trim()) filters.push({ key: 'lead_name', value: state.leadName.trim() });
    return filters;
}

export interface ConversationFilterChip {
    key: string;
    label: string;
    clear: (state: ConversationFilterState) => ConversationFilterState;
}

export function getConversationFilterChips(state: ConversationFilterState): ConversationFilterChip[] {
    const chips: ConversationFilterChip[] = [];
    if (state.hasSummary) {
        chips.push({ key: 'has_summary', label: 'Summary created', clear: (s) => ({ ...s, hasSummary: false }) });
    }
    if (state.leadType !== 'all') {
        chips.push({
            key: 'lead_type',
            label: `Lead type: ${optionLabel(LEAD_TYPE_OPTIONS, state.leadType)}`,
            clear: (s) => ({ ...s, leadType: 'all' }),
        });
    }
    if (state.appointment !== 'all') {
        chips.push({
            key: 'appointment',
            label: `Appointment: ${optionLabel(APPOINTMENT_OPTIONS, state.appointment)}`,
            clear: (s) => ({ ...s, appointment: 'all' }),
        });
    }
    if (state.leadName.trim()) {
        chips.push({ key: 'lead_name', label: `Lead name: ${state.leadName.trim()}`, clear: (s) => ({ ...s, leadName: '' }) });
    }
    return chips;
}

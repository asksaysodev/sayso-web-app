import type { CreatePartnerPayload } from '../types';

export async function createPartner(_payload: CreatePartnerPayload): Promise<{ id: string }> {
    return { id: `mock-partner-${Math.random().toString(36).slice(2)}` };
}

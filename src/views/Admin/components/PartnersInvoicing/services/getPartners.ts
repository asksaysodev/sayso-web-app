import { Partner } from '../types';
import { PARTNERS_MOCK } from './partnersMock';

export async function getPartners(): Promise<Partner[]> {
    return PARTNERS_MOCK;
}

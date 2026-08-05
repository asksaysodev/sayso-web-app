import type { TeamPlanOption } from '../types';

export interface PartnerTotals {
    subtotalCents: number;
    discountCents: number;
    totalCents: number;
}

export function calculateRunningTotal(
    teams: Array<{ planOptionId: string }>,
    plans: TeamPlanOption[]
): number {
    return teams.reduce((sum, team) => {
        const plan = plans.find(p => p.id === team.planOptionId);
        return sum + (plan?.priceInCents ?? 0);
    }, 0);
}

/**
 * Subtotal, discount and net for the partner's monthly invoice.
 *
 * The discount is computed per invoice line rather than off the flat subtotal,
 * because that is how the real invoice is built: the server collapses teams onto
 * one subscription item per price (price x quantity), and Stripe applies a
 * percent coupon to each line and rounds there. Discounting the subtotal in one
 * shot can land a cent or two away from what the partner is actually billed.
 */
export function calculatePartnerTotals(
    teams: Array<{ planOptionId: string }>,
    plans: TeamPlanOption[],
    discountPercent: number
): PartnerTotals {
    const subtotalCents = calculateRunningTotal(teams, plans);

    if (!discountPercent) return { subtotalCents, discountCents: 0, totalCents: subtotalCents };

    const quantityByPlan = new Map<string, number>();
    for (const team of teams) {
        if (!team.planOptionId) continue;
        quantityByPlan.set(team.planOptionId, (quantityByPlan.get(team.planOptionId) ?? 0) + 1);
    }

    let discountCents = 0;
    for (const [planOptionId, quantity] of quantityByPlan) {
        const plan = plans.find(p => p.id === planOptionId);
        if (!plan) continue;
        const lineCents = plan.priceInCents * quantity;
        discountCents += Math.round((lineCents * discountPercent) / 100);
    }

    return { subtotalCents, discountCents, totalCents: subtotalCents - discountCents };
}

/** Empty, non-numeric and out-of-range input all mean "no discount" for preview purposes. */
export function parseDiscountPercent(raw: string | undefined): number {
    if (!raw?.trim()) return 0;
    const parsed = Number(raw);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) return 0;
    return parsed;
}

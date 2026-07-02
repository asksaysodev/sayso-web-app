import type { TeamPlanOption } from '../types';

export function calculateRunningTotal(
    teams: Array<{ planOptionId: string }>,
    plans: TeamPlanOption[]
): number {
    return teams.reduce((sum, team) => {
        const plan = plans.find(p => p.id === team.planOptionId);
        return sum + (plan?.priceInCents ?? 0);
    }, 0);
}

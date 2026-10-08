import type { TeamSummary } from '@/views/Organization/shared/types';

/** Case-insensitive search on team name. */
export default function filterTeams(teams: TeamSummary[], text: string): TeamSummary[] {
    const query = text.trim().toLowerCase();
    if (!query) return teams;
    return teams.filter((team) => team.name.toLowerCase().includes(query));
}

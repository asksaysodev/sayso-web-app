import { useMemo } from 'react';
import useTeams from '@/views/Organization/shared/hooks/useTeams';
import useCompanyMembers from '@/views/Organization/Company/hooks/useCompanyMembers';
import displayName from '@/views/Organization/shared/utils/displayName';
import type { FilterOption, FilterOptionList } from '@/types/scope';

const byLabel = (a: FilterOption, b: FilterOption) => a.label.localeCompare(b.label);

/**
 * Teams and active members for the Filters panel, sorted by name. Invites are left out: they have no account to scope to.
 * @param enabled - `false` skips both fetches (drawer closed and nothing selected).
 */
export default function useScopeFilterOptions(enabled: boolean): { teams: FilterOptionList; members: FilterOptionList } {
    const { teams, ...teamsState } = useTeams(enabled);
    const { members, ...membersState } = useCompanyMembers(enabled);

    const teamOptions = useMemo(() => {
        return teams.map((team) => ({ id: team.id, label: team.name })).sort(byLabel),
    }, [teams]);

    const memberOptions = useMemo(() => {
        return members
            .filter((member) => !member.isInvite)
            .map((member) => ({ id: member.id, label: displayName(member) }))
            .sort(byLabel),  
    }, [members]);

    return {
        teams: { options: teamOptions, ...teamsState },
        members: { options: memberOptions, ...membersState },
    };
}

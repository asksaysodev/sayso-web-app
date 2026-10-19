import type { TeamMember } from '../types';

/** Case-insensitive search on full name + e-mail. */
export default function filterTeamMembers(members: TeamMember[], text: string): TeamMember[] {
    const query = text.trim().toLowerCase();
    if (!query) return members;

    return members.filter((member) => {
        const fullName = `${member.name ?? ''} ${member.lastname ?? ''}`.toLowerCase();
        return fullName.includes(query) || member.email.toLowerCase().includes(query);
    });
}

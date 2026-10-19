export interface PickerMember {
    id: string;
    name: string | null;
    lastname: string | null;
    email: string;
    /** Set when the member already belongs to a team — shown greyed out, not selectable. */
    team_id?: string | null;
    team_name?: string | null;
}

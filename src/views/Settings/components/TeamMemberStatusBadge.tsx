export default function StatusBadge({ status }: { status: string }) {
    const normalized = status.toLowerCase();
    const styles: Record<string, string> = {
        active:   "team-member-badge badge-active",
        inactive: "team-member-badge badge-inactive",
        invited:  "team-member-badge badge-invited",
    };
    const label: Record<string, string> = {
        active: "Active", inactive: "Inactive", invited: "Invited",
    };
    return (
        <span className={styles[normalized] ?? "team-member-badge badge-inactive"}>
            {label[normalized] ?? status}
        </span>
    );
}
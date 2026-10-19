/**
 * Returns the uppercased initials of two strings, falling back to the first letter of `fallback` when both are empty.
 * @param a {string} - First string (e.g. first name)
 * @param b {string} - Second string (e.g. last name)
 * @param fallback {string} - Used when `a` and `b` are empty (e.g. email for invites without a name)
 * @returns {string} Up to two uppercase characters
 */
export function getInitials(a: string, b: string, fallback = ''): string {
    const initials = `${a.trim().charAt(0)}${b.trim().charAt(0)}`;
    return (initials || fallback.trim().charAt(0)).toUpperCase();
}

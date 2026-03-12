/**
 * Returns the uppercased initials of two strings.
 * @param a {string} - First string (e.g. first name)
 * @param b {string} - Second string (e.g. last name)
 * @returns {string} A two-character string with the first letter of each param in uppercase
 */
export function getInitials(a: string, b: string): string {
    return `${a.charAt(0)}${b.charAt(0)}`.toUpperCase();
}
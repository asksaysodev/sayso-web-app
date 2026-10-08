export default function formatUsersCount(count: number): string {
    return `${count} ${count === 1 ? 'user' : 'users'}`;
}

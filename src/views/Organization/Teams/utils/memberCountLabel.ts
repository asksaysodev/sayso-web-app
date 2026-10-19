export default function memberCountLabel(count: number): string {
    return `${count} ${count === 1 ? 'member' : 'members'}`;
}

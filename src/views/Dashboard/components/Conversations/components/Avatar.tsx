interface Props {
    name: string;
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export default function Avatar({ name }: Props) {
    return <span className="conv-avatar">{getInitials(name)}</span>;
}

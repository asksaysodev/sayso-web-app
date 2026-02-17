interface Props {
    hovered?: boolean;
}

export default function Divider({ hovered }: Props) {
    return (
        <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--sayso-border)', margin: '16px 0', opacity: hovered ? 0 : 1 }}>
        </div>
    )
}
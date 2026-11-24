import './SummaryRows.css';

export interface SummaryRow {
    label: string;
    value: string;
}

interface Props {
    rows: SummaryRow[];
}

export default function SummaryRows({ rows }: Props) {
    return (
        <dl className='summary-rows'>
            {rows.map(({ label, value }) => (
                <div key={label} className='summary-rows__row'>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                </div>
            ))}
        </dl>
    );
}

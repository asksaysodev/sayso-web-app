import clsx from 'clsx';
import './SummaryRows.css';

export interface SummaryRow {
    label: string;
    value: string;
}

interface Props {
    rows: SummaryRow[];
    isBoxed?: boolean;
}

export default function SummaryRows({ rows, isBoxed = false }: Props) {
    return (
        <dl className={clsx('summary-rows', isBoxed && 'summary-rows--boxed')}>
            {rows.map(({ label, value }) => (
                <div key={label} className='summary-rows__row'>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                </div>
            ))}
        </dl>
    );
}

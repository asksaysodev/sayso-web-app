import type { ReactNode } from 'react';
import { Card } from '@/components/ds/Card';
import type { SummaryRow } from './RetentionFlow/SummaryRows';
import type { PlanStatusTone } from './utils';
import './PlanStateLayout.css';

interface Props {
    title: string;
    plan: string;
    status: { label: string; tone: PlanStatusTone | 'info' };
    description?: string;
    facts: SummaryRow[];
    children?: ReactNode;
}

/** Shared look of every plan state: headline, plan and status, then key facts in columns. */
export default function PlanStateLayout({ title, plan, status, description, facts, children }: Props) {
    return (
        <Card className='subscription-card plan-state-card'>
            <h2 className='plan-state-card__title'>{title}</h2>
            <div className='plan-state-card__plan'>
                <span>{plan}</span>
                <span className='plan-card__status'>
                    <span className={`plan-card__status-dot plan-card__status-dot--${status.tone}`} aria-hidden />
                    {status.label}
                </span>
            </div>
            {description && <p className='plan-state-card__description'>{description}</p>}
            {facts.length > 0 && (
                <dl className='plan-state-card__facts'>
                    {facts.map(({ label, value }) => (
                        <div key={label} className='plan-state-card__fact'>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                </dl>
            )}
            {children}
        </Card>
    );
}

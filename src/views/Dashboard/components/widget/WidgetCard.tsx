import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Card } from '@/components/ds/Card';
import type { WidgetTone } from '../../types';
import './Widget.css';

interface Props {
    icon: ReactNode;
    /** Draws the icon on a 32px tinted tile. Without it the icon renders bare (e.g. the Sayso logo). */
    tone?: WidgetTone;
    title: string;
    actions?: ReactNode;
    className?: string;
    children?: ReactNode;
}

export default function WidgetCard({ icon, tone, title, actions, className, children }: Props) {
    return (
        <Card className={clsx('dashboard-widget', className)}>
            <header className='dashboard-widget__header'>
                <div className='dashboard-widget__heading'>
                    <span className={clsx('dashboard-widget__icon', tone && `dashboard-widget__icon--${tone}`)}>
                        {icon}
                    </span>
                    <h2 className='dashboard-widget__title'>{title}</h2>
                </div>
                {actions && <div className='dashboard-widget__actions'>{actions}</div>}
            </header>
            {children}
        </Card>
    );
}

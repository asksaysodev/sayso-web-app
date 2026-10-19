import type { ReactNode } from 'react';
import clsx from 'clsx';
import type { WidgetTone } from '../../types';
import './Widget.css';

interface Props {
    icon: ReactNode;
    tone?: WidgetTone;
    title: string;
    text: string;
    action?: ReactNode;
    className?: string;
}

/** A widget's empty or error body: tinted icon circle, title, text and an optional action. */
export default function WidgetState({ icon, tone = 'info', title, text, action, className }: Props) {
    return (
        <div className={clsx('dashboard-widget-state', className)}>
            <span className={clsx('dashboard-widget-state__icon', `dashboard-widget__icon--${tone}`)}>{icon}</span>
            <h3 className='dashboard-widget-state__title'>{title}</h3>
            <p className='dashboard-widget-state__text'>{text}</p>
            {action && <div className='dashboard-widget-state__action'>{action}</div>}
        </div>
    );
}

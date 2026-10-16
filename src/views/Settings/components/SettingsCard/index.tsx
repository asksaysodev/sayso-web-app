import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Card } from '@/components/ds/Card';
import './SettingsCard.css';

interface Props {
    /** 44px square tile, left of the title. */
    tile: ReactNode;
    title: string;
    /** Small detail line under the title. */
    detail?: string;
    /** Shown top-right, e.g. a "Connected" badge. */
    status?: ReactNode;
    description: ReactNode;
    /** Extra content between the description and the footer. */
    children?: ReactNode;
    /** Detail text in the footer, left of the action. */
    meta?: ReactNode;
    action?: ReactNode;
    className?: string;
}

/** Card used by the Connections, Security and Referrals tabs. */
export default function SettingsCard({ tile, title, detail, status, description, children, meta, action, className }: Props) {
    return (
        <Card className={clsx('settings-card', className)}>
            <div className='settings-card__top'>
                {tile}
                <div className='settings-card__heading'>
                    <h2 className='settings-card__title'>{title}</h2>
                    {detail && <p className='settings-card__detail'>{detail}</p>}
                </div>
                {status}
            </div>
            <p className='settings-card__description'>{description}</p>
            {children}
            {(meta || action) && (
                <div className='settings-card__foot'>
                    <span className='settings-card__meta'>{meta}</span>
                    {action}
                </div>
            )}
        </Card>
    );
}

export function SettingsCardTile({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={clsx('settings-card__tile', className)}>{children}</div>;
}

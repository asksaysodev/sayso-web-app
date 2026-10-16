import type { ReactNode } from 'react';
import { Badge } from '@/components/ds/Badge';
import { Card } from '@/components/ds/Card';

interface Props {
    logoTile: ReactNode;
    title: string;
    /** Small detail line under the title (e.g. "Real-estate CRM"). */
    category: string;
    description: string;
    /** Detail text in the footer, left of the CTA (e.g. connected account). */
    meta?: ReactNode;
    connected?: boolean;
    action: ReactNode;
    className?: string;
}

export default function ConnectionItem({ logoTile, title, category, description, meta, connected = false, action, className }: Props) {
    return (
        <Card className={className ? `connection-card ${className}` : 'connection-card'}>
            <div className='connection-card__top'>
                {logoTile}
                <div className='connection-card__heading'>
                    <h2 className='connection-card__title'>{title}</h2>
                    <p className='connection-card__category'>{category}</p>
                </div>
                {connected && <Badge tone='success'>Connected</Badge>}
            </div>
            <p className='connection-card__description'>{description}</p>
            <div className='connection-card__foot'>
                <span className='connection-card__meta'>{meta}</span>
                {action}
            </div>
        </Card>
    );
}

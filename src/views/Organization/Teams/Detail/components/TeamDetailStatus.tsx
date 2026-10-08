import type { ReactNode } from 'react';
import './TeamDetailStatus.css';

interface Props {
    title?: string;
    loading?: boolean;
    action?: ReactNode;
    children: ReactNode;
}

export default function TeamDetailStatus({ title, loading = false, action, children }: Props) {
    return (
        <div className='team-detail-status' role={loading ? 'status' : undefined}>
            {loading && <span className='team-detail-status__spinner' aria-hidden='true' />}
            {title && <h1 className='team-detail-status__title'>{title}</h1>}
            <p className='team-detail-status__message'>{children}</p>
            {action}
        </div>
    );
}

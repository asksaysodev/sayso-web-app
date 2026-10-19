import type { ReactNode } from 'react';
import clsx from 'clsx';
import './PageHeader.css';

export interface PageHeaderProps {
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
    return (
        <header className={clsx('ds-page-header', className)}>
            <div className='ds-page-header__text'>
                <h1 className='ds-page-header__title'>{title}</h1>
                {description && <p className='ds-page-header__description'>{description}</p>}
            </div>
            {actions && <div className='ds-page-header__actions'>{actions}</div>}
        </header>
    );
}

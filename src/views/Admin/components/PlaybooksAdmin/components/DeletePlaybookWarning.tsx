import type { ReactNode } from 'react';
import { ShieldAlert, Users } from 'lucide-react';
import clsx from 'clsx';

interface Props {
    tone: 'warning' | 'error';
    children: ReactNode;
}

export default function DeletePlaybookWarning({ tone, children }: Props) {
    const Icon = tone === 'error' ? ShieldAlert : Users;

    return (
        <p className={clsx('delete-playbook-modal__warning', `delete-playbook-modal__warning--${tone}`)}>
            <Icon size={18} aria-hidden='true' />
            <span>{children}</span>
        </p>
    );
}

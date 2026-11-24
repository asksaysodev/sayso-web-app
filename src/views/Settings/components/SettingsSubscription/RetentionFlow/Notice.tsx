import type { HTMLAttributes } from 'react';
import clsx from 'clsx';
import './Notice.css';

interface Props extends HTMLAttributes<HTMLParagraphElement> {
    tone: 'primary' | 'warning' | 'error';
}

export default function Notice({ tone, className, ...props }: Props) {
    return <p className={clsx('notice', `notice--${tone}`, className)} {...props} />;
}

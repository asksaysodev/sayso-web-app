import type { ReactNode } from 'react';
import clsx from 'clsx';
import { SheetBody, SheetFooter } from '@/components/ds/Sheet';
import Notice from './Notice';
import './StepLayout.css';

interface Props {
    children: ReactNode;
    footer?: ReactNode;
    errorMessage?: string | null;
    isCompact?: boolean;
}

export default function StepLayout({ children, footer, errorMessage, isCompact = false }: Props) {
    return (
        <>
            <SheetBody className={clsx('step-layout__body', isCompact && 'step-layout__body--compact')}>{children}</SheetBody>
            {errorMessage && (
                <Notice tone='error' role='alert' className='step-layout__error'>
                    {errorMessage}
                </Notice>
            )}
            {footer && <SheetFooter className='step-layout__footer'>{footer}</SheetFooter>}
        </>
    );
}

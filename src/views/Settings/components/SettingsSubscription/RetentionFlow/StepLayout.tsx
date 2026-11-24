import type { ReactNode } from 'react';
import { SheetBody, SheetFooter } from '@/components/ds/Sheet';
import Notice from './Notice';
import './StepLayout.css';

interface Props {
    children: ReactNode;
    footer: ReactNode;
    errorMessage?: string | null;
}

export default function StepLayout({ children, footer, errorMessage }: Props) {
    return (
        <>
            <SheetBody className='step-layout__body'>{children}</SheetBody>
            {errorMessage && (
                <Notice tone='error' role='alert' className='step-layout__error'>
                    {errorMessage}
                </Notice>
            )}
            <SheetFooter className='step-layout__footer'>{footer}</SheetFooter>
        </>
    );
}

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import './Radio.css';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({ label, className, ...props }, ref) {
    return (
        <label className={clsx('ds-radio', className)}>
            <input ref={ref} type='radio' className='ds-radio__input' {...props} />
            <span className='ds-radio__label'>{label}</span>
        </label>
    );
});

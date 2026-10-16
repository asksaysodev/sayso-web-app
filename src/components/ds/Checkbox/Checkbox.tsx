import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import './Checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ label, className, ...props }, ref) {
    return (
        <label className={clsx('ds-checkbox', className)}>
            <span className='ds-checkbox__box'>
                <input ref={ref} type='checkbox' className='ds-checkbox__input' {...props} />
                <Check size={14} strokeWidth={3} className='ds-checkbox__check' aria-hidden />
            </span>
            <span className='ds-checkbox__label'>{label}</span>
        </label>
    );
});

import type { InputHTMLAttributes, ReactNode } from 'react';
import './OptionCard.css';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'title'> {
    icon: ReactNode;
    title: string;
    description: ReactNode;
}

export default function OptionCard({ icon, title, description, ...props }: Props) {
    return (
        <label className='option-card'>
            <input type='radio' className='option-card__input' {...props} />
            <span className='option-card__icon' aria-hidden>
                {icon}
            </span>
            <span className='option-card__text'>
                <span className='option-card__title'>{title}</span>
                <span className='option-card__description'>{description}</span>
            </span>
        </label>
    );
}

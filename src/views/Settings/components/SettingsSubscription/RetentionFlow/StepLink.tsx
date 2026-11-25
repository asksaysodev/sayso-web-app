import type { ButtonHTMLAttributes } from 'react';
import './StepLink.css';

/** Low-emphasis exit or skip action on the left of the footer. */
export default function StepLink(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    return <button type='button' className='step-link' {...props} />;
}

import { useEffect, useRef, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import './StepHeading.css';

export interface StepProgress {
    current: number;
    total: number;
}

interface Props {
    title: ReactNode;
    description?: ReactNode;
    progress?: StepProgress | null;
    isSuccess?: boolean;
}

export default function StepHeading({ title, description, progress, isSuccess = false }: Props) {
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        titleRef.current?.focus();
    }, []);

    return (
        <div className='step-heading'>
            {progress && (
                <p className='step-heading__progress'>
                    {progress.current} of {progress.total}
                </p>
            )}
            {isSuccess && (
                <span className='step-heading__check'>
                    <Check size={32} aria-hidden />
                </span>
            )}
            <h3 ref={titleRef} className='step-heading__title' tabIndex={-1}>
                {title}
            </h3>
            {description && <p className='step-heading__description'>{description}</p>}
        </div>
    );
}

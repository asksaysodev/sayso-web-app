import type { CSSProperties } from 'react';
import type { CoachTip } from '../../types';

interface Props {
    tip: CoachTip;
    number: number;
    /** Scrolled out of the carousel's view: hidden from assistive tech. */
    offscreen?: boolean;
}

export default function TipCard({ tip, number, offscreen = false }: Props) {
    return (
        <article className='dashboard-tip-card' aria-hidden={offscreen || undefined}>
            <span className='dashboard-tip-card__number'>{number}</span>
            <h3 className='dashboard-tip-card__title'>{tip.title}</h3>
            <div
                className='dashboard-tip-card__body'
                style={{ '--dashboard-tip-paragraph-gaps': Math.max(0, tip.body.length - 1) } as CSSProperties}
            >
                {tip.body.map((block) => (
                    <p key={block.text} className='dashboard-tip-card__text'>
                        {block.text}
                    </p>
                ))}
            </div>
        </article>
    );
}

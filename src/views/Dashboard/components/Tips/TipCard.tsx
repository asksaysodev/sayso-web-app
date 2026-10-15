import type { CoachTip } from '../../types';

interface Props {
    tip: CoachTip;
    number: number;
}

export default function TipCard({ tip, number }: Props) {
    return (
        <article className='dashboard-tip-card'>
            <span className='dashboard-tip-card__number'>{number}</span>
            <h3 className='dashboard-tip-card__title'>{tip.title}</h3>
            {tip.body.map((block) => (
                <p key={block.text} className='dashboard-tip-card__text'>
                    {block.text}
                </p>
            ))}
        </article>
    );
}

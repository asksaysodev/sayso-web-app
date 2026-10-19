export default function TipCardSkeleton() {
    return (
        <div className='dashboard-tip-card' aria-hidden='true'>
            <span className='skeleton dashboard-tip-card__number-skeleton' />
            <span className='skeleton dashboard-tip-card__title-skeleton' />
            <span className='skeleton dashboard-tip-card__line-skeleton' />
            <span className='skeleton dashboard-tip-card__line-skeleton' />
            <span className='skeleton dashboard-tip-card__line-skeleton dashboard-tip-card__line-skeleton--short' />
        </div>
    );
}

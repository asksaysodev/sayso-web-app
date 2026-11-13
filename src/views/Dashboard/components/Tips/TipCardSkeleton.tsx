const BODY_LINES = ['line-1', 'line-2', 'line-3', 'line-4', 'line-5', 'line-6', 'line-7'];

/** Same box as a loaded TipCard: the body keeps the card's fixed 9-line height, so the Tips row doesn't resize. */
export default function TipCardSkeleton() {
    return (
        <div className='dashboard-tip-card' aria-hidden='true'>
            <span className='skeleton dashboard-tip-card__number-skeleton' />
            <span className='skeleton dashboard-tip-card__title-skeleton' />
            <div className='dashboard-tip-card__body dashboard-tip-card__body-skeleton'>
                {BODY_LINES.map((id) => <span key={id} className='skeleton dashboard-tip-card__line-skeleton' />)}
            </div>
        </div>
    );
}

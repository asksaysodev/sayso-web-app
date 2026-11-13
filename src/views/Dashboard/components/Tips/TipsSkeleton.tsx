import type { CSSProperties } from 'react';
import useTipsPerPage from '../../hooks/useTipsPerPage';
import TipCardSkeleton from './TipCardSkeleton';

const SKELETON_CARDS = ['tip-1', 'tip-2', 'tip-3'];

/** Loading body of the Coach Tips widget: cards plus the pagination row, matching TipsPager's height. */
export default function TipsSkeleton() {
    const [skeletonRef, skeletonCount] = useTipsPerPage();

    return (
        <>
            <div
                ref={skeletonRef}
                className='dashboard-tips__grid'
                style={{ '--dashboard-tips-columns': skeletonCount } as CSSProperties}
            >
                {SKELETON_CARDS.slice(0, skeletonCount).map((id) => <TipCardSkeleton key={id} />)}
            </div>
            <div className='dashboard-tips__footer' aria-hidden='true'>
                <span className='skeleton dashboard-tips__range-skeleton' />
                <div className='dashboard-tips__nav'>
                    <span className='skeleton dashboard-tips__nav-skeleton' />
                    <span className='skeleton dashboard-tips__nav-skeleton' />
                </div>
            </div>
        </>
    );
}

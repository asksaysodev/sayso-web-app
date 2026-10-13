import { useState } from 'react';
import TipCard from './TipCard';
import TipsEmptyState from './TipsEmptyState';
import TipsPagination from './TipsPagination';
import type { CoachTip } from '../../types';

const TIPS_PER_PAGE = 3;

interface Props {
    tips: CoachTip[];
}

/** Keyed by scope in the parent, so switching team/member starts back on page one. */
export default function TipsPager({ tips }: Props) {
    const [page, setPage] = useState(0);
    const lastPage = Math.max(0, Math.ceil(tips.length / TIPS_PER_PAGE) - 1);
    const currentPage = Math.min(page, lastPage);
    const start = currentPage * TIPS_PER_PAGE;

    return (
        <>
            {tips.length === 0 ? (
                <TipsEmptyState />
            ) : (
                <div className='dashboard-tips__grid'>
                    {tips.slice(start, start + TIPS_PER_PAGE).map((tip, offset) => (
                        <TipCard key={tip.title} tip={tip} number={start + offset + 1} />
                    ))}
                </div>
            )}
            <TipsPagination
                start={start}
                pageSize={TIPS_PER_PAGE}
                total={tips.length}
                onBack={() => setPage(currentPage - 1)}
                onNext={() => setPage(currentPage + 1)}
            />
        </>
    );
}

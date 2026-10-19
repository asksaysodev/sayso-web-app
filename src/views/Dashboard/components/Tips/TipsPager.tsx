import { useState, type CSSProperties } from 'react';
import useTipsPerPage from '../../hooks/useTipsPerPage';
import TipCard from './TipCard';
import TipsEmptyState from './TipsEmptyState';
import TipsPagination from './TipsPagination';
import type { CoachTip } from '../../types';

interface Props {
    tips: CoachTip[];
}

/** Keyed by scope in the parent, so switching team/member starts back on page one. */
export default function TipsPager({ tips }: Props) {
    const [gridRef, pageSize] = useTipsPerPage();
    // Track the first visible tip rather than a page number. Clamped so the last page always ends on
    // the last tip (e.g. 3 tips, 2 per page: Next shows 2-3, not 3 + an empty slot), and so resizing
    // keeps the reader near the tip they were on.
    const [firstTip, setFirstTip] = useState(0);
    const start = Math.min(firstTip, Math.max(0, tips.length - pageSize));

    return (
        <>
            {tips.length === 0 ? (
                <TipsEmptyState />
            ) : (
                <div ref={gridRef} className='dashboard-tips__viewport'>
                    <div
                        className='dashboard-tips__track'
                        style={{ '--dashboard-tips-columns': pageSize, '--dashboard-tips-start': start } as CSSProperties}
                    >
                        {tips.map((tip, index) => (
                            <TipCard
                                key={tip.title}
                                tip={tip}
                                number={index + 1}
                                offscreen={index < start || index >= start + pageSize}
                            />
                        ))}
                    </div>
                </div>
            )}
            <TipsPagination
                start={start}
                pageSize={pageSize}
                total={tips.length}
                onBack={() => setFirstTip(Math.max(0, start - pageSize))}
                onNext={() => setFirstTip(Math.min(start + pageSize, tips.length - pageSize))}
            />
        </>
    );
}

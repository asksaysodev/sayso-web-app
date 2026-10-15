import { useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import TipCard from './TipCard';
import TipsEmptyState from './TipsEmptyState';
import TipsPagination from './TipsPagination';
import type { CoachTip } from '../../types';

const TIPS_PER_PAGE = 3;
/** Phones show one tip at a time; matches the single-column breakpoint in Tips.css. */
const MOBILE_TIPS_PER_PAGE = 1;

interface Props {
    tips: CoachTip[];
}

/** Keyed by scope in the parent, so switching team/member starts back on page one. */
export default function TipsPager({ tips }: Props) {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const pageSize = isMobile ? MOBILE_TIPS_PER_PAGE : TIPS_PER_PAGE;
    // Track the first visible tip rather than a page number, so resizing across the
    // breakpoint keeps the reader on the page that contains the tip they were on.
    const [firstTip, setFirstTip] = useState(0);
    const lastTip = Math.max(0, tips.length - 1);
    const start = Math.floor(Math.min(firstTip, lastTip) / pageSize) * pageSize;

    return (
        <>
            {tips.length === 0 ? (
                <TipsEmptyState />
            ) : (
                <div className='dashboard-tips__grid'>
                    {tips.slice(start, start + pageSize).map((tip, offset) => (
                        <TipCard key={tip.title} tip={tip} number={start + offset + 1} />
                    ))}
                </div>
            )}
            <TipsPagination
                start={start}
                pageSize={pageSize}
                total={tips.length}
                onBack={() => setFirstTip(start - pageSize)}
                onNext={() => setFirstTip(start + pageSize)}
            />
        </>
    );
}

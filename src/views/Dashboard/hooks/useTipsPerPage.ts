import { useElementWidth } from '@/hooks/useElementWidth';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const TIPS_PER_PAGE = 3;
/** Phones show one tip at a time; matches the single-column breakpoint in Tips.css. */
const MOBILE_TIPS_PER_PAGE = 1;
/** Narrowest a tip card may get; fewer cards per page (and more pages) below that. */
const TIP_MIN_WIDTH = 440;
/** Gap between tip cards (--space-12). */
const TIPS_GAP = 12;

/** How many min-width cards fit in the row, between 1 and TIPS_PER_PAGE. */
const tipsThatFit = (width: number) =>
    Math.min(TIPS_PER_PAGE, Math.max(1, Math.floor((width + TIPS_GAP) / (TIP_MIN_WIDTH + TIPS_GAP))));

/**
 * Tips shown per page, from the measured width of the tips row.
 * Shared by the carousel and its loading skeleton so both show the same number of cards.
 * @returns a callback ref for the row element, and the page size.
 */
export default function useTipsPerPage(): [(element: HTMLDivElement | null) => void, number] {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const [rowRef, rowWidth] = useElementWidth<HTMLDivElement>();
    const pageSize = isMobile ? MOBILE_TIPS_PER_PAGE : rowWidth === null ? TIPS_PER_PAGE : tipsThatFit(rowWidth);
    return [rowRef, pageSize];
}

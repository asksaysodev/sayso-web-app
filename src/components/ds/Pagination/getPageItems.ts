export type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

const MAX_WITHOUT_ELLIPSIS = 7;

/**
 * Page numbers to render, with ellipses once there are more than 7 pages.
 * Always shows first, last, current and its neighbours: `1 … 4 5 6 … 20`.
 */
export function getPageItems(page: number, pageCount: number): PageItem[] {
    if (pageCount <= MAX_WITHOUT_ELLIPSIS) {
        return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    let start = Math.max(2, Math.min(page - 1, pageCount - 4));
    let end = Math.min(pageCount - 1, Math.max(page + 1, 5));
    if (start === 3) start = 2;
    if (end === pageCount - 2) end = pageCount - 1;

    const items: PageItem[] = [1];
    if (start > 2) items.push('ellipsis-start');
    for (let p = start; p <= end; p++) items.push(p);
    if (end < pageCount - 1) items.push('ellipsis-end');
    items.push(pageCount);
    return items;
}

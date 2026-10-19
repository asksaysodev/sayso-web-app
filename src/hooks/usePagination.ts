import { useMemo, useState } from 'react';

export interface UsePaginationOptions {
    pageSize: number;
    /** Any value; when it changes the page goes back to 1 (e.g. search text + filter + sort). */
    resetKey?: unknown;
}

/**
 * Client-side pagination. `page` is 1-based and clamped to `pageCount` when rows shrink.
 */
export default function usePagination<T>(rows: T[], { pageSize: initialPageSize, resetKey }: UsePaginationOptions) {
    const [requestedPage, setRequestedPage] = useState(1);
    const [pageSize, setPageSizeState] = useState(initialPageSize);
    const [prevResetKey, setPrevResetKey] = useState(resetKey);

    if (!Object.is(resetKey, prevResetKey)) {
        setPrevResetKey(resetKey);
        setRequestedPage(1);
    }

    const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
    const page = Math.min(requestedPage, pageCount);

    const pageRows = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [rows, page, pageSize]);

    const setPage = (next: number) => setRequestedPage(Math.min(Math.max(1, next), pageCount));

    const setPageSize = (next: number) => {
        setPageSizeState(next);
        setRequestedPage(1);
    };

    return { pageRows, page, pageCount, setPage, pageSize, setPageSize };
}

import { useMemo, useState } from 'react';
import type { SortDirection } from '@/types/sort';

export type Comparator<T> = (a: T, b: T) => number;

export interface SortState<K extends string> {
    key: K;
    direction: SortDirection;
}

/**
 * Client-side sort. Toggling the active column flips direction; a new column starts ascending.
 * @param rows - Rows to sort (not mutated)
 * @param comparators - Ascending comparator per sortable column
 * @param initial - Starting column + direction
 */
export default function useSortableRows<T, K extends string>(
    rows: T[],
    comparators: Record<K, Comparator<T>>,
    initial: SortState<K>,
) {
    const [sort, setSort] = useState<SortState<K>>(initial);

    const sortedRows = useMemo(() => {
        const compare = comparators[sort.key];
        const sign = sort.direction === 'asc' ? 1 : -1;
        return [...rows].sort((a, b) => sign * compare(a, b));
    }, [rows, comparators, sort]);

    const toggleSort = (key: K) => {
        setSort((current) =>
            current.key === key
                ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
                : { key, direction: 'asc' },
        );
    };

    return { sortedRows, sortKey: sort.key, direction: sort.direction, toggleSort };
}

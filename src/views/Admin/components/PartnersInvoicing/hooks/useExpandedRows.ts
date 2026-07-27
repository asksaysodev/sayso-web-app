import { useState } from 'react';

export function useExpandedRows() {
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    function toggle(id: string) {
        setExpanded(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    function isExpanded(id: string): boolean {
        return expanded.has(id);
    }

    return { toggle, isExpanded };
}

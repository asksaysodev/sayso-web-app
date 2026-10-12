import { useEffect } from 'react';
import useDashboardScope from '../../hooks/useDashboardScope';
import useFilterOptions from '../../hooks/useFilterOptions';
import findSelectionLabel from '../../utils/findSelectionLabel';
import FiltersDrawer from './FiltersDrawer';
import ScopeChipRow from './ScopeChipRow';
import './Filters.css';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/** Admin-only: the applied-filter chip row plus the Filters drawer. */
export default function DashboardFilters({ open, onOpenChange }: Props) {
    const { selection, setSelection } = useDashboardScope();
    const { teams, members } = useFilterOptions(open || selection !== null);
    const selectionLabel = findSelectionLabel(selection, teams.options, members.options);

    const selectionList = selection?.scope === 'team' ? teams : members;
    const isStale = selection !== null && !selectionList.isLoading && !selectionList.isError && selectionLabel === null;

    useEffect(() => {
        if (isStale) setSelection(null);
    }, [isStale, setSelection]);

    return (
        <>
            {selectionLabel && <ScopeChipRow label={selectionLabel} onClear={() => setSelection(null)} />}
            <FiltersDrawer
                open={open}
                onOpenChange={onOpenChange}
                selection={selection}
                onApply={setSelection}
                teams={teams}
                members={members}
            />
        </>
    );
}

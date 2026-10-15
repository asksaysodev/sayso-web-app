import { SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetHeader } from '@/components/ds/Sheet';
import type { FilterOptionList, ScopeSelection } from '@/types/scope';
import FiltersDrawerContent from './FiltersDrawerContent';
import './ScopeFilters.css';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selection: ScopeSelection | null;
    onApply: (selection: ScopeSelection | null) => void;
    teams: FilterOptionList;
    members: FilterOptionList;
}

export default function FiltersDrawer({ open, onOpenChange, selection, onApply, teams, members }: Props) {
    const apply = (next: ScopeSelection | null) => {
        onApply(next);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetHeader icon={<SlidersHorizontal size={28} />} title='Filters' />
            <FiltersDrawerContent selection={selection} onApply={apply} teams={teams} members={members} />
        </Sheet>
    );
}

import { ActiveFilter, Signal } from "../types";
import SignalCollapsible from "./SignalCollapsible";
import ButtonSpinner from "@/components/ButtonSpinner";
import { useMemo, useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import DeleteSheetButton from "./DeleteSheetButton";
import SignalSearchBar from "./SignalSearchBar";

interface Props {
    isLoadingSignals: boolean;
    error?: Error | null;
    refetchSignals: () => void;
    isRefetchingSignals: boolean;
}

export default function SignalsCollapsibleList({ isLoadingSignals = false, error = null, refetchSignals, isRefetchingSignals = false }: Props) {
    const [expandedSignalId, setExpandedSignalId] = useState<string[] | null>(null);
    const [searchText, setSearchText] = useState('');
    const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
    const signalSheets = useAdminStore(state => state.signalSheets);
    const activeSheetVersion = useAdminStore(state => state.activeSheetVersion);
    const liveSheetVersion = useAdminStore(state => state.liveSheetVersion);

    const displayingSignals: Signal[] = useMemo(()=>{
        const matchedSignal = signalSheets.filter(s => s.version === activeSheetVersion);
        if (!matchedSignal[0]?.signals) return [];
        return matchedSignal[0].signals;
    },[signalSheets,activeSheetVersion])

    const filteredSignals = useMemo(() => {
        let results = displayingSignals;

        if (activeFilters.length > 0) {
            activeFilters.forEach(filter => {
                if (filter.key === 'stage_fit') {
                    results = results.filter((signal) => {
                        if (!signal.stage_fit) return false;
                        const stageFitValue = signal.stage_fit[filter.stage];
                        return stageFitValue?.toLowerCase() === filter.value.toLowerCase();
                    });
                }
            })
        }

        if (searchText) {
            const searchTerm = searchText.toLowerCase();
            results = results.filter((signal) => {
                const stageInstructionsMatch = signal.stage_instructions
                    ? Object.values(signal.stage_instructions).some(text => text.toLowerCase().includes(searchTerm))
                    : false;

                return signal.name.toLowerCase().includes(searchTerm) ||
                    signal.description.toLowerCase().includes(searchTerm) ||
                    signal.instructions.toLowerCase().includes(searchTerm) ||
                    stageInstructionsMatch;
            });
        }

        return results;
    }, [displayingSignals, searchText, activeFilters]);

    const handleExpandSignal = (id: string) => {
        setExpandedSignalId((prev) => {
            if (prev?.includes(id)) {
                return prev.filter((i) => i !== id);
            }
            return [...(prev || []), id];
        });
    };

    if (isLoadingSignals || isRefetchingSignals) {
        return (
            <div className='signals-draggable-list'>
                <div className="signals-loading-state">
                    <ButtonSpinner color="#1d4871" size={20} />
                    <span className="signals-loading-text">Loading signals...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='signals-draggable-list'>
                <div className="signals-error-state">
                    <span className="signals-error-title">Error Loading Signals</span>
                    <button className="sayso-outlined-button" onClick={refetchSignals} disabled={isRefetchingSignals}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='signals-draggable-list'>
            <div className="signals-draggable-list-header">
                <SignalSearchBar
                    searchText={searchText}
                    onSearchTextChange={setSearchText}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                />

                <div className="signals-header-actions">
                    <div className='live-indicator'>
                        <span>Live</span>
                        <div className={`${liveSheetVersion === activeSheetVersion ? 'live-dot' : 'not-live-dot'}`} />
                    </div>
                    <DeleteSheetButton />
                </div>
            </div>

            {filteredSignals?.map((signal: Signal) => (
                <SignalCollapsible
                    key={signal.id}
                    signal={signal}
                    isExpanded={expandedSignalId?.includes(signal.id) ?? false}
                    handleExpandSignal={handleExpandSignal}
                />
            ))}
        </div>
    )
}

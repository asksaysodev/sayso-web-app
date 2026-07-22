import { useCallback, useEffect, useRef, useState } from 'react';
import { LuSearch, LuUserMinus, LuUserPlus } from 'react-icons/lu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useDebounce from '@/hooks/useDebounce';
import useCrmConnection from '@/hooks/integrations/crm/useCrmConnection';
import useCrmLeads from '@/hooks/integrations/crm/useCrmLeads';
import type { CrmLead } from '@/hooks/integrations/crm/types';
import CreateLeadModal from './CreateLeadModal';
import CreateSureSendLeadModal from './CreateSureSendLeadModal';
import '../styles/AddLeadDropdown.css';

interface Props {
    trigger: React.ReactNode;
    currentLeadName?: string | null;
    onSelect: (lead: CrmLead | null) => void;
}

function LeadSkeleton() {
    return (
        <>
            {[...Array(4)].map((_, i) => (
                <div key={i} className="add-lead-skeleton-row">
                    <div className="add-lead-skeleton-name" />
                    <div className="add-lead-skeleton-sub" />
                </div>
            ))}
        </>
    );
}

export default function AddLeadDropdown({ trigger, currentLeadName, onSelect }: Props) {
    const [open, setOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 350);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const { isConnected, providerId, providerLabel } = useCrmConnection();
    const { leads, isLoading, error, hasNextPage, isFetchingNextPage, fetchNextPage } = useCrmLeads(debouncedSearch, { enabled: open });

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleSelect = (lead: CrmLead) => {
        onSelect(lead);
        setOpen(false);
        setSearch('');
    };

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (!next) setSearch('');
    };

    const handleCreateClick = () => {
        setOpen(false);
        setModalOpen(true);
    };

    const handleLeadCreated = (lead: CrmLead) => {
        onSelect(lead);
        setModalOpen(false);
    };

    const leadModal = useCallback(() => {
        if (providerId === 'suresend') {
            return <CreateSureSendLeadModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreated={handleLeadCreated}
            />
        }
        return <CreateLeadModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onCreated={handleLeadCreated}
        />
    }, [modalOpen, handleLeadCreated, providerId]);

    return (
        <>
            <Popover open={open} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild onClick={e => e.stopPropagation()}>
                    {trigger}
                </PopoverTrigger>
                <PopoverContent
                    className="add-lead-popover"
                    align="start"
                    sideOffset={6}
                    onClick={e => e.stopPropagation()}
                >
                    {!isConnected ? (
                        <div className="add-lead-state">
                            No CRM connected.{' '}
                            <a href="/settings" onClick={() => setOpen(false)}>
                                Connect one in Settings
                            </a>
                            .
                        </div>
                    ) : (
                        <>
                            {currentLeadName && (
                                <button
                                    className="add-lead-remove"
                                    onClick={() => { onSelect(null); setOpen(false); }}
                                >
                                    <LuUserMinus size={13} />
                                    Remove "{currentLeadName}"
                                </button>
                            )}
                            <div className="add-lead-search">
                                <LuSearch size={14} />
                                <input
                                    autoFocus
                                    placeholder={providerId === 'suresend' ? 'Search by email or phone' : `Search ${providerLabel} leads…`}
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="add-lead-list">
                                <button className="add-lead-create" onClick={handleCreateClick}>
                                    <LuUserPlus size={13} />
                                    Create lead
                                </button>

                                {isLoading ? (
                                    <LeadSkeleton />
                                ) : error ? (
                                    <div className="add-lead-state">
                                        Failed to load leads. Please try again.
                                    </div>
                                ) : leads.length === 0 ? (
                                    <div className="add-lead-state">
                                        {debouncedSearch
                                            ? `No leads match "${debouncedSearch}".`
                                            : 'No leads found.'}
                                    </div>
                                ) : (
                                    <>
                                        {leads.map(lead => {
                                            const sub = lead.primaryEmail ?? lead.primaryPhone ?? lead.stage ?? null;
                                            return (
                                                <button
                                                    key={lead.id}
                                                    className="add-lead-row"
                                                    onClick={() => handleSelect(lead)}
                                                >
                                                    <span className="add-lead-row-name">{lead.name}</span>
                                                    {sub && <span className="add-lead-row-sub">{sub}</span>}
                                                </button>
                                            );
                                        })}

                                        <div ref={sentinelRef} className="add-lead-sentinel" />

                                        {isFetchingNextPage && (
                                            <div className="add-lead-loading-more">Loading more…</div>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </PopoverContent>
            </Popover>
            {leadModal()}
        </>
    );
}

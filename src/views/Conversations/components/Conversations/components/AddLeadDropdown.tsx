import { useCallback, useEffect, useRef, useState } from 'react';
import { ExternalLink, Pencil, Search, Unlink, UserPlus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useDebounce from '@/hooks/useDebounce';
import useCrmConnection from '@/hooks/integrations/crm/useCrmConnection';
import useCrmLeads from '@/hooks/integrations/crm/useCrmLeads';
import useCrmLeadUrl from '@/hooks/integrations/crm/useCrmLeadUrl';
import type { CrmLead, CrmProviderId } from '@/hooks/integrations/crm/types';
import useRefreshLinkedLeadName from '../hooks/useRefreshLinkedLeadName';
import CreateLeadModal from './CreateLeadModal';
import CreateSureSendLeadModal from './CreateSureSendLeadModal';
import LeadSkeleton from './LeadSkeleton';
import '../styles/AddLeadDropdown.css';

interface Props {
    trigger: React.ReactNode;
    currentLeadName?: string | null;
    onSelect: (lead: CrmLead | null) => void;
    /** Linked lead's CRM id/provider; with `canAssignLead` they enable "Open in CRM" / "Edit". */
    currentLeadId?: string | null;
    currentLeadProvider?: CrmProviderId | null;
    canAssignLead?: boolean;
}

export default function AddLeadDropdown({ trigger, currentLeadName, onSelect, currentLeadId, currentLeadProvider, canAssignLead = false }: Props) {
    const [open, setOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 350);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const { isConnected, providerId } = useCrmConnection();
    const refreshLinkedLeadName = useRefreshLinkedLeadName();
    const hasLinkedLead = canAssignLead && !!currentLeadId && !!currentLeadProvider;
    const leadUrl = useCrmLeadUrl(currentLeadProvider ?? null, currentLeadId ?? null, open && hasLinkedLead);
    const {
        leads,
        isLoading,
        error,
        needsReauth,
        reauthProviderLabel,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useCrmLeads(debouncedSearch, { enabled: open });

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

    const handleEditClick = () => {
        setOpen(false);
        setEditOpen(true);
    };

    const editModal = () => {
        if (!editOpen || !currentLeadId || !currentLeadProvider) return null;
        const Modal = currentLeadProvider === 'suresend' ? CreateSureSendLeadModal : CreateLeadModal;
        return <Modal
            open={editOpen}
            mode="edit"
            leadId={currentLeadId}
            onClose={() => setEditOpen(false)}
            onUpdated={({ leadId, crmLeadName }) =>
                refreshLinkedLeadName({ leadId, providerId: currentLeadProvider, crmLeadName })}
        />;
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
                    {needsReauth ? (
                        <div className="add-lead-state">
                            Your {reauthProviderLabel ?? 'CRM'} connection expired.{' '}
                            <a href="/settings" onClick={() => setOpen(false)}>
                                Reconnect {reauthProviderLabel ?? 'it'} in Settings
                            </a>
                            .
                        </div>
                    ) : !isConnected ? (
                        <div className="add-lead-state">
                            No CRM connected.{' '}
                            <a href="/settings" onClick={() => setOpen(false)}>
                                Connect one in Settings
                            </a>
                            .
                        </div>
                    ) : (
                        <>
                            <div className="add-lead-search">
                                <Search size={16} />
                                <input
                                    autoFocus
                                    placeholder="Search by email or phone"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="add-lead-list">
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

                            <div className="add-lead-actions">
                                <button className="add-lead-create" onClick={handleCreateClick}>
                                    <UserPlus size={16} />
                                    Create lead
                                </button>
                                {hasLinkedLead && leadUrl && (
                                    <a
                                        className="add-lead-item"
                                        href={leadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setOpen(false)}
                                    >
                                        <ExternalLink size={16} />
                                        Open linked lead in CRM
                                    </a>
                                )}
                                {hasLinkedLead && (
                                    <button className="add-lead-item" onClick={handleEditClick}>
                                        <Pencil size={16} />
                                        Edit linked lead
                                    </button>
                                )}
                                {currentLeadName && (
                                    <>
                                        <div className="add-lead-divider" />
                                        <button
                                            className="add-lead-remove"
                                            onClick={() => { onSelect(null); setOpen(false); }}
                                        >
                                            <Unlink size={16} />
                                            Unlink from conversation
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </PopoverContent>
            </Popover>
            {leadModal()}
            {editModal()}
        </>
    );
}

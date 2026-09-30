import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Card } from '@/components/ds/Card';
import SearchBar, { type SearchFilterConfig } from '@/components/ui/search-bar';
import { useAuth } from '@/context/AuthContext';
import useCompanyMembers from '../hooks/useCompanyMembers';
import useResendInvite from '../hooks/useResendInvite';
import type { CompanyMemberRow, CompanyViewer, MemberRowAction, StatusFilter } from '../types';
import filterRows from '../utils/filterRows';
import CompanyMembersTable from './CompanyMembersTable';
import StatusFilterPill from './StatusFilterPill';
import './CompanyMembersCard.css';

const AVAILABLE_FILTERS: SearchFilterConfig<StatusFilter>[] = [
    {
        key: 'status',
        label: 'status',
        description: 'Filter by member status',
        defaultValue: () => ({ key: 'status', value: 'active' }),
    },
];

export default function CompanyMembersCard() {
    const { globalUser } = useAuth();
    const { members, isLoading, isError, isRetrying, retry } = useCompanyMembers();
    const { resendInvite } = useResendInvite();
    const [searchText, setSearchText] = useState('');
    const [activeFilters, setActiveFilters] = useState<StatusFilter[]>([]);

    const viewer: CompanyViewer = { id: globalUser?.id ?? '', role: globalUser?.role ?? null };
    const statusFilter = activeFilters.find((filter) => filter.key === 'status')?.value;

    const filteredRows = useMemo(
        () => filterRows(members, searchText, statusFilter),
        [members, searchText, statusFilter],
    );

    const handleAction = (action: MemberRowAction, row: CompanyMemberRow) => {
        if (action === 'resendInvite') resendInvite(row.id);
    };

    return (
        <Card className='company-members-card'>
            <div className='company-members-card__header'>
                <h2 className='company-members-card__title'>Company members</h2>
                <div className='company-members-card__controls'>
                    <div className='company-members-card__search'>
                        <SearchBar
                            searchText={searchText}
                            onSearchTextChange={setSearchText}
                            activeFilters={activeFilters}
                            setActiveFilters={setActiveFilters}
                            availableFilters={AVAILABLE_FILTERS}
                            placeholder='Search...'
                            filterPillRenderers={{
                                status: (filter, onUpdate, onRemove) => (
                                    <StatusFilterPill filter={filter} onUpdate={onUpdate} onRemove={onRemove} />
                                ),
                            }}
                        />
                    </div>
                    <Button leftIcon={<Plus size={20} />}>Add member</Button>
                </div>
            </div>
            <CompanyMembersTable
                rows={filteredRows}
                viewer={viewer}
                isLoading={isLoading}
                isError={isError}
                isRetrying={isRetrying}
                onRetry={retry}
                isFiltered={Boolean(searchText.trim() || statusFilter)}
                onAction={handleAction}
            />
        </Card>
    );
}

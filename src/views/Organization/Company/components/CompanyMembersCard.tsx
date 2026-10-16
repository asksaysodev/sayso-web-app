import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Card } from '@/components/ds/Card';
import SearchBar from '@/components/ui/search-bar';
import { useAuth } from '@/context/AuthContext';
import useCompanyMembers from '../hooks/useCompanyMembers';
import useResendInvite from '../hooks/useResendInvite';
import type { CompanyMemberRow, CompanyViewer, MemberRowAction } from '../types';
import filterRows from '../utils/filterRows';
import CompanyMembersTable from './CompanyMembersTable';
import InviteMemberModal from './InviteMemberModal';
import RemoveMemberModal from './RemoveMemberModal';
import UpdateRoleModal from '@/views/Organization/shared/components/UpdateRoleModal';
import '@/views/Organization/shared/styles/orgCard.css';

type OpenModal =
    | { kind: 'invite' }
    | { kind: 'updateRole'; row: CompanyMemberRow }
    | { kind: 'remove'; row: CompanyMemberRow }
    | null;

export default function CompanyMembersCard() {
    const { globalUser } = useAuth();
    const { members, isLoading, isError, isRetrying, retry } = useCompanyMembers();
    const { resendInvite } = useResendInvite();
    const [searchText, setSearchText] = useState('');
    const [openModal, setOpenModal] = useState<OpenModal>(null);

    const viewer: CompanyViewer = { id: globalUser?.id ?? '', role: globalUser?.role ?? null };

    const filteredRows = useMemo(
        () => filterRows(members, searchText),
        [members, searchText],
    );

    const closeModal = () => setOpenModal(null);

    const handleAction = (action: MemberRowAction, row: CompanyMemberRow) => {
        switch (action) {
            case 'resendInvite':
                resendInvite(row.id);
                break;
            case 'updateRole':
                setOpenModal({ kind: 'updateRole', row });
                break;
            case 'removeMember':
            case 'revokeInvite':
                setOpenModal({ kind: 'remove', row });
                break;
        }
    };

    return (
        <Card className='org-card'>
            <div className='org-card__header'>
                <h2 className='org-card__title'>Company members</h2>
                <div className='org-card__controls'>
                    <div className='org-card__search'>
                        <SearchBar
                            searchText={searchText}
                            onSearchTextChange={setSearchText}
                            placeholder='Search...'
                        />
                    </div>
                    <Button leftIcon={<Plus size={20} />} onClick={() => setOpenModal({ kind: 'invite' })}>
                        Add member
                    </Button>
                </div>
            </div>
            <CompanyMembersTable
                rows={filteredRows}
                viewer={viewer}
                isLoading={isLoading}
                isError={isError}
                isRetrying={isRetrying}
                onRetry={retry}
                isFiltered={Boolean(searchText.trim())}
                onAction={handleAction}
            />
            {openModal?.kind === 'invite' && <InviteMemberModal onClose={closeModal} />}
            {openModal?.kind === 'updateRole' && <UpdateRoleModal target={openModal.row} onClose={closeModal} />}
            {openModal?.kind === 'remove' && <RemoveMemberModal row={openModal.row} onClose={closeModal} />}
        </Card>
    );
}

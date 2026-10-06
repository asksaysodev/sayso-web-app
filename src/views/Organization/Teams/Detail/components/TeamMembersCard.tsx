import { useMemo, useState } from 'react';
import { Card } from '@/components/ds/Card';
import SearchBar from '@/components/ui/search-bar';
import { useAuth } from '@/context/AuthContext';
import type { CompanyViewer } from '@/views/Organization/Company/types';
import UpdateRoleModal from '@/views/Organization/shared/components/UpdateRoleModal';
import type { TeamMember, TeamMemberAction } from '../../types';
import filterTeamMembers from '../../utils/filterTeamMembers';
import RemoveFromTeamModal from './RemoveFromTeamModal';
import TeamMembersTable from './TeamMembersTable';
import '@/views/Organization/shared/styles/orgCard.css';

type OpenModal = { kind: TeamMemberAction; member: TeamMember } | null;

interface Props {
    teamId: string;
    members: TeamMember[];
}

export default function TeamMembersCard({ teamId, members }: Props) {
    const { globalUser } = useAuth();
    const [searchText, setSearchText] = useState('');
    const [openModal, setOpenModal] = useState<OpenModal>(null);

    const viewer: CompanyViewer = { id: globalUser?.id ?? '', role: globalUser?.role ?? null };
    const filteredMembers = useMemo(() => filterTeamMembers(members, searchText), [members, searchText]);
    const closeModal = () => setOpenModal(null);

    return (
        <Card className='org-card'>
            <div className='org-card__header'>
                <h2 className='org-card__title'>Team members</h2>
                <div className='org-card__controls'>
                    <div className='org-card__search'>
                        <SearchBar
                            searchText={searchText}
                            onSearchTextChange={setSearchText}
                            placeholder='Search members…'
                        />
                    </div>
                </div>
            </div>
            <TeamMembersTable
                members={filteredMembers}
                viewer={viewer}
                isFiltered={searchText.trim() !== ''}
                onAction={(kind, member) => setOpenModal({ kind, member })}
            />
            {openModal?.kind === 'updateRole' && (
                <UpdateRoleModal
                    target={{ id: openModal.member.accountId, email: openModal.member.email, role: openModal.member.role }}
                    onClose={closeModal}
                />
            )}
            {openModal?.kind === 'removeFromTeam' && (
                <RemoveFromTeamModal teamId={teamId} accountId={openModal.member.accountId} onClose={closeModal} />
            )}
        </Card>
    );
}

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Card } from '@/components/ds/Card';
import SearchBar from '@/components/ui/search-bar';
import { useAuth } from '@/context/AuthContext';
import type { CompanyViewer } from '@/views/Organization/Company/types';
import UpdateRoleModal from '@/views/Organization/shared/components/UpdateRoleModal';
import type { TeamMember, TeamMemberAction } from '../../types';
import filterTeamMembers from '../../utils/filterTeamMembers';
import AddTeamMemberModal from './AddTeamMemberModal';
import RemoveFromTeamModal from './RemoveFromTeamModal';
import TeamMembersTable from './TeamMembersTable';
import TransferMemberModal from './TransferMemberModal';
import '@/views/Organization/shared/styles/orgCard.css';

type OpenModal = { kind: TeamMemberAction; member: TeamMember } | { kind: 'addMember' } | null;

interface Props {
    teamId: string;
    teamName: string;
    members: TeamMember[];
}

export default function TeamMembersCard({ teamId, teamName, members }: Props) {
    const { globalUser } = useAuth();
    const [searchText, setSearchText] = useState('');
    const [openModal, setOpenModal] = useState<OpenModal>(null);

    const viewer: CompanyViewer = { id: globalUser?.id ?? '', role: globalUser?.role ?? null };
    const filteredMembers = useMemo(() => filterTeamMembers(members, searchText), [members, searchText]);
    const closeModal = () => setOpenModal(null);
    const openAddMember = () => setOpenModal({ kind: 'addMember' });

    const renderModal = () => {
        switch (openModal?.kind) {
            case 'addMember':
                return <AddTeamMemberModal teamId={teamId} teamName={teamName} onClose={closeModal} />;
            case 'updateRole': {
                const { accountId, email, role } = openModal.member;
                return <UpdateRoleModal target={{ id: accountId, email, role }} onClose={closeModal} />;
            }
            case 'transferMember':
                return (
                    <TransferMemberModal
                        teamId={teamId}
                        teamName={teamName}
                        member={openModal.member}
                        onClose={closeModal}
                    />
                );
            case 'removeFromTeam':
                return <RemoveFromTeamModal teamId={teamId} accountId={openModal.member.accountId} onClose={closeModal} />;
            default:
                return null;
        }
    };

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
                    <Button leftIcon={<Plus size={20} />} onClick={openAddMember}>
                        Add member
                    </Button>
                </div>
            </div>
            <TeamMembersTable
                members={filteredMembers}
                viewer={viewer}
                isFiltered={searchText.trim() !== ''}
                onAction={(kind, member) => setOpenModal({ kind, member })}
                onAddMember={openAddMember}
            />
            {renderModal()}
        </Card>
    );
}

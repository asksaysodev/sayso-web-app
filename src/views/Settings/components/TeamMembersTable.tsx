import { useMemo, useState } from "react";
import { LuUserPlus, LuEllipsis, LuUserMinus, LuSend, LuBan, LuMail } from "react-icons/lu";
import InviteMemberModal from "./InviteMemberModal";
import SaysoModal from "../../../components/SaysoModal";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import SaysoButton from "../../../components/SaysoButton";
import SearchBar, { SearchFilterConfig } from "@/components/ui/search-bar";
import { getInitials } from "@/utils/helpers/getInitials";
import StatusBadge from "./TeamMemberStatusBadge";
import StatusFilterPill from "./StatusFilterPill";
import { MemberActiveFilter } from "../types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/context/ToastContext";
import { OrganizationMembersResponse } from "@/types/user";
import getOrganizationMembers from "../services/getOrganizationMembers";
import revokeInvite from "../services/revokeInvite";
import resendInvite from "../services/resendInvite";
import removeMember from "../services/removeMember";
import { AccountStatus } from "@/types/user";

const AVAILABLE_FILTERS: SearchFilterConfig<MemberActiveFilter>[] = [
    {
        key: 'status',
        label: 'status',
        description: 'Filter by member status',
        defaultValue: () => ({ key: 'status', value: 'active' }),
    },
];

export default function TeamMembersTable() {
    const [searchText, setSearchText] = useState("");
    const [activeFilters, setActiveFilters] = useState<MemberActiveFilter[]>([]);
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const updateInviteStatus = (id: string, status: OrganizationMembersResponse['invites'][number]['status']) => {
        queryClient.setQueryData<OrganizationMembersResponse>(['get-organization-members'], (prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                invites: prev.invites.map(i => i.id === id ? { ...i, status } : i),
            };
        });
    };

    const { data } = useQuery({
        queryKey: ['get-organization-members'],
        queryFn: getOrganizationMembers
    })

    const filtered = useMemo(() => {
        if (!data) return [];
        const { members, invites } = data;
        const all = [...(invites ?? []), ...(members ?? [])];

        const statusFilter = activeFilters.find(f => f.key === 'status');
        const text = searchText.toLowerCase().trim();

        return all.filter(item => {
            if (statusFilter && item.status !== statusFilter.value) return false;
            if (text) {
                const matchesName = `${item?.name ?? ''} ${item?.lastname ?? ''}`.toLowerCase().includes(text);
                const matchesEmail = item.email?.toLowerCase().includes(text);
                if (!matchesName && !matchesEmail) return false;
            }
            return true;
        });
    }, [data, searchText, activeFilters])
    
    const handleDeleteMember = async () => {
        if (!deleteMemberId) return;
        const id = deleteMemberId;
        setDeleteMemberId(null);
        queryClient.setQueryData<OrganizationMembersResponse>(['get-organization-members'], (prev) => {
            if (!prev) return prev;
            return { ...prev, members: prev.members.filter(m => m.id !== id) };
        });
        await removeMember(id);
        queryClient.invalidateQueries({ queryKey: ['get-organization-members'] });
        showToast('success', 'Member removed successfully');
    }

    const { mutate: handleRevoke } = useMutation({
        mutationFn: (inviteId: string) => revokeInvite(inviteId),
        onMutate: (inviteId) => updateInviteStatus(inviteId, 'revoked'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-organization-members'] });
            showToast('success', 'Invite revoked');
        },
    });

    const { mutate: handleResend } = useMutation({
        mutationFn: (inviteId: string) => resendInvite(inviteId),
        onMutate: (inviteId) => updateInviteStatus(inviteId, 'pending'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-organization-members'] });
            showToast('success', 'Invite resent successfully');
        },
    });

    const renderDropdownContent = (status: AccountStatus, id: string) => {
        switch(status) {
            case "active": return (
                <DropdownMenuItem
                    className="team-member-action-remove"
                    onClick={() => setDeleteMemberId(id)}
                >
                    <LuUserMinus />
                    Remove
                </DropdownMenuItem>
            )
            case "expired": return (
                <DropdownMenuItem 
                    className="team-member-action-resend" 
                    onClick={() => handleResend(id)}
                >
                    <LuSend />
                    Resend Invite
                </DropdownMenuItem>
            )
            case "pending": return (
                <DropdownMenuItem 
                    className="team-member-action-remove" 
                    onClick={() => handleRevoke(id)}
                >
                    <LuBan />
                    Revoke
                </DropdownMenuItem>
            )
            case "revoked": return null
        }
    }
    
    return (
        <>
        <InviteMemberModal open={inviteModalOpen} onClose={() => setInviteModalOpen(false)} />
        {deleteMemberId && (
            <SaysoModal
                title="Delete Member"
                text="This action cannot be undone. The member will lose access to the company and their login credentials will be revoked. Are you sure you want to continue?"
                isDelete={true}
                primaryText="Yes, Delete"
                secondaryText="Cancel"
                onDeny={() => setDeleteMemberId(null)}
                onConfirm={handleDeleteMember}
            />
        )}
        <div className="team-members-table-container">
            <div className="team-members-toolbar">
                <h3 className="team-members-title">Members</h3>
                <div className="team-members-toolbar-right">
                    <SearchBar
                        searchText={searchText}
                        onSearchTextChange={setSearchText}
                        activeFilters={activeFilters}
                        setActiveFilters={setActiveFilters}
                        availableFilters={AVAILABLE_FILTERS}
                        placeholder="Search members..."
                        renderFilterPill={(filter, onUpdate, onRemove) => (
                            <StatusFilterPill filter={filter} onUpdate={onUpdate} onRemove={onRemove} />
                        )}
                    />
                    <SaysoButton
                        size="sm"
                        label="Add Member"
                        variant="sayso-indigo"
                        fullWidth={false}
                        icon={<LuUserPlus />}
                        onClick={() => setInviteModalOpen(true)}
                    />
                </div>
            </div>

            <div className="team-members-table-wrapper">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[48px]"></TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[48px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center" style={{ color: "var(--sayso-lightgray)", padding: "32px 0" }}>
                                    No members found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map(({name, lastname, id, email, status}) => {
                                const hasName = !!(name || lastname);

                                return (
                                    <TableRow key={id}>
                                        <TableCell>
                                            <div className={`team-member-avatar${hasName ? "" : " team-member-avatar--invite"}`}>
                                                {hasName ? getInitials(name ?? "", lastname ?? "") : <LuMail size={16} />}
                                            </div>
                                        </TableCell>
                                        <TableCell className="team-member-name">
                                            {name || lastname ? `${name ?? ""} ${lastname ?? ""}`.trim() : <span style={{ color: "var(--sayso-lightgray)" }}>Pending invite</span>}
                                        </TableCell>
                                        <TableCell className="team-member-email">
                                            {email}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={status} />
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="team-member-actions-btn">
                                                        <LuEllipsis />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {renderDropdownContent(status, id)}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
        </>
    );
}

import { useMemo, useState } from "react";
import { LuUserPlus, LuEllipsis, LuUserMinus, LuSend } from "react-icons/lu";
import InviteMemberModal from "./InviteMemberModal";
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
import { ORG_USERS } from "../orgaUsers";
import { getInitials } from "@/utils/helpers/getInitials";
import StatusBadge from "./TeamMemberStatusBadge";
import StatusFilterPill from "./StatusFilterPill";
import { MemberActiveFilter } from "../types";
import { useQuery } from "@tanstack/react-query";
import getOrganizationMembers from "../services/getOrganizationMembers";

type OrgUser = typeof ORG_USERS[number];

const AVAILABLE_FILTERS: SearchFilterConfig<MemberActiveFilter>[] = [
    {
        key: 'status',
        label: 'status',
        description: 'Filter by member status',
        defaultValue: () => ({ key: 'status', value: 'active' }),
    },
];

interface Props {
    onAddMember: () => void;
    onRemoveMember: (id: string) => void;
}

export default function TeamMembersTable({ onAddMember, onRemoveMember }: Props) {
    const [searchText, setSearchText] = useState("");
    const [activeFilters, setActiveFilters] = useState<MemberActiveFilter[]>([]);
    const [inviteModalOpen, setInviteModalOpen] = useState(false);

    const { data } = useQuery({
        queryKey: ['get-organization-members'],
        queryFn: getOrganizationMembers
    })

    const filtered = useMemo(() => {
        console.log(data, 'data')
        if (!data) return [];
        const { members } = data;
        return members ?? []
    },[data])
    
    return (
        <>
        <InviteMemberModal open={inviteModalOpen} onClose={() => setInviteModalOpen(false)} />
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
                            filtered.map((user: OrgUser) => {
                                const initials = getInitials(user.firstName, user.lastName);
                                const isInvited = user.status.toLowerCase() === "invited";

                                return (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="team-member-avatar">
                                                {initials}
                                            </div>
                                        </TableCell>
                                        <TableCell className="team-member-name">
                                            {user.firstName} {user.lastName}
                                        </TableCell>
                                        <TableCell className="team-member-email">
                                            {user.email}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={user.status} />
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="team-member-actions-btn">
                                                        <LuEllipsis />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {isInvited && (
                                                        <DropdownMenuItem className="team-member-action-resend">
                                                            <LuSend />
                                                            Resend Invite
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        className="team-member-action-remove"
                                                        onClick={() => onRemoveMember(user.id)}
                                                    >
                                                        <LuUserMinus />
                                                        Remove
                                                    </DropdownMenuItem>
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

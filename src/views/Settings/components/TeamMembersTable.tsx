import { useState } from "react";
import { LuSearch, LuUserPlus, LuEllipsis, LuUserMinus, LuSend, LuListFilter } from "react-icons/lu";
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
import { ORG_USERS } from "../orgaUsers";
import { getInitials } from "@/utils/helpers/getInitials";
import StatusBadge from "./TeamMemberStatusBadge";

type OrgUser = typeof ORG_USERS[number];

interface Props {
    onAddMember: () => void;
    onRemoveMember: (id: string) => void;
}

export default function TeamMembersTable({ onAddMember, onRemoveMember }: Props) {
    const [search, setSearch] = useState("");

    const filtered = ORG_USERS.filter((u) => {
        const q = search.toLowerCase();
        return (
            u.firstName.toLowerCase().includes(q) ||
            u.lastName.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        );
    });

    return (
        <div className="team-members-table-container">
            <div className="team-members-toolbar">
                <h3 className="team-members-title">Members</h3>
                <div className="team-members-toolbar-right">
                    <div className="team-members-search">
                        <LuSearch className="team-members-search-icon" />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <SaysoButton
                        size="sm"
                        label="Filters"
                        variant="outlined"
                        fullWidth={false}
                        icon={<LuListFilter />}
                        onClick={() => {}}
                    />
                    <SaysoButton
                        size="sm"
                        label="Add Member"
                        variant="sayso-indigo"
                        fullWidth={false}
                        icon={<LuUserPlus />}
                        onClick={onAddMember}
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
    );
}

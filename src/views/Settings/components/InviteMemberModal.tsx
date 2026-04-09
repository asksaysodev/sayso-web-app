import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuLoader } from "react-icons/lu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import SaysoButton from "@/components/SaysoButton";
import EmailChipsInput from "@/components/forms/EmailChipsInput";
import sendTeamInvite from "../services/sendTeamInvite";
import { useToast } from "@/context/ToastContext";
import { OrganizationMembersResponse } from "@/types/user";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function InviteMemberModal({ open, onClose }: Props) {
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const [emails, setEmails] = useState<string[]>([]);

    const { mutate, isPending } = useMutation({
        mutationFn: (emails: string[]) => sendTeamInvite(emails),
        onMutate: (emails) => {
            const tempIds = emails.map((email) => ({
                email,
                id: `optimistic-${Date.now()}-${email}`,
            }));
            queryClient.setQueryData(['get-organization-members'], (prev: OrganizationMembersResponse | undefined) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    invites: [
                        ...prev.invites,
                        ...tempIds.map(({ id, email }) => ({
                            id, email, name: '', lastname: '', status: 'pending' as const, invited_by: '', expires_at: '',
                        })),
                    ],
                };
            });
            return { tempIds };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-organization-members'] });
            const count = emails.length;
            showToast("success", count === 1 ? "Invitation sent successfully." : `${count} invitations sent successfully.`);
            setEmails([]);
            onClose();
        },
        onError: (_err, _emails, context) => {
            queryClient.setQueryData(['get-organization-members'], (prev: OrganizationMembersResponse | undefined) => {
                if (!prev) return prev;
                const tempIdSet = new Set(context?.tempIds.map((t) => t.id));
                return { ...prev, invites: prev.invites.filter((i) => !tempIdSet.has(i.id)) };
            });
            showToast("error", "Failed to send invitation(s). Please try again.");
        },
    });

    const handleSubmit = () => {
        if (emails.length === 0) return;
        mutate(emails);
    };

    const handleClose = () => {
        if (isPending) return;
        setEmails([]);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite Team Member{emails.length > 1 ? "s" : ""}</DialogTitle>
                    <DialogDescription>
                        Enter one or more email addresses to invite to your organization.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2 flex flex-col gap-1.5">
                    <EmailChipsInput
                        chips={emails}
                        onChange={setEmails}
                        disabled={isPending}
                        label="Email addresses"
                        placeholder="colleague@company.com"
                    />
                    <p style={{ fontSize: "12px", color: "#9ca3af" }}>Press Enter, Space, Tab or comma to add each email.</p>
                </div>

                <DialogFooter className="mt-4">
                    <SaysoButton
                        type="button"
                        label="Cancel"
                        variant="outlined"
                        size="sm"
                        fullWidth={false}
                        onClick={handleClose}
                        disabled={isPending}
                    />
                    <SaysoButton
                        type="button"
                        label={isPending ? "Sending..." : emails.length > 1 ? `Send ${emails.length} Invites` : "Send Invite"}
                        variant="sayso-indigo"
                        size="sm"
                        fullWidth={false}
                        icon={isPending ? <LuLoader className="animate-spin" /> : undefined}
                        disabled={isPending || emails.length === 0}
                        onClick={handleSubmit}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

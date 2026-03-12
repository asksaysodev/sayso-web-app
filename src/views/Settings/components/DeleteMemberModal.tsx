import { useQueryClient } from "@tanstack/react-query";
import SaysoModal from "../../../components/SaysoModal";
import { useToast } from "@/context/ToastContext";
import { OrganizationMembersResponse } from "@/types/user";
import removeMember from "../services/removeMember";

interface Props {
    memberId: string | null;
    onClose: () => void;
}

export default function DeleteMemberModal({ memberId, onClose }: Props) {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    if (!memberId) return null;

    const handleDelete = async () => {
        onClose();
        queryClient.setQueryData<OrganizationMembersResponse>(['get-organization-members'], (prev) => {
            if (!prev) return prev;
            return { ...prev, members: prev.members.filter(m => m.id !== memberId) };
        });
        await removeMember(memberId);
        queryClient.invalidateQueries({ queryKey: ['get-organization-members'] });
        showToast('success', 'Member removed successfully');
    };

    return (
        <SaysoModal
            title="Delete Member"
            text="This action cannot be undone. The member will lose access to the company and their login credentials will be revoked. Are you sure you want to continue?"
            isDelete={true}
            primaryText="Yes, Delete"
            secondaryText="Cancel"
            onDeny={onClose}
            onConfirm={handleDelete}
        />
    );
}

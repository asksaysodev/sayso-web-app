import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { LuLoader } from "react-icons/lu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import ControlledInputField from "@/components/forms/ControlledInputField";
import SaysoButton from "@/components/SaysoButton";
import sendTeamInvite from "../services/sendTeamInvite";
import { useToast } from "@/context/ToastContext";

interface FormValues {
    email: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function InviteMemberModal({ open, onClose }: Props) {
    const { showToast } = useToast();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues: { email: "" },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (email: string) => sendTeamInvite(email),
        onSuccess: () => {
            showToast("success", "Invitation sent successfully.");
            reset();
            onClose();
        },
        onError: () => {
            showToast("error", "Failed to send invitation. Please try again.");
        },
    });

    const onSubmit = ({ email }: FormValues) => {
        mutate(email);
    };

    const handleClose = () => {
        if (isPending) return;
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                        Enter an email address to send an invitation to your organization.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="py-2">
                        <ControlledInputField
                            name="email"
                            control={control}
                            label="Email address"
                            placeholder="colleague@company.com"
                            type="email"
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Please enter a valid email address",
                                },
                            }}
                            disabled={isPending}
                        />
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
                            type="submit"
                            label={isPending ? "Sending..." : "Send Invite"}
                            variant="sayso-indigo"
                            size="sm"
                            fullWidth={false}
                            icon={isPending ? <LuLoader className="animate-spin" /> : undefined}
                            disabled={isPending}
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

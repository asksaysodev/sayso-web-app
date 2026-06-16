import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'libphonenumber-js';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SaysoButton from '@/components/SaysoButton';
import { useToast } from '@/context/ToastContext';
import useCrmCreateLead from '@/hooks/integrations/crm/useCrmCreateLead';
import type { CrmLead } from '@/hooks/integrations/crm/types';

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: (lead: CrmLead) => void;
}

interface FormValues {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidPhone = (v: string) => isValidPhoneNumber(v.trim(), 'US');

export default function CreateLeadModal({ open, onClose, onCreated }: Props) {
    const { showToast } = useToast();
    const { createLead, isPending } = useCrmCreateLead();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues: { firstName: '', lastName: '', phone: '', email: '' },
    });

    useEffect(() => {
        if (!open) reset();
    }, [open, reset]);

    const handleClose = () => {
        if (isPending) return;
        onClose();
    };

    const onSubmit = async (values: FormValues) => {
        try {
            const lead = await createLead({
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                phone: values.phone.trim(),
                email: values.email.trim() || undefined,
            });
            showToast('success', `${lead.name} added to your CRM.`);
            onCreated(lead);
            handleClose();
        } catch {
            showToast('error', 'Failed to create lead. Please try again.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={isOpen => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Lead</DialogTitle>
                    <DialogDescription>
                        Add a new contact to your CRM and link them to this conversation.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4 py-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="cl-firstName">First name *</Label>
                                <Input
                                    id="cl-firstName"
                                    placeholder="Jane"
                                    disabled={isPending}
                                    {...register('firstName', { required: 'First name is required.' })}
                                />
                                {errors.firstName && (
                                    <p className="text-xs text-destructive">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="cl-lastName">Last name *</Label>
                                <Input
                                    id="cl-lastName"
                                    placeholder="Smith"
                                    disabled={isPending}
                                    {...register('lastName', { required: 'Last name is required.' })}
                                />
                                {errors.lastName && (
                                    <p className="text-xs text-destructive">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="cl-phone">Phone *</Label>
                            <Input
                                id="cl-phone"
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                disabled={isPending}
                                {...register('phone', {
                                    required: 'Phone is required.',
                                    validate: v => isValidPhone(v) || 'Enter a valid phone number.',
                                })}
                            />
                            {errors.phone && (
                                <p className="text-xs text-destructive">{errors.phone.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="cl-email">Email</Label>
                            <Input
                                id="cl-email"
                                type="email"
                                placeholder="jane@example.com"
                                disabled={isPending}
                                {...register('email', {
                                    validate: v => !v.trim() || EMAIL_RE.test(v.trim()) || 'Enter a valid email address.',
                                })}
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-2">
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
                            label={isPending ? 'Creating…' : 'Create Lead'}
                            variant="sayso-indigo"
                            size="sm"
                            fullWidth={false}
                            loading={isPending}
                            disabled={isPending}
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Sentry from '@sentry/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PhoneInput, isValidPhone, toE164 } from '@/components/ui/PhoneInput';
import { Label } from '@/components/ui/label';
import SaysoButton from '@/components/SaysoButton';
import { useToast } from '@/context/ToastContext';
import useCrmCreateLead from '@/hooks/integrations/crm/useCrmCreateLead';
import { CrmReauthRequiredError } from '@/hooks/integrations/crm/errors';
import type { CrmLead } from '@/hooks/integrations/crm/types';
import '../styles/CreateLeadModal.css';

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

export default function CreateLeadModal({ open, onClose, onCreated }: Props) {
    const { showToast } = useToast();
    const { createLead, isPending } = useCrmCreateLead();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
        defaultValues: { firstName: '', lastName: '', phone: '', email: '' },
    });

    useEffect(() => {
        if (!open) {
            reset();
            setSubmitError(null);
        }
    }, [open, reset]);

    const handleClose = () => {
        if (isPending) return;
        onClose();
    };

    const onSubmit = async (values: FormValues) => {
        setSubmitError(null);
        try {
            const lead = await createLead({
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                phone: toE164(values.phone),
                email: values.email.trim() || undefined,
            });
            showToast('success', `${lead.name} added to your CRM.`);
            onCreated(lead);
            handleClose();
        } catch (error) {
            if (error instanceof CrmReauthRequiredError) {
                setSubmitError('Your CRM connection expired. Reconnect it in Settings to create leads.');
                return;
            }
            Sentry.captureException(error);
            setSubmitError('Failed to create lead. Please try again.');
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
                            <Controller
                                name="phone"
                                control={control}
                                rules={{
                                    required: 'Phone is required.',
                                    validate: v => isValidPhone(v) || 'Enter a valid phone number.',
                                }}
                                render={({ field }) => (
                                    <PhoneInput
                                        id="cl-phone"
                                        placeholder="+1 (555) 000-0000"
                                        disabled={isPending}
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        ref={field.ref}
                                    />
                                )}
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

                    {submitError && (
                        <p className="text-xs text-destructive mt-2" role="alert">{submitError}</p>
                    )}

                    <DialogFooter className="create-lead-modal-footer-wrapper">
						<div className='button-wrapper'>
							<SaysoButton
								type="button"
								label="Cancel"
								variant="outlined"
								size="sm"
								fullWidth={true}
								onClick={handleClose}
								disabled={isPending}
							/>
						</div>
						<div className='button-wrapper'>
							<SaysoButton
								type="submit"
								label={isPending ? 'Creating…' : 'Create Lead'}
								variant="sayso-indigo"
								size="sm"
								fullWidth={true}
								loading={isPending}
								disabled={isPending}
							/>
						</div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

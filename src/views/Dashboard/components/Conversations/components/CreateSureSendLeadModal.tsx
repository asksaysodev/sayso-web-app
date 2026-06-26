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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import SaysoButton from '@/components/SaysoButton';
import { useToast } from '@/context/ToastContext';
import useCrmCreateLead from '@/hooks/integrations/crm/useCrmCreateLead';
import apiClient from '@/config/axios';
import type { CrmLead } from '@/hooks/integrations/crm/types';

interface SureSendStage {
    id: string;
    name: string;
    active: boolean;
}

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
    stage: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CreateSureSendLeadModal({ open, onClose, onCreated }: Props) {
    const { showToast } = useToast();
    const { createLead, isPending } = useCrmCreateLead();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [stages, setStages] = useState<SureSendStage[]>([]);
    const [stagesLoading, setStagesLoading] = useState(false);
    const [stagesError, setStagesError] = useState(false);

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues: { firstName: '', lastName: '', phone: '', email: '', stage: '' },
    });

    useEffect(() => {
        if (!open) {
            reset();
            setSubmitError(null);
            setStagesError(false);
            return;
        }
        setStagesLoading(true);
        setStagesError(false);
        apiClient.get<{ stages: SureSendStage[] }>('/suresend/stages')
            .then(res => setStages(res.data?.stages ?? []))
            .catch(err => {
                Sentry.captureException(err);
                setStages([]);
                setStagesError(true);
            })
            .finally(() => setStagesLoading(false));
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
                email: values.email.trim(),
                stage: values.stage,
            });
            showToast('success', `${lead.name} added to your CRM.`);
            onCreated(lead);
            handleClose();
        } catch (error) {
            Sentry.captureException(error);
            setSubmitError('Failed to create lead. Please try again.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={isOpen => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create SureSend Lead</DialogTitle>
                    <DialogDescription>
                        Add a new contact to SureSend and link them to this conversation.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4 py-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="ss-firstName">First name *</Label>
                                <Input
                                    id="ss-firstName"
                                    placeholder="Jane"
                                    disabled={isPending}
                                    {...register('firstName', { required: 'First name is required.' })}
                                />
                                {errors.firstName && (
                                    <p className="text-xs text-destructive">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="ss-lastName">Last name *</Label>
                                <Input
                                    id="ss-lastName"
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
                            <Label htmlFor="ss-phone">Phone *</Label>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{
                                    required: 'Phone is required.',
                                    validate: v => isValidPhone(v) || 'Enter a valid phone number.',
                                }}
                                render={({ field }) => (
                                    <PhoneInput
                                        id="ss-phone"
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
                            <Label htmlFor="ss-email">Email *</Label>
                            <Input
                                id="ss-email"
                                type="email"
                                placeholder="jane@example.com"
                                disabled={isPending}
                                {...register('email', {
                                    required: 'Email is required.',
                                    validate: v => EMAIL_RE.test(v.trim()) || 'Enter a valid email address.',
                                })}
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="ss-stage">Stage *</Label>
                            <Controller
                                name="stage"
                                control={control}
                                rules={{ required: 'Stage is required.' }}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={isPending || stagesLoading}
                                    >
                                        <SelectTrigger id="ss-stage">
                                            <SelectValue
                                                placeholder={
                                                    stagesLoading
                                                        ? 'Loading stages…'
                                                        : stagesError
                                                            ? 'Couldn’t load stages'
                                                            : 'Select a stage'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent
                                            position="popper"
                                            side="bottom"
                                            avoidCollisions={false}
                                        >
                                            {stages
                                                .filter(s => s.active)
                                                .map(({ id, name }) => (
                                                    <SelectItem key={id} value={name}>
                                                        {name}
                                                    </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {stagesError ? (
                                <p className="text-xs text-destructive">
                                    Couldn’t load stages. Close and reopen to try again.
                                </p>
                            ) : errors.stage && (
                                <p className="text-xs text-destructive">{errors.stage.message}</p>
                            )}
                        </div>
                    </div>

                    {submitError && (
                        <p className="text-xs text-destructive mt-2" role="alert">{submitError}</p>
                    )}

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
                            disabled={isPending || stagesLoading}
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

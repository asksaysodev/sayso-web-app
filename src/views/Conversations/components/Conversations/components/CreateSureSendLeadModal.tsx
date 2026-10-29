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
import { PhoneInput, formatPhoneInput, isValidPhone, toE164 } from '@/components/ui/PhoneInput';
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
import useCrmLead from '@/hooks/integrations/crm/useCrmLead';
import useCrmUpdateLead from '@/hooks/integrations/crm/useCrmUpdateLead';
import { CrmReauthRequiredError } from '@/hooks/integrations/crm/errors';
import type { CrmLead } from '@/hooks/integrations/crm/types';
import useSureSendStages from '../hooks/useSureSendStages';
import '../styles/CreateLeadModal.css';

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated?: (lead: CrmLead) => void;
    /** `edit` prefills from the linked lead (`leadId`) and saves via the CRM update endpoint (no stage). */
    mode?: 'create' | 'edit';
    leadId?: string | null;
    onUpdated?: (result: { leadId: string; crmLeadName: string }) => void;
}

interface FormValues {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    stage: string;
}

const DEFAULT_VALUES: FormValues = { firstName: '', lastName: '', phone: '', email: '', stage: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CreateSureSendLeadModal({ open, onClose, onCreated, mode = 'create', leadId = null, onUpdated }: Props) {
    const isEdit = mode === 'edit';
    const { showToast } = useToast();
    const { createLead, isPending } = useCrmCreateLead();
    const { updateLead, isPending: isUpdating } = useCrmUpdateLead('suresend', leadId);
    const { data: existingLead, isFetching: leadLoading, isError: leadError, refetch: refetchLead } =
        useCrmLead('suresend', leadId, open && isEdit);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const { stages, isLoading: stagesLoading, isError: stagesError } = useSureSendStages(open && !isEdit);
    const busy = isPending || isUpdating;

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues: DEFAULT_VALUES,
    });

    useEffect(() => {
        if (!isEdit || !existingLead) return;
        reset({
            firstName: existingLead.firstName ?? '',
            lastName: existingLead.lastName ?? '',
            phone: existingLead.phone ? formatPhoneInput(existingLead.phone) : '',
            email: existingLead.email ?? '',
            stage: '',
        });
    }, [isEdit, existingLead, reset]);

    const handleClose = () => {
        if (busy) return;
        reset(DEFAULT_VALUES);
        setSubmitError(null);
        onClose();
    };

    const onSubmit = async (values: FormValues) => {
        setSubmitError(null);
        if (isEdit) {
            try {
                const result = await updateLead({
                    firstName: values.firstName.trim(),
                    lastName: values.lastName.trim(),
                    phone: toE164(values.phone),
                    email: values.email.trim(),
                });
                showToast('success', 'Lead updated.');
                onUpdated?.({ leadId: result.lead.id, crmLeadName: result.crmLeadName });
                handleClose();
            } catch (error) {
                if (error instanceof CrmReauthRequiredError) {
                    setSubmitError('Your CRM connection expired. Reconnect it in Settings to edit leads.');
                    return;
                }
                Sentry.captureException(error);
                setSubmitError('Failed to update lead. Please try again.');
            }
            return;
        }
        try {
            const lead = await createLead({
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                phone: toE164(values.phone),
                email: values.email.trim(),
                stage: values.stage,
            });
            showToast('success', `${lead.name} added to your CRM.`);
            onCreated?.(lead);
            handleClose();
        } catch (error) {
            Sentry.captureException(error);
            setSubmitError('Failed to create lead. Please try again.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={isOpen => !isOpen && handleClose()}>
            <DialogContent className="create-lead-modal">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit lead' : 'Create Sure Send Lead'}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update this contact in Sure Send.'
                            : 'Add a new contact to Sure Send and link them to this conversation.'}
                    </DialogDescription>
                </DialogHeader>

                {isEdit && leadLoading ? (
                    <p className="create-lead-modal__status">Loading lead…</p>
                ) : isEdit && leadError ? (
                    <div className="create-lead-modal__status">
                        <p className="create-lead-modal__error" role="alert">Failed to load lead.</p>
                        <SaysoButton type="button" label="Retry" variant="outlined" size="sm" fullWidth={false} onClick={() => refetchLead()} />
                    </div>
                ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="create-lead-modal__fields">
                        <div className="create-lead-modal__name-row">
                            <div className="create-lead-modal__field">
                                <Label htmlFor="ss-firstName">First name *</Label>
                                <Input
                                    id="ss-firstName"
                                    placeholder="Jane"
                                    disabled={busy}
                                    {...register('firstName', { required: 'First name is required.' })}
                                />
                                {errors.firstName && (
                                    <p className="create-lead-modal__error">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div className="create-lead-modal__field">
                                <Label htmlFor="ss-lastName">Last name *</Label>
                                <Input
                                    id="ss-lastName"
                                    placeholder="Smith"
                                    disabled={busy}
                                    {...register('lastName', { required: 'Last name is required.' })}
                                />
                                {errors.lastName && (
                                    <p className="create-lead-modal__error">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="create-lead-modal__field">
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
                                        disabled={busy}
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        ref={field.ref}
                                    />
                                )}
                            />
                            {errors.phone && (
                                <p className="create-lead-modal__error">{errors.phone.message}</p>
                            )}
                        </div>

                        <div className="create-lead-modal__field">
                            <Label htmlFor="ss-email">Email *</Label>
                            <Input
                                id="ss-email"
                                type="email"
                                placeholder="jane@example.com"
                                disabled={busy}
                                {...register('email', {
                                    required: 'Email is required.',
                                    validate: v => EMAIL_RE.test(v.trim()) || 'Enter a valid email address.',
                                })}
                            />
                            {errors.email && (
                                <p className="create-lead-modal__error">{errors.email.message}</p>
                            )}
                        </div>

                        {!isEdit && (
                        <div className="create-lead-modal__field">
                            <Label htmlFor="ss-stage">Stage *</Label>
                            <Controller
                                name="stage"
                                control={control}
                                rules={{ required: 'Stage is required.' }}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={busy || (!isEdit && stagesLoading)}
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
                                            {stages.map(({ id, name }) => (
                                                <SelectItem key={id} value={name}>
                                                    {name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {stagesError ? (
                                <p className="create-lead-modal__error">
                                    Couldn’t load stages. Close and reopen to try again.
                                </p>
                            ) : errors.stage && (
                                <p className="create-lead-modal__error">{errors.stage.message}</p>
                            )}
                        </div>
                        )}
                    </div>

                    {submitError && (
                        <p className="create-lead-modal__error create-lead-modal__error--submit" role="alert">{submitError}</p>
                    )}

                    <DialogFooter className="create-lead-modal__footer">
                        <SaysoButton
                            type="button"
                            label="Cancel"
                            variant="outlined"
                            size="sm"
                            fullWidth={false}
                            onClick={handleClose}
                            disabled={busy}
                        />
                        <SaysoButton
                            type="submit"
                            label={isEdit ? (busy ? 'Saving…' : 'Save') : (isPending ? 'Creating…' : 'Create Lead')}
                            variant="sayso-indigo"
                            size="sm"
                            fullWidth={false}
                            loading={busy}
                            disabled={busy || (!isEdit && stagesLoading)}
                        />
                    </DialogFooter>
                </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

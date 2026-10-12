import { useState } from 'react';
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
import type { CrmLead } from '@/hooks/integrations/crm/types';
import useSureSendStages from '../hooks/useSureSendStages';
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
    stage: string;
}

const DEFAULT_VALUES: FormValues = { firstName: '', lastName: '', phone: '', email: '', stage: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CreateSureSendLeadModal({ open, onClose, onCreated }: Props) {
    const { showToast } = useToast();
    const { createLead, isPending } = useCrmCreateLead();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const { stages, isLoading: stagesLoading, isError: stagesError } = useSureSendStages(open);

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues: DEFAULT_VALUES,
    });

    const handleClose = () => {
        if (isPending) return;
        reset(DEFAULT_VALUES);
        setSubmitError(null);
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
            <DialogContent className="create-lead-modal">
                <DialogHeader>
                    <DialogTitle>Create Sure Send Lead</DialogTitle>
                    <DialogDescription>
                        Add a new contact to Sure Send and link them to this conversation.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="create-lead-modal__fields">
                        <div className="create-lead-modal__name-row">
                            <div className="create-lead-modal__field">
                                <Label htmlFor="ss-firstName">First name *</Label>
                                <Input
                                    id="ss-firstName"
                                    placeholder="Jane"
                                    disabled={isPending}
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
                                    disabled={isPending}
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
                                        disabled={isPending}
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
                                disabled={isPending}
                                {...register('email', {
                                    required: 'Email is required.',
                                    validate: v => EMAIL_RE.test(v.trim()) || 'Enter a valid email address.',
                                })}
                            />
                            {errors.email && (
                                <p className="create-lead-modal__error">{errors.email.message}</p>
                            )}
                        </div>

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

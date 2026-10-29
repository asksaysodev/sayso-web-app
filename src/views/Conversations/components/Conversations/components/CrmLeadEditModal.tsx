import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as Sentry from '@sentry/react';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Modal } from '@/components/ds/Modal';
import { TextField } from '@/components/ds/TextField';
import CrmProviderTile from '@/components/crm/CrmProviderTile';
import { formatPhoneInput, isValidPhone, toE164 } from '@/components/ui/PhoneInput';
import { useToast } from '@/context/ToastContext';
import useCrmLead from '@/hooks/integrations/crm/useCrmLead';
import useCrmUpdateLead from '@/hooks/integrations/crm/useCrmUpdateLead';
import { CrmReauthRequiredError } from '@/hooks/integrations/crm/errors';
import { getProvider } from '@/hooks/integrations/crm/providers/registry';
import type { CrmProviderId } from '@/hooks/integrations/crm/types';
import '../styles/CrmLeadEditModal.css';

interface Props {
    open: boolean;
    providerId: CrmProviderId;
    leadId: string | null;
    onClose: () => void;
    onUpdated?: (result: { leadId: string; crmLeadName: string }) => void;
}

interface FormValues {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}

const DEFAULT_VALUES: FormValues = { firstName: '', lastName: '', phone: '', email: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Edit-linked-lead modal shared by every CRM; texts, icon and email rule come from the provider registry. */
export default function CrmLeadEditModal({ open, providerId, leadId, onClose, onUpdated }: Props) {
    const { label, emailRequired } = getProvider(providerId);
    const { showToast } = useToast();
    const { updateLead, isPending } = useCrmUpdateLead(providerId, leadId);
    const { data: existingLead, isFetching: loading, isError: loadFailed, refetch } = useCrmLead(providerId, leadId, open);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
        defaultValues: DEFAULT_VALUES,
    });

    useEffect(() => {
        if (!existingLead) return;
        reset({
            firstName: existingLead.firstName ?? '',
            lastName: existingLead.lastName ?? '',
            phone: existingLead.phone ? formatPhoneInput(existingLead.phone) : '',
            email: existingLead.email ?? '',
        });
    }, [existingLead, reset]);

    const handleClose = () => {
        if (isPending) return;
        reset(DEFAULT_VALUES);
        setSubmitError(null);
        onClose();
    };

    const onSubmit = async (values: FormValues) => {
        setSubmitError(null);
        try {
            const result = await updateLead({
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                phone: toE164(values.phone),
                email: values.email.trim() || undefined,
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
    };

    const showLoading = loading;
    const showError = !loading && loadFailed;

    return (
        <Modal
            open={open}
            onOpenChange={isOpen => !isOpen && handleClose()}
            hideClose={showLoading || showError}
            aria-describedby={undefined}
            className={showLoading || showError ? 'crm-edit-modal crm-edit-modal--state' : 'crm-edit-modal'}
        >
            {showLoading && (
                <>
                    <DialogPrimitive.Title className="crm-edit__sr-only">Edit lead</DialogPrimitive.Title>
                    <StateArtwork providerId={providerId} tone="info" />
                    <div className="crm-edit__status">
                        <span className="crm-edit__spinner" aria-hidden="true" />
                        <p className="crm-edit__status-text" role="status">Loading lead from {label}…</p>
                    </div>
                </>
            )}

            {showError && (
                <>
                    <StateArtwork providerId={providerId} tone="error" />
                    <div className="crm-edit__copy" role="alert">
                        <DialogPrimitive.Title className="crm-edit__copy-title">Couldn't load this lead</DialogPrimitive.Title>
                        <p className="crm-edit__copy-text">{label} didn't respond. Try again.</p>
                    </div>
                    <div className="crm-edit__actions">
                        <Button variant="secondary" size="sm" className="crm-edit__outline" onClick={handleClose}>Cancel</Button>
                        <Button size="sm" leftIcon={<RotateCw size={15} />} onClick={() => refetch()}>Retry</Button>
                    </div>
                </>
            )}

            {!showLoading && !showError && (
                <form className="crm-edit__form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="crm-edit__header">
                        <CrmProviderTile providerId={providerId} />
                        <div className="crm-edit__titles">
                            <DialogPrimitive.Title className="crm-edit__title">Edit lead</DialogPrimitive.Title>
                            <p className="crm-edit__subtitle">Changes sync to {label}</p>
                        </div>
                    </div>

                    <div className="crm-edit__fields">
                        <div className="crm-edit__name-row">
                            <TextField
                                label="First name"
                                disabled={isPending}
                                error={errors.firstName?.message}
                                {...register('firstName', { required: 'First name is required.' })}
                            />
                            <TextField
                                label="Last name"
                                disabled={isPending}
                                error={errors.lastName?.message}
                                {...register('lastName', { required: 'Last name is required.' })}
                            />
                        </div>

                        <Controller
                            name="phone"
                            control={control}
                            rules={{
                                required: 'Phone is required.',
                                validate: v => isValidPhone(v) || 'Enter a valid phone number.',
                            }}
                            render={({ field }) => (
                                <TextField
                                    label="Phone"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    disabled={isPending}
                                    error={errors.phone?.message}
                                    value={field.value}
                                    onChange={e => field.onChange(formatPhoneInput(e.target.value))}
                                    onFocus={() => { if (!field.value) field.onChange('+1'); }}
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                />
                            )}
                        />

                        <TextField
                            label={
                                <span className="crm-edit__label-row">
                                    <span>Email</span>
                                    {!emailRequired && <span className="crm-edit__optional">Optional</span>}
                                </span>
                            }
                            type="email"
                            disabled={isPending}
                            error={errors.email?.message}
                            {...register('email', {
                                required: emailRequired ? 'Email is required.' : false,
                                validate: v => !v.trim() || EMAIL_RE.test(v.trim()) || 'Enter a valid email address.',
                            })}
                        />
                    </div>

                    {submitError && <p className="crm-edit__submit-error" role="alert">{submitError}</p>}

                    <div className="crm-edit__footer">
                        <Button type="button" variant="secondary" size="sm" className="crm-edit__cancel" onClick={handleClose} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" loading={isPending}>Save changes</Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}

function StateArtwork({ providerId, tone }: { providerId: CrmProviderId; tone: 'info' | 'error' }) {
    return (
        <div className={`crm-edit__halo crm-edit__halo--${tone}`}>
            <div className={`crm-edit__ring crm-edit__ring--${tone}`}>
                <CrmProviderTile providerId={providerId} size="lg" />
            </div>
        </div>
    );
}

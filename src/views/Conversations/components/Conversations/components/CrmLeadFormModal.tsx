import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as Sentry from '@sentry/react';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Modal } from '@/components/ds/Modal';
import { TextField } from '@/components/ds/TextField';
import { SelectField } from '@/components/ds/SelectField';
import CrmProviderTile from '@/components/crm/CrmProviderTile';
import { formatPhoneInput, isValidPhone, toE164 } from '@/components/ui/PhoneInput';
import { useToast } from '@/context/ToastContext';
import useCrmLead from '@/hooks/integrations/crm/useCrmLead';
import useCrmCreateLead from '@/hooks/integrations/crm/useCrmCreateLead';
import useCrmUpdateLead from '@/hooks/integrations/crm/useCrmUpdateLead';
import { CrmReauthRequiredError } from '@/hooks/integrations/crm/errors';
import { getProvider } from '@/hooks/integrations/crm/providers/registry';
import type { CrmLead, CrmProviderId } from '@/hooks/integrations/crm/types';
import useSureSendStages from '../hooks/useSureSendStages';
import '../styles/CrmLeadFormModal.css';

interface Props {
    mode: 'create' | 'edit';
    open: boolean;
    providerId: CrmProviderId;
    /** Edit mode only: CRM id of the lead being edited. */
    leadId?: string | null;
    onClose: () => void;
    /** Create mode only. */
    onCreated?: (lead: CrmLead) => void;
    /** Edit mode only. */
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

/** Create / edit lead modal shared by every CRM; texts, icon and email rule come from the provider registry. */
export default function CrmLeadFormModal({ mode, open, providerId, leadId = null, onClose, onCreated, onUpdated }: Props) {
    const isEdit = mode === 'edit';
    const needsStage = !isEdit && providerId === 'suresend';
    const { label, emailRequired } = getProvider(providerId);
    const { showToast } = useToast();
    const { updateLead, isPending: isUpdating } = useCrmUpdateLead(providerId, leadId);
    const { createLead, isPending: isCreating } = useCrmCreateLead();
    const isPending = isEdit ? isUpdating : isCreating;
    const { data: existingLead, isFetching: fetching, isError: fetchFailed, refetch } = useCrmLead(providerId, isEdit ? leadId : null, open && isEdit);
    const loading = isEdit && fetching;
    const loadFailed = isEdit && fetchFailed;
    const { stages, isLoading: stagesLoading, isError: stagesError } = useSureSendStages(open && needsStage);
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
            if (!isEdit) {
                const lead = await createLead({
                    firstName: values.firstName.trim(),
                    lastName: values.lastName.trim(),
                    phone: toE164(values.phone),
                    email: values.email.trim() || undefined,
                    ...(needsStage ? { stage: values.stage } : {}),
                });
                showToast('success', `${lead.name} added to your CRM.`);
                onCreated?.(lead);
                handleClose();
                return;
            }
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
                setSubmitError(`Your CRM connection expired. Reconnect it in Settings to ${isEdit ? 'edit' : 'create'} leads.`);
                return;
            }
            Sentry.captureException(error);
            setSubmitError(`Failed to ${isEdit ? 'update' : 'create'} lead. Please try again.`);
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
            className={showLoading || showError ? 'crm-lead-modal crm-lead-modal--state' : 'crm-lead-modal'}
        >
            {showLoading && (
                <>
                    <DialogPrimitive.Title className="crm-lead__sr-only">Edit lead</DialogPrimitive.Title>
                    <StateArtwork providerId={providerId} tone="info" />
                    <div className="crm-lead__status">
                        <span className="crm-lead__spinner" aria-hidden="true" />
                        <p className="crm-lead__status-text" role="status">Loading lead from {label}…</p>
                    </div>
                </>
            )}

            {showError && (
                <>
                    <StateArtwork providerId={providerId} tone="error" />
                    <div className="crm-lead__copy" role="alert">
                        <DialogPrimitive.Title className="crm-lead__copy-title">Couldn't load this lead</DialogPrimitive.Title>
                        <p className="crm-lead__copy-text">{label} didn't respond. Try again.</p>
                    </div>
                    <div className="crm-lead__actions">
                        <Button variant="secondary" size="sm" className="crm-lead__outline" onClick={handleClose}>Cancel</Button>
                        <Button size="sm" leftIcon={<RotateCw size={15} />} onClick={() => refetch()}>Retry</Button>
                    </div>
                </>
            )}

            {!showLoading && !showError && (
                <form className="crm-lead__form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="crm-lead__header">
                        <CrmProviderTile providerId={providerId} />
                        <div className="crm-lead__titles">
                            <DialogPrimitive.Title className="crm-lead__title">{isEdit ? 'Edit lead' : 'Create lead'}</DialogPrimitive.Title>
                            <p className="crm-lead__subtitle">{isEdit ? `Changes sync to ${label}` : `Creates the lead in ${label}`}</p>
                        </div>
                    </div>

                    <div className="crm-lead__fields">
                        <div className="crm-lead__name-row">
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
                                <span className="crm-lead__label-row">
                                    <span>Email</span>
                                    {!emailRequired && <span className="crm-lead__optional">Optional</span>}
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

                        {needsStage && (
                            <Controller
                                name="stage"
                                control={control}
                                rules={{ required: 'Stage is required.' }}
                                render={({ field }) => (
                                    <SelectField
                                        label="Stage"
                                        value={field.value || undefined}
                                        onChange={field.onChange}
                                        options={stages.map(({ name }) => ({ value: name, label: name }))}
                                        placeholder={stagesLoading ? 'Loading stages…' : stagesError ? 'Couldn’t load stages' : 'Select a stage'}
                                        disabled={isPending || stagesLoading || stagesError}
                                        error={stagesError ? 'Couldn’t load stages. Close and reopen to try again.' : errors.stage?.message}
                                    />
                                )}
                            />
                        )}
                    </div>

                    {submitError && <p className="crm-lead__submit-error" role="alert">{submitError}</p>}

                    <div className="crm-lead__footer">
                        <Button type="button" variant="secondary" size="sm" className="crm-lead__cancel" onClick={handleClose} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" loading={isPending} disabled={needsStage && stagesLoading}>{isEdit ? 'Save changes' : 'Create lead'}</Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}

function StateArtwork({ providerId, tone }: { providerId: CrmProviderId; tone: 'info' | 'error' }) {
    return (
        <div className={`crm-lead__halo crm-lead__halo--${tone}`}>
            <div className={`crm-lead__ring crm-lead__ring--${tone}`}>
                <CrmProviderTile providerId={providerId} size="lg" />
            </div>
        </div>
    );
}

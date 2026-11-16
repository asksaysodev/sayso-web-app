import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Sentry from '@sentry/react';
import { Account, UpdateAccountData } from '@/types/user';
import { Button } from '@/components/ds/Button';
import { Card } from '@/components/ds/Card';
import { TextField } from '@/components/ds/TextField';
import { formatPhoneInput, isValidPhone, toE164 } from '@/components/ui/PhoneInput';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useAccounts } from '@/hooks/useAccounts';
import SettingsFormCardHeading from './SettingsFormCardHeading';

interface Props {
    globalUser: Account | null;
}

interface FormValues {
    name: string;
    lastname: string;
    phone: string;
}

const toFormValues = (user: Account | null): FormValues => ({
    name: user?.name ?? '',
    lastname: user?.lastname ?? '',
    phone: user?.phone ? formatPhoneInput(user.phone) : '',
});

/** Profile card (Figma 1090:3877): edit name, last name and phone, saved together with "Save changes". */
export default function SettingsPersonalForm({ globalUser }: Props) {
    const { showToast } = useToast();
    const { updateAccount } = useAccounts();
    const { updateGlobalUser } = useAuth();

    const { register, control, handleSubmit, reset, formState: { errors, isDirty, dirtyFields, isSubmitting } } = useForm<FormValues>({
        defaultValues: toFormValues(globalUser),
    });

    useEffect(() => {
        reset(toFormValues(globalUser));
    }, [globalUser, reset]);

    const onSubmit = async (values: FormValues) => {
        const updateData: UpdateAccountData = {};
        if (dirtyFields.name) updateData.name = values.name.trim();
        if (dirtyFields.lastname) updateData.lastname = values.lastname.trim();
        if (dirtyFields.phone) updateData.phone = values.phone ? toE164(values.phone) : null;

        try {
            await updateAccount(updateData);
        } catch (error) {
            Sentry.captureException(error);
            showToast('error', 'Failed to update account. Please try again.');
            return;
        }
        showToast('success', 'Account updated successfully!');
        if (globalUser?.email) await updateGlobalUser(globalUser.email);
    };

    return (
        <Card className='settings-form-card'>
            <SettingsFormCardHeading title='Profile' description='Fill in general info about yourself.' />
            <form className='settings-form-card__form' onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className='settings-personal-form'>
                    <TextField
                        label='Name'
                        labelPlacement='outside'
                        autoComplete='given-name'
                        error={errors.name?.message}
                        {...register('name', { validate: (value) => value.trim() !== '' || 'Name is required' })}
                    />
                    <TextField
                        label='Last Name'
                        labelPlacement='outside'
                        autoComplete='family-name'
                        error={errors.lastname?.message}
                        {...register('lastname', { validate: (value) => value.trim() !== '' || 'Last name is required' })}
                    />
                    <TextField label='Email' labelPlacement='outside' value={globalUser?.email ?? ''} readOnly />
                    <Controller
                        name='phone'
                        control={control}
                        rules={{ validate: (value) => value === '' || isValidPhone(value) || 'Please enter a valid phone number' }}
                        render={({ field }) => (
                            <TextField
                                label='Phone'
                                labelPlacement='outside'
                                type='tel'
                                autoComplete='tel'
                                placeholder='Add phone number'
                                error={errors.phone?.message}
                                name={field.name}
                                ref={field.ref}
                                value={field.value}
                                onBlur={field.onBlur}
                                onChange={(event) => field.onChange(formatPhoneInput(event.target.value))}
                            />
                        )}
                    />
                </div>
                <div className='settings-form-card__actions'>
                    <Button type='submit' disabled={!isDirty} loading={isSubmitting}>Save changes</Button>
                </div>
            </form>
        </Card>
    );
}

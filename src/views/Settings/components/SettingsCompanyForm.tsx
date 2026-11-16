import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ds/Button';
import { Card } from '@/components/ds/Card';
import { TextField } from '@/components/ds/TextField';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import useCompany from '@/views/Organization/Company/hooks/useCompany';
import useRenameCompany from '@/views/Organization/Company/hooks/useRenameCompany';
import { COMPANY_NAME_MAX_LENGTH } from '@/views/Organization/Company/constants';
import SettingsFormCardHeading from './SettingsFormCardHeading';

interface FormValues {
    companyName: string;
}

const validateName = (value: string) => {
    const name = value.trim();
    if (name === '') return 'Company name is required';
    if (name.length > COMPANY_NAME_MAX_LENGTH) return `Company name must be ${COMPANY_NAME_MAX_LENGTH} characters or fewer`;
    return true;
};

/** Company card, same layout as the Profile card: rename the company with "Save changes". */
export default function SettingsCompanyForm() {
    const { company, isLoading, isError } = useCompany();
    const { renameCompany } = useRenameCompany();

    const { register, handleSubmit, reset, setError, formState: { errors, isDirty, isSubmitting } } = useForm<FormValues>({
        defaultValues: { companyName: company?.company_name ?? '' },
    });

    useEffect(() => {
        reset({ companyName: company?.company_name ?? '' });
    }, [company?.company_name, reset]);

    // Without the saved name the field would show blank, and saving would overwrite a name the user never saw.
    const loadFailed = company === null && isError;

    // useRenameCompany reports the failure to Sentry; the message shows under the field.
    const onSubmit = async ({ companyName }: FormValues) => {
        try {
            await renameCompany(companyName.trim());
        } catch (error) {
            setError('companyName', { message: getApiErrorMessage(error, 'Failed to rename company. Please try again.') });
        }
    };

    return (
        <Card className='settings-form-card'>
            <SettingsFormCardHeading title='Company' description='Manage your company details.' />
            <form className='settings-form-card__form' onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className='settings-company-form'>
                    <TextField
                        label='Company name'
                        labelPlacement='outside'
                        maxLength={COMPANY_NAME_MAX_LENGTH}
                        readOnly={isLoading}
                        disabled={loadFailed}
                        error={errors.companyName?.message}
                        helperText={loadFailed ? "Couldn't load the company name. Refresh to try again." : undefined}
                        {...register('companyName', { validate: validateName })}
                    />
                </div>
                <div className='settings-form-card__actions'>
                    <Button type='submit' disabled={!isDirty || loadFailed} loading={isSubmitting}>Save changes</Button>
                </div>
            </form>
        </Card>
    );
}

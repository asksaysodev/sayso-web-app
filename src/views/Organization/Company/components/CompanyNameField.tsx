import { InlineEditField } from '@/components/ds/InlineEditField';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import useCompany from '../hooks/useCompany';
import useRenameCompany from '../hooks/useRenameCompany';
import { COMPANY_NAME_MAX_LENGTH } from '../constants';
import './CompanyNameField.css';

const validateName = (name: string) => {
    if (name === '') return 'Organization name is required';
    if (name.length > COMPANY_NAME_MAX_LENGTH) {
        return `Organization name must be ${COMPANY_NAME_MAX_LENGTH} characters or fewer`;
    }
    return null;
};

export default function CompanyNameField() {
    const { company, isLoading, isError } = useCompany();
    const { renameCompany } = useRenameCompany();

    // Without the saved name the field would show blank, and saving would overwrite a name the user never saw.
    const loadFailed = company === null && isError;

    const save = async (name: string) => {
        try {
            await renameCompany(name);
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Failed to rename organization. Please try again.'));
        }
    };

    return (
        <InlineEditField
            className='company-name-field'
            label='Organization name'
            value={company?.company_name ?? ''}
            onSave={save}
            validate={validateName}
            readOnly={isLoading}
            disabled={loadFailed}
            helperText={loadFailed ? "Couldn't load the organization name. Refresh to try again." : undefined}
            maxLength={COMPANY_NAME_MAX_LENGTH}
        />
    );
}

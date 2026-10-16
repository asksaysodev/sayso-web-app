import { Account } from '@/types/user';
import { InlineEditField } from '@/components/ds/InlineEditField';
import { formatPhoneInput, isValidPhone, toE164 } from '@/components/ui/PhoneInput';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useAccounts } from '@/hooks/useAccounts';

type EditableField = 'name' | 'lastname' | 'phone';

// Fields save themselves on blur/Enter/Save, so there is no "unsaved changes" state to guard.
interface Props {
    globalUser: Account | null;
}

const required = (label: string) => (value: string) => (value === '' ? `${label} is required` : null);

const validatePhone = (value: string) => (value === '' || isValidPhone(value) ? null : 'Please enter a valid phone number');

export default function SettingsPersonalForm({ globalUser }: Props) {
    const { showToast } = useToast();
    const { updateAccount } = useAccounts();
    const { updateGlobalUser } = useAuth();

    const save = (field: EditableField) => async (value: string) => {
        const fieldValue = field === 'phone' ? (value ? toE164(value) : null) : value;
        try {
            await updateAccount({ [field]: fieldValue } as Record<string, string | null>);
        } catch {
            throw new Error('Failed to update account. Please try again.');
        }
        showToast('success', 'Account updated successfully!');
        if (globalUser?.email) await updateGlobalUser(globalUser.email);
    };

    return (
        <form className='settings-personal-form' onSubmit={(event) => event.preventDefault()}>
            <InlineEditField
                label='Name'
                name='name'
                value={globalUser?.name ?? ''}
                onSave={save('name')}
                validate={required('Name')}
            />
            <InlineEditField
                label='Last name'
                name='lastname'
                value={globalUser?.lastname ?? ''}
                onSave={save('lastname')}
                validate={required('Last name')}
            />
            <InlineEditField label='Email' name='email' value={globalUser?.email ?? ''} editable={false} onSave={async () => {}} />
            <InlineEditField
                label='Phone'
                name='phone'
                type='tel'
                value={globalUser?.phone ?? ''}
                format={formatPhoneInput}
                onSave={save('phone')}
                validate={validatePhone}
            />
        </form>
    );
}

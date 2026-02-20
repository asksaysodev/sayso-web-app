import { Account } from "@/types/user";
import FormLineAccount from "../../../components/FormLineAccount";

interface Props {
    setUnsavedChanges: (unsavedChanges: boolean) => void;
    globalUser: Account | null;
}

export default function AccountSettingsPersonalForm({ setUnsavedChanges, globalUser }: Props) {
    return (
        <div className='account-settings-personal-container'>
            <form className='account-settings-personal-form'>
                <FormLineAccount
                    label='Name'
                    name='name'
                    placeholder='Name'
                    value={globalUser?.name || ''}
                    editable={true}
                    setUnsavedChanges={setUnsavedChanges}
                />
                <FormLineAccount
                    label='Last Name'
                    name='lastname'
                    placeholder='Last Name'
                    value={globalUser?.lastname || ''}
                    editable={true}
                    setUnsavedChanges={setUnsavedChanges}
                />
                <FormLineAccount
                    label='Email'
                    name='email'
                    placeholder='Email'
                    value={globalUser?.email || ''}
                    editable={false}
                    setUnsavedChanges={setUnsavedChanges}
                />
            </form>
        </div>
    )
}
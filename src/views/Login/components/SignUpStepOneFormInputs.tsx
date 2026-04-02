import LoginBtn from '@/components/LoginBtn';
import ControlledInputField from '@/components/forms/ControlledInputField';
import { Control } from 'react-hook-form';
import { LoginFormData } from '../types';

interface Props {
    control: Control<LoginFormData>;
}

export default function SignUpStepOneFormInputs({ control }: Props) {
    return (
        <div className='login-layout-form-inputs-wrapper'>
            <ControlledInputField
                control={control}
                name="name"
                label="First Name"
                labelCn='loginInFormInputLabel'
            />
            <ControlledInputField
                control={control}
                name="lastname"
                label="Last Name"
                labelCn='loginInFormInputLabel'
            />
            <ControlledInputField
                control={control}
                name="company"
                label="Broker/Team"
                labelCn='loginInFormInputLabel'
            />
            <div className="formActions">
                <LoginBtn type="submit" text="Continue" />
            </div>
        </div>
    )
}
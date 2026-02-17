import CustomInput from '@/components/CustomInput';
import LoginBtn from '@/components/LoginBtn';
import PasswordInput from './PasswordInput';
import ControlledInputField from '@/components/forms/ControlledInputField';
import { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import EyeToggleShowPasswordButton from './EyeToggleShowPasswordButton';
import { LoginFormData } from '../types';
import { Control } from 'react-hook-form';

interface Props {
    control: Control<LoginFormData>;
    isBtnLoading: boolean;
}

export default function LoginInFormInputs({ control, isBtnLoading }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className='login-layout-form-inputs-wrapper'>
            <ControlledInputField
                control={control}
                name='email'
                label='Email'
                labelCn='loginInFormInputLabel'
            />
            <ControlledInputField
                type={showPassword ? 'text' : 'password'}
                control={control}
                name='password'
                label='Password'
                labelCn='loginInFormInputLabel'
                rightChildren={<EyeToggleShowPasswordButton
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    />
                }
            />
            <div className="formActions">
                <LoginBtn type="submit" text="Sign In" isLoading={isBtnLoading} isDisabled={isBtnLoading} />
            </div>
        </div>
    )
}

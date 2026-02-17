import LoginBtn from '@/components/LoginBtn';
import ControlledInputField from '@/components/forms/ControlledInputField';
import EyeToggleShowPasswordButton from './EyeToggleShowPasswordButton';
import { useState } from 'react';
import { LoginFormData } from '../types';
import { Control } from 'react-hook-form';

interface Props {
    control: Control<LoginFormData>;
    isBtnLoading: boolean;
    setSignupStep: (step: number) => void;
}

export default function SignUpStepTwoFormInputs({ control, isBtnLoading, setSignupStep }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    return (
        <div className='login-layout-form-inputs-wrapper'>
            <ControlledInputField
                type="email"
                control={control}
                name="email"
                label="Email"
                labelCn='loginInFormInputLabel'
            />
            <ControlledInputField
                type={showPassword ? 'text' : 'password'}
                control={control}
                name="password"
                label="Password"
                labelCn='loginInFormInputLabel'
                rightChildren={<EyeToggleShowPasswordButton
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                />}
            />
            <ControlledInputField
                type={showRepeatPassword ? 'text' : 'password'}
                control={control}
                name="repeatPassword"
                label="Repeat Password"
                labelCn='loginInFormInputLabel'
                rightChildren={<EyeToggleShowPasswordButton
                    showPassword={showRepeatPassword}
                    setShowPassword={setShowRepeatPassword}
                />}
            />
            <div className="formActions">
                <LoginBtn type="submit" text="Sign Up" isLoading={isBtnLoading} isDisabled={isBtnLoading} />
                <LoginBtn type="button" text="Back" onClick={() => setSignupStep(1)} isSecondary={true} />
            </div>
        </div>
    )
}

import { useState, type FormEventHandler } from 'react';
import { Controller, useWatch, type Control } from 'react-hook-form';
import { ArrowRight, CircleAlert } from 'lucide-react';

import { Button } from '@/components/ds/Button';
import { TextField } from '@/components/ds/TextField';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import EyeToggle from './EyeToggle';
import type { SignupFormData } from '../types';

interface Props {
    control: Control<SignupFormData>;
    isBtnLoading: boolean;
    disableEmail: boolean;
    onBack: () => void;
    onSubmit: FormEventHandler<HTMLFormElement>;
}

const errorIcon = <CircleAlert size={24} color="var(--error-icon)" aria-hidden="true" />;

export default function LoginDetailsForm({ control, isBtnLoading, disableEmail, onBack, onSubmit }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [email, password, repeatPassword] = useWatch({ control, name: ['email', 'password', 'repeatPassword'] });

    return (
        <form onSubmit={onSubmit} noValidate className="signupCardForm">
            <div className="signupCardFields">
                <Controller
                    control={control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            type="email"
                            autoComplete="email"
                            label="Email"
                            disabled={disableEmail || isBtnLoading}
                            error={fieldState.error?.message}
                            trailingIcon={fieldState.error ? errorIcon : undefined}
                        />
                    )}
                />
                <div className="signupCardPasswordGroup">
                    <Controller
                        control={control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                label="Password"
                                disabled={isBtnLoading}
                                error={fieldState.error?.message}
                                trailingIcon={
                                    fieldState.error ? (
                                        errorIcon
                                    ) : (
                                        <EyeToggle
                                            shown={showPassword}
                                            disabled={isBtnLoading}
                                            label="password"
                                            onToggle={() => setShowPassword(prev => !prev)}
                                        />
                                    )
                                }
                            />
                        )}
                    />
                    <PasswordStrength password={password ?? ''} />
                </div>
                <Controller
                    control={control}
                    name="repeatPassword"
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            type={showRepeatPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            label="Confirm password"
                            disabled={isBtnLoading}
                            error={fieldState.error?.message}
                            trailingIcon={
                                fieldState.error ? (
                                    errorIcon
                                ) : (
                                    <EyeToggle
                                        shown={showRepeatPassword}
                                        disabled={isBtnLoading}
                                        label="confirm password"
                                        onToggle={() => setShowRepeatPassword(prev => !prev)}
                                    />
                                )
                            }
                        />
                    )}
                />
            </div>

            <div className="signupCardFooter">
                <Button
                    type="button"
                    variant="secondary"
                    className="signupCardBack"
                    onClick={onBack}
                    disabled={isBtnLoading}
                >
                    Back
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    className="signupCardSubmit"
                    loading={isBtnLoading}
                    disabled={!email || !password || !repeatPassword}
                >
                    Continue
                    {!isBtnLoading && <ArrowRight size={20} aria-hidden="true" />}
                </Button>
            </div>
        </form>
    );
}

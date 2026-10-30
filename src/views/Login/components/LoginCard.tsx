import { useState, type FormEventHandler } from 'react';
import { Link } from 'react-router-dom';
import { Controller, useWatch, type Control } from 'react-hook-form';
import { ArrowRight, CircleAlert, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ds/Button';
import { TextField } from '@/components/ds/TextField';
import { LoginFormData } from '../types';
import './LoginCard.css';

interface Props {
    control: Control<LoginFormData>;
    isBtnLoading: boolean;
    onSubmit: FormEventHandler<HTMLFormElement>;
}

export default function LoginCard({ control, isBtnLoading, onSubmit }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, password] = useWatch({ control, name: ['email', 'password'] });

    return (
        <form className="loginCard" onSubmit={onSubmit} noValidate>
            <h2 className="loginCardHeading">Account details</h2>

            <div className="loginCardFields">
                <Controller
                    control={control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            type="email"
                            autoComplete="email"
                            label="Email"
                            disabled={isBtnLoading}
                            error={fieldState.error?.message}
                            trailingIcon={
                                fieldState.error ? (
                                    <CircleAlert size={24} color="var(--error-icon)" aria-hidden="true" />
                                ) : undefined
                            }
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            label="Password"
                            disabled={isBtnLoading}
                            error={fieldState.error?.message}
                            trailingIcon={
                                fieldState.error ? (
                                    <CircleAlert size={24} color="var(--error-icon)" aria-hidden="true" />
                                ) : (
                                    <button
                                        type="button"
                                        className="loginCardEyeToggle"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        disabled={isBtnLoading}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        aria-pressed={showPassword}
                                    >
                                        {showPassword ? (
                                            <EyeOff size={24} color="var(--text-secondary)" aria-hidden="true" />
                                        ) : (
                                            <Eye size={24} color="var(--text-secondary)" aria-hidden="true" />
                                        )}
                                    </button>
                                )
                            }
                        />
                    )}
                />
            </div>

            <div className="loginCardFooter">
                <Link to="/forgot-password" className="loginCardForgotLink">
                    Forgot password?
                </Link>
                <Button
                    type="submit"
                    variant="primary"
                    className="loginCardSubmit"
                    loading={isBtnLoading}
                    disabled={!email || !password}
                >
                    {isBtnLoading ? 'Signing in…' : 'Sign in'}
                    {!isBtnLoading && <ArrowRight size={20} aria-hidden="true" />}
                </Button>
            </div>
        </form>
    );
}

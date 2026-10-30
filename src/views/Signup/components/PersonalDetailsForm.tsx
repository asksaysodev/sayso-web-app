import type { FormEventHandler } from 'react';
import { Controller, useWatch, type Control } from 'react-hook-form';
import { ArrowRight, CircleAlert } from 'lucide-react';

import { Button } from '@/components/ds/Button';
import { TextField } from '@/components/ds/TextField';
import { FieldMessage, FieldShell } from '@/components/ds/FieldShell';
import { PhoneInput } from '@/components/ui/PhoneInput';
import type { SignupFormData } from '../types';

interface Props {
    control: Control<SignupFormData>;
    onSubmit: FormEventHandler<HTMLFormElement>;
}

const errorIcon = <CircleAlert size={24} color="var(--error-icon)" aria-hidden="true" />;

export default function PersonalDetailsForm({ control, onSubmit }: Props) {
    const [name, lastname, company] = useWatch({ control, name: ['name', 'lastname', 'company'] });

    return (
        <form onSubmit={onSubmit} noValidate className="signupCardForm">
            <div className="signupCardFields">
                <div className="signupCardRow">
                    <Controller
                        control={control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                autoComplete="given-name"
                                label="First name"
                                error={fieldState.error?.message}
                                trailingIcon={fieldState.error ? errorIcon : undefined}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="lastname"
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                autoComplete="family-name"
                                label="Last name"
                                error={fieldState.error?.message}
                                trailingIcon={fieldState.error ? errorIcon : undefined}
                            />
                        )}
                    />
                </div>
                <Controller
                    control={control}
                    name="company"
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            autoComplete="organization"
                            label="Brokerage or team name"
                            error={fieldState.error?.message}
                            trailingIcon={fieldState.error ? errorIcon : undefined}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="phone"
                    render={({ field, fieldState }) => (
                        <div className="ds-field-group">
                            <FieldShell
                                label="Phone number (optional)"
                                htmlFor="signup-phone"
                                invalid={!!fieldState.error}
                                trailingIcon={fieldState.error ? errorIcon : undefined}
                            >
                                <PhoneInput
                                    id="signup-phone"
                                    ref={field.ref}
                                    name={field.name}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    aria-invalid={fieldState.error ? true : undefined}
                                    className="ds-field__input signupCardPhoneInput"
                                />
                            </FieldShell>
                            <FieldMessage error={fieldState.error?.message} />
                        </div>
                    )}
                />
            </div>

            <div className="signupCardFooter signupCardFooter--end">
                <Button
                    type="submit"
                    variant="primary"
                    className="signupCardSubmit"
                    disabled={!name?.trim() || !lastname?.trim() || !company?.trim()}
                >
                    Continue
                    <ArrowRight size={20} aria-hidden="true" />
                </Button>
            </div>
        </form>
    );
}

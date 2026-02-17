import { useState } from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import './PasswordInput.css';

interface Props {
    id: string;
    name: string;
    label: string;
    control: Control<FieldValues>;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    error: string;
    className?: string;
}

export default function PasswordInput({
  id,
  name,
  label,
  control,
  value,
  onChange,
  onBlur,
  error,
  className = '',
  ...rest
}: Props) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    if (control) {
        return (
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error: fieldError } }) => (
                    <div className="customInputFormGroup">
                        <label htmlFor={id}>{label}</label>
                        <div className="passwordInputWrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id={id}
                                name={name}
                                className={`formInput ${fieldError ? 'error' : ''} ${className}`}
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                {...rest}
                            />
                            <button
                                type="button"
                                className="passwordToggleButton"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                            </button>
                        </div>
                        {fieldError && <div className="fieldError">{fieldError.message}</div>}
                    </div>
                )}
            />
        );
    }

    return (
        <div className="customInputFormGroup">
        <label htmlFor={id}>{label}</label>
        <div className="passwordInputWrapper">
            <input
            type={showPassword ? 'text' : 'password'}
            id={id}
            name={name}
            className={`formInput ${error ? 'error' : ''} ${className}`}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            {...rest}
            />
            <button
            type="button"
            className="passwordToggleButton"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
            {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
            </button>
        </div>
        {error && <div className="fieldError">{error}</div>}
        </div>
    );
}

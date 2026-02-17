import React, { DetailedHTMLProps, HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import './styles.css';

/**
 * Reusable form input component with label and error handling.
 * Supports both React Hook Form (with control prop) and standalone usage.
 *
 * @param {string} type - Input type (text, email, password, etc.)
 * @param {string} id - Input ID for label association
 * @param {string} name - Input name attribute
 * @param {string} label - Label text to display above input
 * @param {object} control - React Hook Form control object (optional)
 * @param {string} value - Controlled input value (for standalone use)
 * @param {function} onChange - Change handler function (for standalone use)
 * @param {string} error - Error message to display (if any)
 * @param {string} className - Additional CSS classes for the input
 * @param {object} rest - Any additional props to pass to the input element
 */

interface Props {
  type?: HTMLInputTypeAttribute;
  id: string;
  name: string;
  label: string;
  control?: Control<FieldValues, any>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  rest?: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    [key: string]: unknown;
  };
}

const CustomInput = ({
  type = 'text',
  id,
  name,
  label,
  control,
  value,
  onChange,
  error,
  className = '',
  ...rest
}: Props) => {

  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error: fieldError } }) => (
          <div className="customInputFormGroup">
            <label htmlFor={id}>{label}</label>
            <input
              type={type}
              id={id}
              name={name}
              className={`formInput ${fieldError ? 'error' : ''} ${className}`}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              {...rest}
            />
            {fieldError && <div className="fieldError">{fieldError.message}</div>}
          </div>
        )}
      />
    );
  }

  return (
    <div className="customInputFormGroup">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        className={`formInput ${error ? 'error' : ''} ${className}`}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {error && <div className="fieldError">{error}</div>}
    </div>
  );
};

export default CustomInput;

import { RegisterOptions, UseFormReturn } from "react-hook-form";
import ControlledCustomFormField from "./ControlledCustomFormField";
import { DetailedHTMLProps, HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

import './styles/controlledInputField.css'

interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    name: string;
    control: UseFormReturn<any>['control'];
    rules?: RegisterOptions;
    label?: string;
    labelCn?: string;
    labelColor?: string;
    labelRequired?: boolean;
    placeholder?: string;
    type?: HTMLInputTypeAttribute;
    step?: string | number;
    className?: HTMLInputElement['className'];
    rightChildren?: React.ReactNode;
}

export default function ControlledInputField({
    name,
    control,
    rules,
    label,
    labelCn,
    labelColor,
    labelRequired,
    placeholder,
    type = 'text',
    step,
    className = '',
    rightChildren,
    ...rest
}: Props) {
    const isNumberInput = type === 'number';

    return (
        <ControlledCustomFormField name={name} control={control} rules={rules} label={label} labelCn={labelCn} labelColor={labelColor} required={labelRequired}>
            {({ field, fieldState: {error: fieldError} }) => (
                <div className="controlledInputFieldGroup">
                    {rightChildren ? (
                        <div className="inputWrapper">
                            <input
                                step={step ? step : undefined}
                                type={type}
                                name={name}
                                placeholder={placeholder}
                                className={`formInput ${fieldError ? 'error' : ''} ${className}`}
                                value={field.value}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (isNumberInput && rules?.valueAsNumber) {
                                        field.onChange(value === '' ? '' : Number(value));
                                    } else {
                                        field.onChange(value);
                                    }
                                }}
                                onBlur={field.onBlur}
                                {...rest}
                            />
                            <div className="inputRightChildren">
                                {rightChildren}
                            </div>
                        </div>
                    ) : (
                        <input
                            step={step ? step : undefined}
                            type={type}
                            name={name}
                            placeholder={placeholder}
                            className={`formInput ${fieldError ? 'error' : ''} ${className}`}
                            value={field.value}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (isNumberInput && rules?.valueAsNumber) {
                                    field.onChange(value === '' ? '' : Number(value));
                                } else {
                                    field.onChange(value);
                                }
                            }}
                            onBlur={field.onBlur}
                            {...rest}
                        />
                    )}
                </div>
            )}
        </ControlledCustomFormField>
    )
}

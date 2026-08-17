import { Control, FieldPath, FieldValues, RegisterOptions } from "react-hook-form";
import ControlledCustomFormField from "./ControlledCustomFormField";
import { PhoneInput } from "@/components/ui/PhoneInput";

import './styles/controlledInputField.css'

interface Props<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
    name: TName;
    control: Control<TFieldValues>;
    rules?: RegisterOptions<TFieldValues, TName>;
    label?: string;
    labelCn?: string;
    labelColor?: string;
    isRequired?: boolean;
    placeholder?: string;
    className?: string;
}

export default function ControlledPhoneInput<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
    name,
    control,
    rules,
    label,
    labelCn,
    labelColor,
    isRequired,
    placeholder,
    className = '',
}: Props<TFieldValues, TName>) {
    return (
        <ControlledCustomFormField name={name} control={control} rules={rules} label={label} labelCn={labelCn} labelColor={labelColor} isRequired={isRequired}>
            {({ field, fieldState: { error: fieldError } }) => (
                <div className="controlledInputFieldGroup">
                    <PhoneInput
                        id={name}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder={placeholder}
                        className={`formInput h-auto shadow-none focus-visible:ring-0 ${fieldError ? 'error' : ''} ${className}`}
                    />
                </div>
            )}
        </ControlledCustomFormField>
    )
}

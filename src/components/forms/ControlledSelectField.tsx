import { Control, FieldPath, FieldValues, RegisterOptions } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import ControlledCustomFormField from "./ControlledCustomFormField";
import './styles/controlledInputField.css';

interface SelectOption {
    value: string;
    label: string;
}

interface Props<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
    name: TName;
    control: Control<TFieldValues>;
    rules?: RegisterOptions<TFieldValues, TName>;
    label?: string;
    isRequired?: boolean;
    placeholder?: string;
    options: SelectOption[];
    className?: string;
    disabled?: boolean;
}

export default function ControlledSelectField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
    name,
    control,
    rules,
    label,
    isRequired,
    placeholder = "Select an option",
    options,
    className,
    disabled
}: Props<TFieldValues, TName>) {
    return (
        <ControlledCustomFormField name={name} control={control} rules={rules} label={label} isRequired={isRequired}>
            {({ field, fieldState: { error } }) => (
                <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                    disabled={disabled}
                >
                    <SelectTrigger
                        className={`controlledSelect ${error ? 'error' : ''} ${className || ''}`}
                    >
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </ControlledCustomFormField>
    );
}

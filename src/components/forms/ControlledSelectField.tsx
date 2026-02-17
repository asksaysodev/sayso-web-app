import { RegisterOptions, UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import ControlledCustomFormField from "./ControlledCustomFormField";
import './styles/controlledInputField.css';

interface SelectOption {
    value: string;
    label: string;
}

interface Props {
    name: string;
    control: UseFormReturn<any>['control'];
    rules?: RegisterOptions;
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    className?: string;
    disabled?: boolean;
}

export default function ControlledSelectField({ 
    name, 
    control, 
    rules, 
    label, 
    placeholder = "Select an option",
    options,
    className,
    disabled
}: Props) {
    return (
        <ControlledCustomFormField name={name} control={control} rules={rules} label={label}>
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

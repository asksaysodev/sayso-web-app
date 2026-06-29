import { Controller, ControllerFieldState, ControllerRenderProps, RegisterOptions, UseFormReturn, UseFormStateReturn } from "react-hook-form";
import { Label } from "../ui/label";

interface FieldOptions {
    field: ControllerRenderProps<any, string>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<any>;
}

interface Props {
    name: string;
    control: UseFormReturn<any>['control'];
    rules?: RegisterOptions;
    children: (fieldOptions: FieldOptions) => React.ReactNode;
    label?: string;
    labelCn?: string;
    labelColor?: string;
    isRequired?: boolean;
}

export default function ControlledCustomFormField({ name, control, rules, label, children, labelCn = '', labelColor = 'var(--sayso-darkgray)', isRequired }: Props) {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={(fieldOptions) => (
                <div>
                    <div className="grid gap-2">
                        {label && (
                                <Label className={labelCn} htmlFor={name} style={{ color: labelColor }}>
                                    {label}
                                    {isRequired && <span className="text-black ml-0.5">*</span>}
                                </Label>
                            )}
                        {children(fieldOptions)}
                    </div>
                    {fieldOptions.fieldState.error && (
                        <span className="text-sm" style={{ color: 'var(--sayso-error)' }}>
                        {fieldOptions.fieldState.error?.message}
                        </span>
                    )}
                </div>
            )}
        />
    )
}

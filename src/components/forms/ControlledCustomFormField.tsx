import { Control, Controller, ControllerFieldState, ControllerRenderProps, FieldPath, FieldValues, RegisterOptions, UseFormStateReturn } from "react-hook-form";
import { Label } from "../ui/label";

interface FieldOptions<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
}

interface Props<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
    name: TName;
    control: Control<TFieldValues>;
    rules?: RegisterOptions<TFieldValues, TName>;
    children: (fieldOptions: FieldOptions<TFieldValues, TName>) => React.ReactNode;
    label?: string;
    labelCn?: string;
    labelColor?: string;
    isRequired?: boolean;
}

export default function ControlledCustomFormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({ name, control, rules, label, children, labelCn = '', labelColor = 'var(--sayso-darkgray)', isRequired }: Props<TFieldValues, TName>) {
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

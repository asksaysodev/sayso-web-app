import { RegisterOptions, UseFormReturn } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import ControlledCustomFormField from "./ControlledCustomFormField";
import CharacterCounter, { CharacterCounterType } from "@/views/Admin/components/CharacterCounter";
import './styles/controlledInputField.css';

interface Props {
    name: string;
    control: UseFormReturn<any>['control'];
    rules?: RegisterOptions;
    label?: string;
    placeholder?: string;
    rows?: number;
    resize?: 'none' | 'vertical' | 'horizontal';
    characterCounter?: boolean;
    characterCounterType?: CharacterCounterType;
}

export default function ControlledTextareaField({ 
    name, 
    control, 
    rules, 
    label, 
    placeholder, 
    rows = 2, 
    resize = 'vertical', 
    characterCounter = false,
    characterCounterType
}: Props) {

    return (
        <ControlledCustomFormField name={name} control={control} rules={rules} label={label}>
            {({ field, fieldState: {error} }) => (
                <div className="grid gap-1">
                    <Textarea
                        {...field}
                        rows={rows}
                        placeholder={placeholder}
                        className={`controlledTextarea ${error ? 'error' : ''}`}
                        style={{
                            resize: resize
                        }}
                    />
                    {characterCounter && <CharacterCounter text={field.value || ''} type={characterCounterType} />}
                </div>
            )}
        </ControlledCustomFormField>
    )
}
import { useId, type ReactNode } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { Select } from '@/components/ui/select';
import { FieldMessage, FieldShell } from '../FieldShell';
import './SelectField.css';

const NULL_VALUE = '__ds-select-null__';

const toRadixValue = (value: string | null) => (value === null ? NULL_VALUE : value);

export interface SelectFieldOption<T extends string | null> {
    value: T;
    label: ReactNode;
}

export interface SelectFieldProps<T extends string | null> {
    label: ReactNode;
    /** `null` is a valid option value (e.g. "No team"); `''` is not (Radix reserves it for "no selection"). */
    options: SelectFieldOption<T>[];
    /** `undefined` shows the placeholder. */
    value: T | undefined;
    onChange: (value: T) => void;
    placeholder?: string;
    leadingIcon?: ReactNode;
    disabled?: boolean;
    helperText?: ReactNode;
    error?: ReactNode;
    className?: string;
}

export function SelectField<T extends string | null>({
    label,
    options,
    value,
    onChange,
    placeholder,
    leadingIcon,
    disabled,
    helperText,
    error,
    className,
}: SelectFieldProps<T>) {
    const id = useId();
    const labelId = `${id}-label`;
    const messageId = `${id}-message`;
    const hasMessage = Boolean(error || helperText);

    const handleValueChange = (radixValue: string) => {
        const option = options.find((o) => toRadixValue(o.value) === radixValue);
        if (option) onChange(option.value);
    };

    return (
        <div className={clsx('ds-field-group', className)}>
            <Select
                value={value === undefined ? '' : toRadixValue(value)}
                onValueChange={handleValueChange}
                disabled={disabled}
            >
                <SelectPrimitive.Trigger asChild>
                    <FieldShell
                        label={label}
                        labelId={labelId}
                        leadingIcon={leadingIcon}
                        trailingIcon={<ChevronDown size={20} />}
                        disabled={disabled}
                        invalid={Boolean(error)}
                        className='ds-select__trigger'
                        tabIndex={disabled ? -1 : 0}
                        aria-labelledby={labelId}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={hasMessage ? messageId : undefined}
                    >
                        <span className='ds-select__value'>
                            <SelectPrimitive.Value placeholder={placeholder} />
                        </span>
                    </FieldShell>
                </SelectPrimitive.Trigger>
                <SelectPrimitive.Portal>
                    <SelectPrimitive.Content className='ds-select__content' position='popper' sideOffset={4}>
                        <SelectPrimitive.Viewport className='ds-select__viewport'>
                            {options.map((option) => (
                                <SelectPrimitive.Item
                                    key={toRadixValue(option.value)}
                                    value={toRadixValue(option.value)}
                                    className='ds-select__item'
                                >
                                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                                    <SelectPrimitive.ItemIndicator className='ds-select__check'>
                                        <Check size={20} />
                                    </SelectPrimitive.ItemIndicator>
                                </SelectPrimitive.Item>
                            ))}
                        </SelectPrimitive.Viewport>
                    </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
            </Select>
            <FieldMessage id={messageId} error={error} helperText={helperText} />
        </div>
    );
}

import { useId } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { Select } from '@/components/ui/select';
import './RowsPerPageSelect.css';

export interface RowsPerPageSelectProps {
    value: number;
    onChange: (value: number) => void;
    options?: number[];
    className?: string;
}

export function RowsPerPageSelect({ value, onChange, options = [10, 25, 50], className }: RowsPerPageSelectProps) {
    const labelId = useId();

    return (
        <div className={clsx('ds-rows-per-page', className)}>
            <span id={labelId} className='ds-rows-per-page__label'>
                Rows per page
            </span>
            <Select value={String(value)} onValueChange={(next) => onChange(Number(next))}>
                <SelectPrimitive.Trigger className='ds-rows-per-page__trigger' aria-labelledby={labelId}>
                    <SelectPrimitive.Value />
                    <SelectPrimitive.Icon className='ds-rows-per-page__icon'>
                        <ChevronDown size={16} />
                    </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>
                <SelectPrimitive.Portal>
                    <SelectPrimitive.Content className='ds-rows-per-page__content' position='popper' sideOffset={4}>
                        <SelectPrimitive.Viewport>
                            {options.map((option) => (
                                <SelectPrimitive.Item
                                    key={option}
                                    value={String(option)}
                                    className='ds-rows-per-page__item'
                                >
                                    <SelectPrimitive.ItemText>{option}</SelectPrimitive.ItemText>
                                    <SelectPrimitive.ItemIndicator className='ds-rows-per-page__check'>
                                        <Check size={14} />
                                    </SelectPrimitive.ItemIndicator>
                                </SelectPrimitive.Item>
                            ))}
                        </SelectPrimitive.Viewport>
                    </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
            </Select>
        </div>
    );
}

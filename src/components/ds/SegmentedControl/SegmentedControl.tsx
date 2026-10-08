import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import clsx from 'clsx';
import './SegmentedControl.css';

export interface SegmentedControlItem<T extends string> {
    value: T;
    label: ReactNode;
    icon?: ReactNode;
}

export interface SegmentedControlProps<T extends string> {
    items: SegmentedControlItem<T>[];
    value: T;
    onChange: (value: T) => void;
    'aria-label'?: string;
    className?: string;
}

export function SegmentedControl<T extends string>({
    items,
    value,
    onChange,
    'aria-label': ariaLabel,
    className,
}: SegmentedControlProps<T>) {
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const select = (index: number) => {
        const item = items[index];
        if (!item) return;
        onChange(item.value);
        tabRefs.current[index]?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        const last = items.length - 1;
        const next: Record<string, number> = {
            ArrowRight: index === last ? 0 : index + 1,
            ArrowLeft: index === 0 ? last : index - 1,
            Home: 0,
            End: last,
        };
        if (!(event.key in next)) return;
        event.preventDefault();
        select(next[event.key]);
    };

    return (
        <div role='tablist' aria-label={ariaLabel} className={clsx('ds-segmented', className)}>
            {items.map((item, index) => {
                const selected = item.value === value;
                return (
                    <button
                        key={item.value}
                        ref={(el) => {
                            tabRefs.current[index] = el;
                        }}
                        type='button'
                        role='tab'
                        aria-selected={selected}
                        tabIndex={selected ? 0 : -1}
                        className={clsx('ds-segmented__item', selected && 'ds-segmented__item--active')}
                        onClick={() => onChange(item.value)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}

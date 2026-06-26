import * as React from 'react';
import { AsYouType, parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { Input } from '@/components/ui/input';

const DEFAULT_DIAL_CODE = '+1';

/**
 * Live-formats a raw phone string for display, e.g. `+1 (555) 123-4567`.
 * `AsYouType` is tolerant of partial input, paste, and editable country codes,
 * so we avoid a rigid literal mask that fights the cursor.
 */
export function formatPhoneInput(value: string): string {
    return new AsYouType().input(value);
}

/**
 * Normalize to E.164 (e.g. `+15551234567`) for sending to the CRM/FUB.
 * Falls back to the trimmed input if it can't be parsed (validation gates submit).
 */
export function toE164(value: string, defaultCountry: 'US' = 'US'): string {
    try {
        const parsed = parsePhoneNumber(value.trim(), defaultCountry);
        return parsed?.number ?? value.trim();
    } catch {
        return value.trim();
    }
}

/** Validation helper for react-hook-form `validate` rules. */
export function isValidPhone(value: string, defaultCountry: 'US' = 'US'): boolean {
    return isValidPhoneNumber(value.trim(), defaultCountry);
}

export interface PhoneInputProps
    extends Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'type'> {
    /** Controlled value (formatted display string). */
    value: string;
    /** Receives the formatted display string. */
    onChange: (value: string) => void;
}

/**
 * Reusable phone input that composes the shadcn `ui/input` (inheriting all
 * styles/variants) and adds live formatting via `libphonenumber-js`. Controlled,
 * for use with react-hook-form `Controller`. Seeds an editable `+1` so US entry
 * is one keystroke away while still allowing other country codes.
 */
export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ value, onChange, onFocus, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(formatPhoneInput(e.target.value));
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            // Seed the default dial code on first focus into an empty field so the
            // user can immediately type the local number.
            if (!value) onChange(DEFAULT_DIAL_CODE);
            onFocus?.(e);
        };

        return (
            <Input
                ref={ref}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                {...props}
            />
        );
    },
);
PhoneInput.displayName = 'PhoneInput';

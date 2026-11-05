import { isValidPhone } from '@/components/ui/PhoneInput';
import { getPasswordStrength } from '@/components/auth/PasswordStrength';
import type { SignupFormData } from '../types';

type Errors = Partial<Record<keyof SignupFormData, string>>;

const EMAIL_PATTERN = /\S+@\S+\.\S+/;

/** True when the phone field holds something beyond the seeded "+1" dial code. */
export const isPhoneFilled = (phone: string) => !!phone && phone.trim() !== '+1';

/** Sub-step 1: personal details. */
export const validatePersonalDetails = (data: SignupFormData): Errors => {
    const errors: Errors = {};
    if (!data.name.trim()) errors.name = 'Enter your first name.';
    if (!data.lastname.trim()) errors.lastname = 'Enter your last name.';
    if (!data.company.trim()) errors.company = 'Enter your brokerage or team name.';
    if (isPhoneFilled(data.phone) && !isValidPhone(data.phone)) errors.phone = 'Enter a valid phone number.';
    return errors;
};

/** Sub-step 2: login details. */
export const validateLoginDetails = (data: SignupFormData): Errors => {
    const errors: Errors = {};
    if (!data.email.trim()) {
        errors.email = 'Enter your email address.';
    } else if (!EMAIL_PATTERN.test(data.email)) {
        errors.email = 'Enter a valid email address.';
    }
    if (!data.password) {
        errors.password = 'Enter a password.';
    } else if (!getPasswordStrength(data.password).allRulesMet) {
        errors.password =
            'This password doesn’t meet the password requirements. Choose a stronger password.';
    }
    if (!data.repeatPassword) {
        errors.repeatPassword = 'Confirm your password.';
    } else if (data.password !== data.repeatPassword) {
        errors.repeatPassword = 'Passwords don’t match.';
    }
    return errors;
};

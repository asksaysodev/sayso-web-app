import { getPasswordStrength } from './PasswordStrength';

export interface PasswordFieldErrors {
    newPassword?: string;
    confirmPassword?: string;
}

export const validateFields = (newPassword: string, confirmPassword: string): PasswordFieldErrors => {
    const errors: PasswordFieldErrors = {};
    if (!newPassword) {
        errors.newPassword = 'Enter a new password.';
    } else if (!getPasswordStrength(newPassword).allRulesMet) {
        errors.newPassword =
            'This password doesn’t meet the password requirements. Choose a stronger password.';
    }
    if (!confirmPassword) {
        errors.confirmPassword = 'Confirm your password.';
    } else if (newPassword !== confirmPassword) {
        errors.confirmPassword = 'Passwords don’t match. Please try again.';
    }
    return errors;
};

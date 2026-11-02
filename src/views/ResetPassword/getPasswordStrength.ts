export interface PasswordRule {
    id: 'length' | 'number';
    label: string;
    met: boolean;
}

export type PasswordStrengthLevel = 'empty' | 'weak' | 'fair' | 'strong' | 'veryStrong';

export interface PasswordStrength {
    rules: PasswordRule[];
    /** 0–4: rules met, plus 1 for a symbol and 1 for 12+ characters once every rule is met. */
    score: number;
    level: PasswordStrengthLevel;
    label: string;
    allRulesMet: boolean;
}

export function getPasswordStrength(password: string): PasswordStrength {
    const rules: PasswordRule[] = [
        { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
        { id: 'number', label: 'At least one number', met: /\d/.test(password) },
    ];
    const metCount = rules.filter(rule => rule.met).length;
    const allRulesMet = metCount === rules.length;
    // A symbol is no longer required (product decision), but it still makes a password stronger.
    const hasSymbol = /[^A-Za-z0-9\s]/.test(password);
    const score = metCount + (allRulesMet && hasSymbol ? 1 : 0) + (allRulesMet && password.length >= 12 ? 1 : 0);

    if (password.length === 0) {
        return { rules, score, level: 'empty', label: 'Enter a password', allRulesMet };
    }
    if (score <= 1) return { rules, score, level: 'weak', label: 'Weak', allRulesMet };
    if (score === 2) return { rules, score, level: 'fair', label: 'Fair', allRulesMet };
    if (score === 3) return { rules, score, level: 'strong', label: 'Strong', allRulesMet };
    return { rules, score, level: 'veryStrong', label: 'Very strong', allRulesMet };
}

/**
 * Assurance Level 1: aal1 Means that the user's identity was verified using a conventional login method such as 
 * email+password, magic link, one-time password, phone auth or social login.
 * 
 * Assurance Level 2: aal2 Means that the user's identity was additionally verified using at least one second factor,
 * such as a TOTP code or One-Time Password code.
 */
export type AALLevel = 'aal1' | 'aal2';

export interface EnrollTOTPResult {
    factorId: string;
    qrCode: string;
    secret: string;
}

export interface MFAServiceError {
    message: string;
    code?: string;
}
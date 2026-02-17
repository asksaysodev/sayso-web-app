/** This File Wraps all Supabase MFA methods */

import { AALLevel, EnrollTOTPResult, MFAServiceError } from '@/types/supabaseMFA';
import { supabase } from '../config/supabase'
import type { AuthMFAGetAuthenticatorAssuranceLevelResponse, Factor } from '@supabase/supabase-js'


/**
 * Enrolls a new TOTP factor for the current user.
 * Returns QR code and secret for authenticator app setup.
 */
export async function enrollTOTP(): Promise<{ data: EnrollTOTPResult | null; error: MFAServiceError | null }> {
    const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'Sayso',
    })

    if (error) {
        return { data: null, error: { message: error.message, code: error.code } }
    }

    if (!data || data.type !== 'totp') {
        return { data: null, error: { message: 'Failed to enroll TOTP factor' } }
    }

    return {
        data: {
            factorId: data.id,
            qrCode: data.totp.qr_code,
            secret: data.totp.secret,
        },
        error: null,
    }
}

/**
 * Creates a challenge for an enrolled factor.
 * Must be called before verifyFactor.
 */
export async function challengeFactor(factorId: string): Promise<{ data: { challengeId: string } | null; error: MFAServiceError | null }> {
    const { data, error } = await supabase.auth.mfa.challenge({ factorId })

    if (error) {
        return { data: null, error: { message: error.message, code: error.code } }
    }

    if (!data) {
        return { data: null, error: { message: 'Failed to create challenge' } }
    }

    return {
        data: { challengeId: data.id },
        error: null,
    }
}

/**
 * Verifies a TOTP code against an active challenge.
 * On success, elevates the session to AAL2.
 */
export async function verifyFactor(factorId: string, challengeId: string, code: string): Promise<{ success: boolean; error: MFAServiceError | null }> {
    const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code,
    })

    if (error) {
        return { success: false, error: { message: error.message, code: error.code } }
    }

    return { success: true, error: null }
}

/**
 * Unenrolls (removes) a factor from the user's account.
 */
export async function unenrollFactor(factorId: string): Promise<{ success: boolean; error: MFAServiceError | null }> {
    const { error } = await supabase.auth.mfa.unenroll({ factorId })

    if (error) {
        return { success: false, error: { message: error.message, code: error.code } }
    }

    return { success: true, error: null }
}

/**
 * Lists all enrolled MFA factors for the current user.
 */
export async function listFactors(): Promise<{ data: Factor[]; error: MFAServiceError | null }> {
    const { data, error } = await supabase.auth.mfa.listFactors()

    if (error) {
        return { data: [], error: { message: error.message, code: error.code } }
    }

    return { data: data?.totp ?? [], error: null }
}

/**
 * Gets the current and next Authenticator Assurance Level.
 * - currentLevel: The AAL the session currently has
 * - nextLevel: The highest AAL the user can achieve (aal2 if MFA is enrolled)
 */
export async function getAAL(): Promise<{
    data: { currentLevel: AALLevel | null; nextLevel: AALLevel | null } | null
    error: MFAServiceError | null
}> {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel() as AuthMFAGetAuthenticatorAssuranceLevelResponse

    if (error) {
        return { data: null, error: { message: error.message, code: error.code } }
    }

    return {
        data: {
            currentLevel: data.currentLevel as AALLevel | null,
            nextLevel: data.nextLevel as AALLevel | null,
        },
        error: null,
    }
}

/**
 * Helper: Checks if user needs to complete MFA verification.
 * Returns true if user has MFA enrolled but hasn't verified this session.
 */
export async function requiresMFAVerification(): Promise<boolean> {
    const { data, error } = await getAAL()

    if (error || !data) return false

    return data.currentLevel === 'aal1' && data.nextLevel === 'aal2'
}

/**
 * Helper: Checks if user has MFA enrolled.
 */
export async function hasMFAEnabled(): Promise<boolean> {
    const { data } = await listFactors()
    return data.length > 0
}

/**
 * Helper: Performs challenge + verify in one call.
 * Useful for login flow and re-verification.
 */
export async function verifyTOTPCode(factorId: string, code: string): Promise<{ success: boolean; error: MFAServiceError | null }> {
    const challengeResult = await challengeFactor(factorId)

    if (challengeResult.error || !challengeResult.data) {
        return { success: false, error: challengeResult.error }
    }

    return verifyFactor(factorId, challengeResult.data.challengeId, code)
}
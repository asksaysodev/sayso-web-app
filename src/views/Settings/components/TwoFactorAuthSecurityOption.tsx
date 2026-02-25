import { LuShield, LuLoader } from "react-icons/lu";
import { Switch } from "@/components/ui/switch";
import SaysoModal from "@/components/SaysoModal";
import { useEffect, useState } from "react";
import SecurityFormSettingContainer from "./SecuritySettingContainer";
import MFAEnrollmentModal from "./MFAEnrollmentModal";
import { enrollTOTP, unenrollFactor, listFactors } from "@/services/mfaServices";
import { EnrollTOTPResult } from "@/types/supabaseMFA";
import { useToast } from "@/context/ToastContext";
import * as Sentry from "@sentry/react";
import type { Factor } from "@supabase/supabase-js";

export default function TwoFactorAuthSecurityOption() {
    const { showToast } = useToast();

    const [isMFAEnabled, setIsMFAEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [enrolledFactor, setEnrolledFactor] = useState<Factor | null>(null);

    const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
    const [showDisableModal, setShowDisableModal] = useState(false);
    const [enrollmentData, setEnrollmentData] = useState<EnrollTOTPResult | null>(null);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isDisabling, setIsDisabling] = useState(false);

    useEffect(() => {
        const fetchMFAStatus = async () => {
            setIsLoading(true);
            const { data: factors } = await listFactors();

            if (factors.length > 0) {
                setIsMFAEnabled(true);
                setEnrolledFactor(factors[0]);
            } else {
                setIsMFAEnabled(false);
                setEnrolledFactor(null);
            }
            setIsLoading(false);
        };

        fetchMFAStatus();
    }, []);

    const handleToggleMFA = async (checked: boolean) => {
        if (isMFAEnabled && !checked) {
            setShowDisableModal(true);
        } else if (!isMFAEnabled && checked) {
            setIsEnrolling(true);

            const result = await enrollTOTP();

            if (result.error || !result.data) {
                const errorMessage = result.error?.message || 'Failed to start enrollment';
                showToast('error', errorMessage);
                Sentry.captureException(new Error(errorMessage), {
                    extra: { context: 'MFA enrollment', error: result.error }
                });
                setIsEnrolling(false);
                return;
            }

            setEnrollmentData(result.data);
            setShowEnrollmentModal(true);
            setIsEnrolling(false);
        }
    };

    const handleEnrollmentSuccess = async () => {
        const { data: factors } = await listFactors();

        if (factors.length > 0) {
            setEnrolledFactor(factors[0]);
        }

        setIsMFAEnabled(true);
        setShowEnrollmentModal(false);
        setEnrollmentData(null);
    };

    const handleEnrollmentCancel = async () => {
        if (enrollmentData) {
            await unenrollFactor(enrollmentData.factorId);
        }

        setShowEnrollmentModal(false);
        setEnrollmentData(null);
    };

    const handleConfirmDisable = async () => {
        if (!enrolledFactor) {
            setShowDisableModal(false);
            return;
        }

        setIsDisabling(true);

        const result = await unenrollFactor(enrolledFactor.id);

        if (result.error) {
            showToast('error', result.error.message);
            Sentry.captureException(new Error(result.error.message), {
                extra: { context: 'MFA unenroll', error: result.error }
            });
            setIsDisabling(false);
            setShowDisableModal(false);
            return;
        }

        setIsMFAEnabled(false);
        setEnrolledFactor(null);
        setIsDisabling(false);
        setShowDisableModal(false);
    };

    const handleCancelDisable = () => {
        setShowDisableModal(false);
    };

    return (
        <>
            <SecurityFormSettingContainer
                icon={<LuShield size={20} />}
                title="Two-factor authentication"
                description={
                    isMFAEnabled
                        ? "Your account is protected with 2FA"
                        : "Enable 2FA to add an extra layer of security to your account"
                }
                rightContent={
                    isLoading || isEnrolling ? (
                        <LuLoader className="animate-spin" size={20} />
                    ) : (
                        <Switch
                            checked={isMFAEnabled}
                            onCheckedChange={handleToggleMFA}
                            className="data-[state=checked]:bg-[var(--sayso-blue)] data-[state=unchecked]:bg-input"
                        />
                    )
                }
            />

            {showEnrollmentModal && enrollmentData && (
                <MFAEnrollmentModal
                    enrollmentData={enrollmentData}
                    onSuccess={handleEnrollmentSuccess}
                    onCancel={handleEnrollmentCancel}
                />
            )}

            {showDisableModal && (
                <SaysoModal
                    title="Disable Two-Factor Authentication"
                    text="Are you sure you want to disable two-factor authentication? This will make your account less secure."
                    isDelete={true}
                    onDeny={handleCancelDisable}
                    onConfirm={handleConfirmDisable}
                    primaryText={isDisabling ? "Disabling..." : "Yes, Disable"}
                    secondaryText="Cancel"
                />
            )}
        </>
    );
}

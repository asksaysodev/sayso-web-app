import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import { ArrowRight, CircleAlert, LoaderCircle } from "lucide-react";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ds/Button";
import { TextField } from "@/components/ds/TextField";
import { PasswordStrength, getPasswordStrength } from "@/components/auth/PasswordStrength";
import EyeToggle from "./components/EyeToggle";
import { useToast } from "@/context/ToastContext";
import { supabase } from "@/config/supabase";
import { useAuth } from "@/context/AuthContext";
import validateInvite from "./services/validateInvite";
import { toInviteErrorKind } from "./services/inviteErrors";
import InviteUnavailable from "./components/InviteUnavailable";
import reportApiError from "@/utils/reportApiError";
import { useAccounts } from "@/hooks/useAccounts";
import { toSignupError, ACCOUNT_CREATED_SIGN_IN_FAILED } from "@/utils/signupErrors";
import { SignupProgress } from "@/components/auth/SignupProgress";
import "./styles.css";

const errorIcon = <CircleAlert size={24} color="var(--error-icon)" aria-hidden="true" />;

interface FormValues {
    name: string;
    lastname: string;
    password: string;
    confirmPassword: string;
}

export default function AcceptInvite() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { updateGlobalUser } = useAuth();
    const { signup } = useAccounts();
    const { showToast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const token = searchParams.get("token") ?? "";

    const { data: invite, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ["validate-invite", token],
        queryFn: () => validateInvite(token),
        enabled: !!token,
        retry: false,
    });

    useEffect(() => {
        if (error) reportApiError(error, { feature: "accept-invite", operation: "validateInvite" });
    }, [error]);

    const { control, handleSubmit, getValues } = useForm<FormValues>({
        defaultValues: { name: "", lastname: "", password: "", confirmPassword: "" },
    });

    const [name, lastname, password, confirmPassword] = useWatch({
        control,
        name: ["name", "lastname", "password", "confirmPassword"],
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: FormValues) => {
            // One server-side call creates the auth user, the account, and accepts the
            // invite (SAYSO-387). Previously this was supabase.auth.signUp() followed by
            // an authenticated accept — which minted a session before the accounts row
            // existed, and needed a coordination hook in AuthContext to stop the account
            // fetch racing it (SAYSO-341). The row now precedes the session, so that hook
            // is gone (SAYSO-387 Phase 4).
            //
            // The token goes to the server as-is: it derives the company from the invite
            // ROW after verifying the token's signature, never from the token's payload.
            try {
                await signup({
                    email: invite!.email,
                    password: values.password,
                    name: values.name,
                    lastname: values.lastname,
                    team_invite_token: token,
                });
            } catch (err) {
                throw toSignupError(err);
            }

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: invite!.email,
                password: values.password,
            });

            // Account exists but no session — retrying would collide on the email and
            // read as "already registered", so name the real state instead.
            if (signInError) throw new Error(ACCOUNT_CREATED_SIGN_IN_FAILED);

            // Populate globalUser before navigating, so the dashboard renders
            // immediately instead of depending on AuthContext's timer.
            await updateGlobalUser(invite!.email);
        },
        onSuccess: () => {
            navigate("/signup/download", { replace: true });
        },
        onError: (err) => {
            showToast("error", (err as Error).message || "Something went wrong. Please try again.");
        },
    });

    const onSubmit = (values: FormValues) => {
        mutate(values);
    };

    if (!token) {
        return <InviteUnavailable kind="INVALID" />;
    }

    if (isLoading) {
        return (
            <AuthLayout
                title="You've been invited"
                aside={<SignupProgress current="account" hideSubscriptionStep />}
            >
                <div className="acceptInviteCard acceptInviteCard--center" role="status" aria-label="Checking invite">
                    <LoaderCircle className="acceptInviteCardSpinner" size={32} color="var(--primary-500)" aria-hidden="true" />
                </div>
            </AuthLayout>
        );
    }

    if (isError || !invite) {
        return (
            <InviteUnavailable
                kind={isError ? toInviteErrorKind(error) : "TRANSIENT"}
                onRetry={refetch}
                isRetrying={isFetching}
            />
        );
    }

    const joinLabel = `Join ${invite.companyName}`;

    return (
        <AuthLayout
            title="You've been invited"
            aside={<SignupProgress current="account" hideSubscriptionStep />}
        >
            <form className="acceptInviteCard" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                    <h2 className="acceptInviteCardHeading">{joinLabel}</h2>
                    <p className="acceptInviteCardSubtitle">
                        {`You're joining ${invite.companyName}. Create your account to get started.`}
                    </p>
                </div>

                <div className="acceptInviteCardFields">
                    <div className="acceptInviteCardRow">
                        <Controller
                            control={control}
                            name="name"
                            rules={{ validate: (v) => !!v.trim() || "Enter your first name." }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    autoComplete="given-name"
                                    label="First name"
                                    disabled={isPending}
                                    error={fieldState.error?.message}
                                    trailingIcon={fieldState.error ? errorIcon : undefined}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="lastname"
                            rules={{ validate: (v) => !!v.trim() || "Enter your last name." }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    autoComplete="family-name"
                                    label="Last name"
                                    disabled={isPending}
                                    error={fieldState.error?.message}
                                    trailingIcon={fieldState.error ? errorIcon : undefined}
                                />
                            )}
                        />
                    </div>

                    <TextField
                        type="email"
                        autoComplete="email"
                        label="Email"
                        value={invite.email}
                        disabled
                        readOnly
                    />

                    <div className="acceptInviteCardPasswordGroup">
                        <Controller
                            control={control}
                            name="password"
                            rules={{
                                validate: (v) => {
                                    if (!v) return "Enter a password.";
                                    if (!getPasswordStrength(v).allRulesMet) {
                                        return "This password doesn’t meet the password requirements. Choose a stronger password.";
                                    }
                                    return true;
                                },
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    label="Password"
                                    disabled={isPending}
                                    error={fieldState.error?.message}
                                    trailingIcon={
                                        fieldState.error ? (
                                            errorIcon
                                        ) : (
                                            <EyeToggle
                                                shown={showPassword}
                                                disabled={isPending}
                                                label="password"
                                                onToggle={() => setShowPassword((prev) => !prev)}
                                            />
                                        )
                                    }
                                />
                            )}
                        />
                        <PasswordStrength password={password ?? ""} />
                    </div>

                    <Controller
                        control={control}
                        name="confirmPassword"
                        rules={{
                            validate: (v) => {
                                if (!v) return "Confirm your password.";
                                if (v !== getValues("password")) return "Passwords don’t match.";
                                return true;
                            },
                        }}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                label="Confirm password"
                                disabled={isPending}
                                error={fieldState.error?.message}
                                trailingIcon={
                                    fieldState.error ? (
                                        errorIcon
                                    ) : (
                                        <EyeToggle
                                            shown={showConfirmPassword}
                                            disabled={isPending}
                                            label="confirm password"
                                            onToggle={() => setShowConfirmPassword((prev) => !prev)}
                                        />
                                    )
                                }
                            />
                        )}
                    />
                </div>

                <div className="acceptInviteCardFooter acceptInviteCardFooter--end">
                    <Button
                        type="submit"
                        variant="primary"
                        className="acceptInviteCardSubmit"
                        loading={isPending}
                        disabled={!name?.trim() || !lastname?.trim() || !password || !confirmPassword}
                    >
                        {joinLabel}
                        {!isPending && <ArrowRight size={20} aria-hidden="true" />}
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}

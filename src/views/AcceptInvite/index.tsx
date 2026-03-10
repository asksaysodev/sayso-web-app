import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { LuBuilding2 } from "react-icons/lu";
import LoginLayout from "@/components/layouts/LoginLayout";
import ControlledInputField from "@/components/forms/ControlledInputField";
import LoginBtn from "@/components/LoginBtn";
import EyeToggleShowPasswordButton from "@/views/Login/components/EyeToggleShowPasswordButton";
import dayjs from "dayjs";
import { supabase } from "@/config/supabase";
import validateInvite from "./services/validateInvite";
import acceptInvite from "./services/acceptInvite";
import SaysoLoader from "@/components/SaysoLoader";
import "./styles.css";

interface FormValues {
    name: string;
    lastname: string;
    password: string;
    confirmPassword: string;
}

export default function AcceptInvite() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const token = searchParams.get("token") ?? "";

    const { data: invite, isLoading, isError } = useQuery({
        queryKey: ["validate-invite", token],
        queryFn: () => validateInvite(token),
        enabled: !!token,
        retry: false,
    });

    const { control, handleSubmit, watch } = useForm<FormValues>({
        defaultValues: { name: "", lastname: "", password: "", confirmPassword: "" },
    });

    const { mutate, isPending, error: submitError } = useMutation({
        mutationFn: async (values: FormValues) => {
            const { error: signUpError } = await supabase.auth.signUp({
                email: invite!.email,
                password: values.password,
                options: {
                    data: {
                        name: values.name,
                        lastname: values.lastname,
                    },
                },
            });

            if (signUpError) throw signUpError;

            await acceptInvite({
                // token,
                email: invite?.email as string,
                name: values.name,
                lastname: values.lastname,
                company: invite?.companyName
            });
        },
        onSuccess: () => {
            navigate("/", { replace: true });
        },
    });

    const onSubmit = (values: FormValues) => {
        mutate(values);
    };

    if (!token) {
        return (
            <LoginLayout>
                <div className="accept-invite-invalid">
                    <p>This invite link is missing required information.</p>
                </div>
            </LoginLayout>
        );
    }

    if (isLoading) {
        return (
            <div className="accept-invite-loading">
                <SaysoLoader />
            </div>
        );
    }
    
    const isExpired = invite ? dayjs().isAfter(dayjs(invite.expiresAt)) : false;

    if (isError || !invite || isExpired) {
        return (
            <LoginLayout>
                <div className="accept-invite-invalid">
                    <p>This invite is no longer valid. Please contact your Company administrator to get a new invite.</p>
                </div>
            </LoginLayout>
        );
    }

    return (
        <LoginLayout
            title="You've been invited!"
            description={`You're joining ${invite.companyName}. Create your account to get started.`}
        >
            <div className="accept-invite-company-badge">
                <LuBuilding2 size={14} />
                <span>{invite.companyName}</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="login-layout-form-inputs-wrapper">
                    <div className="accept-invite-name-row">
                        <ControlledInputField
                            control={control}
                            name="name"
                            label="First Name"
                            labelCn="loginInFormInputLabel"
                            placeholder="John"
                            rules={{ required: "First name is required" }}
                            disabled={isPending}
                        />
                        <ControlledInputField
                            control={control}
                            name="lastname"
                            label="Last Name"
                            labelCn="loginInFormInputLabel"
                            placeholder="Smith"
                            rules={{ required: "Last name is required" }}
                            disabled={isPending}
                        />
                    </div>

                    <div className="accept-invite-email-display">
                        <span className="accept-invite-email-label">Email</span>
                        <span className="accept-invite-email-value">{invite.email}</span>
                    </div>

                    <ControlledInputField
                        type={showPassword ? "text" : "password"}
                        control={control}
                        name="password"
                        label="Password"
                        labelCn="loginInFormInputLabel"
                        placeholder="Create a password"
                        rules={{
                            required: "Password is required",
                            minLength: { value: 8, message: "Password must be at least 8 characters" },
                        }}
                        disabled={isPending}
                        rightChildren={
                            <EyeToggleShowPasswordButton
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                            />
                        }
                    />

                    <ControlledInputField
                        type={showConfirmPassword ? "text" : "password"}
                        control={control}
                        name="confirmPassword"
                        label="Confirm Password"
                        labelCn="loginInFormInputLabel"
                        placeholder="Repeat your password"
                        rules={{
                            required: "Please confirm your password",
                            validate: (val) =>
                                val === watch("password") || "Passwords do not match",
                        }}
                        disabled={isPending}
                        rightChildren={
                            <EyeToggleShowPasswordButton
                                showPassword={showConfirmPassword}
                                setShowPassword={setShowConfirmPassword}
                            />
                        }
                    />

                    {submitError && (
                        <p className="accept-invite-submit-error">
                            {(submitError as Error).message || "Something went wrong. Please try again."}
                        </p>
                    )}

                    <div className="formActions">
                        <LoginBtn
                            type="submit"
                            text={`Join ${invite.companyName}`}
                            isLoading={isPending}
                            isDisabled={isPending}
                        />
                    </div>
                </div>
            </form>
        </LoginLayout>
    );
}

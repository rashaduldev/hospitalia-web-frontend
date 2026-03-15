"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AuthForgotPassword from "./AuthForgotPassword";
import AuthOTPVerify from "./AuthOTPVerify";
import AuthResetPassword from "./AuthResetPassword";

type FlowStep = "FORGOT_PASSWORD" | "VERIFY_OTP" | "reset_pass";

export default function ForgotPasswordFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const stepParam = searchParams.get("step") as FlowStep;
  const emailParam = searchParams.get("email") || "";

  const [step, setStep] = useState<FlowStep>(stepParam || "FORGOT_PASSWORD");
  const [email, setEmail] = useState(emailParam);
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<any>(null);

  const updateUrl = (newStep: FlowStep, emailValue?: string) => {
    const params = new URLSearchParams();
    params.set("step", newStep);

    if (emailValue) params.set("email", emailValue);

    router.replace(`?${params.toString()}`);
  };

  const handleForgotSubmit = async (submittedEmail: string) => {
    setIsLoading(true);
    setServerErrors(null);

    setTimeout(() => {
      setEmail(submittedEmail);
      setStep("VERIFY_OTP");
      updateUrl("VERIFY_OTP", submittedEmail);
      setIsLoading(false);
    }, 1500);
  };

  const handleOTPVerify = async (code: string) => {
    setIsLoading(true);

    setTimeout(() => {
      if (code === "123456") {
        setStep("reset_pass");
        updateUrl("reset_pass", email);
        setIsLoading(false);
      } else {
        setServerErrors({ code: "Invalid verification code. Try 123456" });
        setIsLoading(false);
      }
    }, 1500);
  };

  const handlePasswordReset = async () => {
    setIsLoading(true);

    setTimeout(() => {
      setStep("FORGOT_PASSWORD");
      updateUrl("FORGOT_PASSWORD");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center max-w-sm w-full">
      {step === "FORGOT_PASSWORD" && (
        <AuthForgotPassword
          onSubmit={handleForgotSubmit}
          isLoading={isLoading}
        />
      )}

      {step === "VERIFY_OTP" && (
        <AuthOTPVerify
          deliveryAddress={email}
          onSubmit={handleOTPVerify}
          isLoading={isLoading}
          errors={serverErrors}
          onResend={() => console.log("Resent!")}
        />
      )}

      {step === "reset_pass" && (
        <AuthResetPassword
          onSubmit={handlePasswordReset}
          isLoading={isLoading}
          isTokenValid={true}
        />
      )}
    </div>
  );
}

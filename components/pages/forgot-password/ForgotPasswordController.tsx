"use client";

import { useState } from "react";
import AuthForgotPassword from "./AuthForgotPassword";
import AuthOTPVerify from "./AuthOTPVerify";
import AuthResetPassword from "./AuthResetPassword";

type FlowStep = "FORGOT_PASSWORD" | "VERIFY_OTP" | "RESET_PASSWORD" | "SUCCESS";

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState<FlowStep>("FORGOT_PASSWORD");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<any>(null);

  const handleForgotSubmit = async (submittedEmail: string) => {
    setIsLoading(true);
    setServerErrors(null);

    setTimeout(() => {
      setEmail(submittedEmail);
      setIsLoading(false);
      setStep("VERIFY_OTP");
    }, 1500);
  };

  const handleOTPVerify = async (code: string) => {
    setIsLoading(true);
    setTimeout(() => {
      if (code === "123456") {
        setIsLoading(false);
        setStep("RESET_PASSWORD");
      } else {
        setIsLoading(false);
        setServerErrors({ code: "Invalid verification code. Try 123456" });
      }
    }, 1500);
  };
  const handlePasswordReset = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("FORGOT_PASSWORD");
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

      {step === "RESET_PASSWORD" && (
        <AuthResetPassword
          onSubmit={handlePasswordReset}
          isLoading={isLoading}
          isTokenValid={true}
        />
      )}
    </div>
  );
}

import AuthOTPVerify from "@/components/pages/forgot-password/AuthOTPVerify";
import { getCurrentLocale } from "@/locales/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - OTP Verify",
  description: "Enter your email to receive OTP and reset your password",
};

const VerifyOTPPage = async () => {
  const lang = await getCurrentLocale();
  return (
    <div className="flex min-h-screen items-center justify-center max-w-sm w-full mx-auto">
      <AuthOTPVerify lang={lang} email={""} />
    </div>
  );
};
export default VerifyOTPPage;

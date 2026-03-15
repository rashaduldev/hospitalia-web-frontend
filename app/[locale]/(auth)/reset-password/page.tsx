import AuthResetPassword from "@/components/pages/forgot-password/AuthResetPassword";
import { getCurrentLocale } from "@/locales/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Reset password",
  description: "Enter your new password and confirm password",
};

const ResetPasswordPage = async () => {
  const lang = await getCurrentLocale();
  return (
    <div className="flex min-h-screen items-center justify-center max-w-sm w-full mx-auto">
      <AuthResetPassword lang={lang} email={""} otp="" />
    </div>
  );
};
export default ResetPasswordPage;

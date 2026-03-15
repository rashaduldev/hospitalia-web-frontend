import AuthForgotPassword from "@/components/pages/forgot-password/AuthForgotPassword";
import Header from "@/components/pages/home/Header";
import { getCurrentLocale } from "@/locales/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Forgot Password",
  description: "Enter your email to receive OTP and reset your password",
};

const ForgotPasswordPage = async () => {
  const lang = await getCurrentLocale();
  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center max-w-sm w-full mx-auto">
        <AuthForgotPassword lang={lang} />
      </div>
    </>
  );
};
export default ForgotPasswordPage;

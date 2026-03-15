import ForgotPasswordFlow from "@/components/pages/forgot-password/ForgotPasswordController";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Forgot Password",
  description: "Reset your password to regain access to your account.",
};

const ForgotPasswordPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <ForgotPasswordFlow />
    </div>
  );
};
export default ForgotPasswordPage;

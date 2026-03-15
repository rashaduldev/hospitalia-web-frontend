import ForgotPasswordFlow from "@/components/pages/forgot-password/ForgotPasswordController";
import Header from "@/components/pages/home/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Forgot Password",
  description: "Reset your password to regain access to your account.",
};

const ForgotPasswordPage = () => {
  return (
    <div>
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        <ForgotPasswordFlow />
      </div>
    </div>
  );
};
export default ForgotPasswordPage;

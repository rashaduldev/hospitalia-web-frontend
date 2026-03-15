import LoginForm from "@/components/pages/login/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Login",
  description:
    "Login to your Hospitalia account to securely access hospital services, manage appointments, and connect with healthcare professionals.",
};

const LoginPage = () => {
  return (
    <div className="flex flex-col min-h-screen justify-center">
      <LoginForm />
    </div>
  );
};
export default LoginPage;

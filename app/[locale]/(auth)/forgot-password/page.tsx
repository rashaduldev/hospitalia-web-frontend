import ForgotPasswordFlow from "@/components/pages/forgot-password/ForgotPasswordController";
import Header from "@/components/pages/home/Header";

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

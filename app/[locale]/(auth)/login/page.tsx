import Header from "@/components/pages/home/Header";
import DoctorLoginForm from "@/components/pages/login/DoctorLoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia | Login",
  description:"Login to your Hospitalia account to securely access hospital services, manage appointments, and connect with healthcare professionals.",
};
export default function DoctorRLoginPage() {
  return (
    <div>
      <Header />
      <div className="min-h-[80vh] sm:min-h-screen px-4 flex items-center">
        <DoctorLoginForm/>
      </div>
    </div>
  );
}
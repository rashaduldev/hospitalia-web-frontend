import Header from "@/components/pages/home/Header";
import { Metadata } from "next";
import Image from "next/image";
import patientLoginImg from "../../../../../public/assets/patient-login.png";
import { cn } from "@/lib/utils";
import PatientLoginForm from "@/components/pages/patient/login/LoginForm";

export const metadata: Metadata = {
  title: "Hospitalia - Patient - Login",
  description:
    "Login to your Hospitalia account to securely access hospital services, manage appointments, and connect with healthcare professionals.",
};

export default async function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={cn("flex-1 flex flex-col md:grid md:grid-cols-2 gap-8")}>
        <div className="relative w-full h-75 md:h-full bg-muted">
          <Image
            src={patientLoginImg}
            alt="Patient Login"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div
          className={cn(
            "w-full flex items-center justify-center py-10 md:justify-start md:pl-20 px-5 md:px-4",
          )}
        >
          <div className="w-full max-w-112.5">
            <PatientLoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}

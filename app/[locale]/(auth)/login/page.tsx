import Header from "@/components/pages/home/Header";
import LoginForm from "@/components/pages/login/LoginForm";
import { Metadata } from "next";
import Image from "next/image";
import patientLoginImg from "../../../../public/assets/patient-login.png";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hospitalia - Doctor / Secretary Login",
  description:
    "Login to your Hospitalia account to securely access hospital services, manage appointments, and connect with healthcare professionals.",
};

const LoginPage = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen">
        <main className={cn("flex-1 flex flex-col md:grid md:grid-cols-2 gap-8")}>
          <div className="relative w-full h-75 md:h-full">
            <Image
              src={patientLoginImg}
              alt="Doctor Login"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className={cn("w-full flex items-center justify-center py-10 md:justify-start md:pl-20 px-5 md:px-4")}>
            <div className="w-full max-w-112.5">
              <div className="mb-5">
                <span className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                  Doctor / Secretary Login
                </span>
              </div>
              <LoginForm />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default LoginPage;

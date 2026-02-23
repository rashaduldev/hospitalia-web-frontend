import Header from "@/components/pages/home/Header";
import LoginForm from "@/components/pages/login/LoginForm";
import { Metadata } from "next";
import Image from "next/image";
import patientLoginImg from "../../../../public/assets/patient-login.png";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hospitalia | Login",
  description: "Login to your Hospitalia account to securely access hospital services, manage appointments, and connect with healthcare professionals.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ userType?: string }>;
}) {
  const { userType } = await searchParams;
  const isPatient = userType === "patient";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main
        className={cn(
          "flex-1 flex flex-col gap-0",
          isPatient ? "md:grid md:grid-cols-2" : "items-center justify-center",
        )}
      >
        {isPatient && (
          <div className="relative w-full h-75 md:h-full bg-muted">
            <Image
              src={patientLoginImg}
              alt="Patient Login"
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        <div
          className={cn(
            "w-full flex items-center justify-center py-10",
            isPatient
              ? "md:justify-start md:pl-20 px-5 md:px-0"
              : "mx-auto min-h-[60vh] px-5 md:px-0",
          )}
        >
          <div className="w-full max-w-112.5">
            <LoginForm isPatient={isPatient} />
          </div>
        </div>
      </main>
    </div>
  );
}
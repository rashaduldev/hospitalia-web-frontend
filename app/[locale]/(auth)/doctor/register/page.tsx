import Header from "@/components/pages/home/Header";
import RegistrationForm from "@/components/pages/register/RegisterForm";
import { getCurrentLocale } from "@/locales/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Doctor / Secretary Registration",
  description:
    "Create your Hospitalia account to access hospital services, manage appointments, and connect with healthcare professionals securely.",
};

export default async function RegisterPage() {
  const lang = await getCurrentLocale();
  return (
    <>
      <Header />
      <div className="px-4 pt-10 pb-16">
        <div className="container mx-auto">
          <div className="mb-8">
            <span className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              Doctor / Secretary Registration
            </span>
            <h1 className="text-2xl font-bold text-foreground mt-3">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in your personal and professional details to get started.
            </p>
          </div>
          <RegistrationForm lang={lang} />
        </div>
      </div>
    </>
  );
}

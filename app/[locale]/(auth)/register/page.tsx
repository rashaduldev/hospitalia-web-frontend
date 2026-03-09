import Header from "@/components/pages/home/Header";
import RegistrationForm from "@/components/pages/register/RegisterForm";
import { getCurrentLocale } from "@/locales/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia | Registration",
  description:
    "Create your Hospitalia account to access hospital services, manage appointments, and connect with healthcare professionals securely.",
};

export default async function RegisterPage() {
  const lang = await getCurrentLocale();
  return (
    <div>
      <Header />
      <h2 className="text-2xl text-card-foreground text-center p-7">
        Join Rendewou as a Provider
      </h2>
      <div className="min-h-screen bg-muted/40 px-4">
        <div className="container mx-auto">
          <RegistrationForm lang={lang} />
        </div>
      </div>
    </div>
  );
}

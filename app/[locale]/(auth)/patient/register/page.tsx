import Header from "@/components/pages/home/Header";
import PatinetRegistrationForm from "@/components/pages/patient/register/RegisterForm";
import { getCurrentLocale } from "@/locales/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Create Patient Account",
  description:
    "Create your Hospitalia patient account to book appointments, access health services, and manage your care securely.",
};
export default async function RegisterPage() {
  const lang = await getCurrentLocale();
  return (
    <>
      <Header />
      <div className="px-4 pt-10">
        <div className="container mx-auto">
          <PatinetRegistrationForm lang={lang} />
        </div>
      </div>
    </>
  );
}

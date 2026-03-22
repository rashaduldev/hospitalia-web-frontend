import Header from "@/components/pages/home/Header";
import HospitalRegisterForm from "@/components/pages/hospital/HospitalRegisterForm";
import { getCurrentLocale } from "@/locales/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Hospital Registration",
  description: "Register your hospital on Hospitalia to manage doctors, appointments, and patient services.",
};

export default async function HospitalRegisterPage() {
  const lang = await getCurrentLocale();

  return (
    <>
      <Header />
      <div className="px-4 pt-10 pb-16">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              Hospital Registration
            </span>
            <h1 className="text-2xl font-bold text-foreground mt-3">Register your hospital</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create a hospital account to manage doctors, appointments, and patient services.
            </p>
          </div>
          <HospitalRegisterForm lang={lang} />
        </div>
      </div>
    </>
  );
}

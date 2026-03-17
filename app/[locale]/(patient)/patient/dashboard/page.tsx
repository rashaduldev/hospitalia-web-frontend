import { Metadata } from "next";
import { getCurrentLocale } from "@/locales/server";
import PatientDashboardPage from "@/components/pages/patient/dashboard/PatientDashboardPage";

export const metadata: Metadata = {
  title: "Hospitalia - Dashboard",
  description: "Manage your appointments and health records from your patient dashboard.",
};

export default async function PatientDashboard() {
  const lang = await getCurrentLocale();
  return <PatientDashboardPage lang={lang} />;
}

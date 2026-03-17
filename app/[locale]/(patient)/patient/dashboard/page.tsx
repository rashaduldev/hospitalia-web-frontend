import { Metadata } from "next";
import { getCurrentLocale } from "@/locales/server";
import { getCurrentUser } from "@/actions/user.actions";
import PatientDashboardPage from "@/components/pages/patient/dashboard/PatientDashboardPage";

export const metadata: Metadata = {
  title: "Hospitalia - Dashboard",
  description: "Manage your appointments and health records from your patient dashboard.",
};

export default async function PatientDashboard() {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });
  return <PatientDashboardPage lang={lang} patientUserId={user?.id ?? null} />;
}

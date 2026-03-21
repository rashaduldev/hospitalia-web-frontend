import { Metadata } from "next";
import { getCurrentLocale } from "@/locales/server";
import { getCurrentUser } from "@/actions/user.actions";
import PatientAppointmentsPage from "@/components/pages/patient/appointments/PatientAppointmentsPage";

export const metadata: Metadata = {
  title: "Hospitalia - My Appointments",
  description: "View and manage your upcoming and past appointments.",
};

export default async function AppointmentsPage() {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });
  return <PatientAppointmentsPage lang={lang} patientUserId={user?.id ?? null} />;
}

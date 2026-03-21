import { getCurrentUser } from "@/actions/user.actions";
import { ErrorHandle } from "@/components/common/ErrorHandle";
import DoctorAppointmentsPage from "@/components/pages/doctor/appointments/DoctorAppointmentsPage";
import { getCurrentLocale } from "@/locales/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Appointments",
  description: "View and manage your today's and upcoming appointments.",
};

export default async function DoctorAppointments() {
  const lang = await getCurrentLocale();
  const res = await getCurrentUser({ lang });

  if (!res) {
    return <ErrorHandle message="Failed to load user information." status={401} />;
  }

  return <DoctorAppointmentsPage doctorUserId={res.id} lang={lang} />;
}

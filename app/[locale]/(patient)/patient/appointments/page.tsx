import { Metadata } from "next";
import PatientAppointmentsPage from "@/components/pages/patient/appointments/PatientAppointmentsPage";

export const metadata: Metadata = {
  title: "Hospitalia - My Appointments",
  description: "View and manage your upcoming and past appointments.",
};

export default function AppointmentsPage() {
  return <PatientAppointmentsPage />;
}

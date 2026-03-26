import { Metadata } from "next";
import SecretaryAppointmentsPage from "@/components/pages/secretary/SecretaryAppointmentsPage";

export const metadata: Metadata = {
  title: "Hospitalia - Secretary Appointments",
};

export default function SecretaryAppointmentsRoutePage() {
  return <SecretaryAppointmentsPage />;
}

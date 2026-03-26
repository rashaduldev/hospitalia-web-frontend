import { Metadata } from "next";
import SecretaryPatientsPage from "@/components/pages/secretary/SecretaryPatientsPage";

export const metadata: Metadata = {
  title: "Hospitalia - Patients",
  description: "View patients with appointments at the selected location.",
};

export default function SecretaryPatientsRoutePage() {
  return <SecretaryPatientsPage />;
}

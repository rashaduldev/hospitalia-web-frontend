import { Metadata } from "next";
import PatientSettingsPage from "@/components/pages/patient/settings/PatientSettingsPage";

export const metadata: Metadata = {
  title: "Hospitalia - Settings",
  description: "Manage your account preferences and security settings.",
};

export default function SettingsPage() {
  return <PatientSettingsPage />;
}

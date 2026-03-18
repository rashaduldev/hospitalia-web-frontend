import { Metadata } from "next";
import PatientProfilePage from "@/components/pages/patient/profile/PatientProfilePage";

export const metadata: Metadata = {
  title: "Hospitalia - My Profile",
  description: "View and update your personal health profile.",
};

export default function ProfilePage() {
  return <PatientProfilePage />;
}

import SpecialityManagementPage from "@/components/admin/specialities/SpecialityManagementPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - Speciality Management",
  description: "Manage doctor specialities available on the platform.",
};

export default function AdminSpecialitiesPage() {
  return <SpecialityManagementPage />;
}

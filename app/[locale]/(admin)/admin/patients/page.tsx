import UsersPage from "@/components/admin/users/UsersPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - Patients",
  description: "View and manage patient accounts.",
};

export default async function AdminPatientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <UsersPage
      lang={locale}
      basePath="/admin/patients"
      fixedUserType="PATIENT"
      title="Patient Management"
      description="View and manage all patient accounts."
    />
  );
}

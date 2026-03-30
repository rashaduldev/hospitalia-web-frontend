import UsersPage from "@/components/admin/users/UsersPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - Hospitals",
  description: "View and manage hospital accounts.",
};

export default async function AdminHospitalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <UsersPage
      lang={locale}
      basePath="/admin/hospitals"
      fixedUserType="HOSPITAL"
      title="Hospital Management"
      description="View and manage all hospital accounts."
    />
  );
}

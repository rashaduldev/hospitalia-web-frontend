import UsersPage from "@/components/admin/users/UsersPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - Doctors",
  description: "View and manage doctor accounts.",
};

export default async function AdminDoctorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <UsersPage
      lang={locale}
      basePath="/admin/doctors"
      fixedUserType="DOCTOR"
      title="Doctor Management"
      description="View and manage all doctor accounts."
    />
  );
}

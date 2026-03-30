import UsersPage from "@/components/admin/users/UsersPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - Admins",
  description: "View and manage admin users.",
};

export default async function AdminAdminsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <UsersPage
      lang={locale}
      basePath="/admin/admins"
      fixedUserType="ADMIN"
      title="Admin Management"
      description="View and manage all admin users."
    />
  );
}

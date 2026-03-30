import UsersPage from "@/components/admin/users/UsersPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - Secretaries",
  description: "View and manage secretary accounts.",
};

export default async function AdminSecretariesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <UsersPage
      lang={locale}
      basePath="/admin/secretaries"
      fixedUserType="SECRETARY"
      title="Secretary Management"
      description="View and manage all secretary accounts."
    />
  );
}

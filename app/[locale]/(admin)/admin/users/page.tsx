import UsersPage from "@/components/admin/users/UsersPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - User Management",
  description: "View and manage all platform users.",
};

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <UsersPage lang={locale} />;
}

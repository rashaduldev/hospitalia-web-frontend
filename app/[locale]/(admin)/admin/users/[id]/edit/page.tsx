import UserFormPage from "@/components/admin/users/UserFormPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - Edit User",
  description: "Update admin user details and role assignment.",
};

export default async function AdminEditUserPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return <UserFormPage lang={locale} userId={Number(id)} />;
}

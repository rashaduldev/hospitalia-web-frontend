import UserFormPage from "@/components/admin/users/UserFormPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - New Admin User",
  description: "Create a new admin user and assign a role.",
};

export default async function AdminNewUserPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <UserFormPage lang={locale} />;
}

import UserFormPage from "@/components/admin/users/UserFormPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - New Admin",
  description: "Create a new admin user.",
};

export default async function AdminNewAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <UserFormPage lang={locale} />;
}

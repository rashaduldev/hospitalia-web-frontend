import UserFormPage from "@/components/admin/users/UserFormPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - Edit Admin",
};

export default async function AdminEditAdminPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return <UserFormPage lang={locale} userId={Number(id)} />;
}

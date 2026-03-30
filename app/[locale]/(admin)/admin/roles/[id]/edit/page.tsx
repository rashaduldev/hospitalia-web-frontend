import RoleFormPage from "@/components/admin/roles/RoleFormPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - Edit Role",
  description: "Update role details and privilege assignments.",
};

export default async function AdminEditRolePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return <RoleFormPage lang={locale} roleId={Number(id)} />;
}

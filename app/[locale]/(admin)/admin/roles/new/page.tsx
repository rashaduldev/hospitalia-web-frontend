import RoleFormPage from "@/components/admin/roles/RoleFormPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - New Role",
  description: "Create a new role and assign privileges.",
};

export default async function AdminNewRolePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <RoleFormPage lang={locale} />;
}

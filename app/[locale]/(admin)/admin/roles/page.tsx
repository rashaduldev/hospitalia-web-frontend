import RolesPage from "@/components/admin/roles/RolesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - Roles & Permissions",
  description: "Manage roles and their privilege assignments.",
};

export default async function AdminRolesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <RolesPage lang={locale} />;
}

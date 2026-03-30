import RoleDetailPage from "@/components/admin/roles/RoleDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - Role Details",
  description: "View and manage role privileges.",
};

export default async function AdminRoleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return <RoleDetailPage lang={locale} roleId={Number(id)} />;
}

import UserDetailPage from "@/components/admin/users/UserDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - User Details",
  description: "View user profile, roles, and manage account status.",
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return <UserDetailPage lang={locale} userId={Number(id)} />;
}

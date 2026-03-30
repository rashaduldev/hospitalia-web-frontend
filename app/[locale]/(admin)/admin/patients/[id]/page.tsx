import UserDetailPage from "@/components/admin/users/UserDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - Patient Details",
};

export default async function AdminPatientDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return (
    <UserDetailPage lang={locale} userId={Number(id)} basePath="/admin/patients" />
  );
}

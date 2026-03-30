import UserDetailPage from "@/components/admin/users/UserDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - Doctor Details",
};

export default async function AdminDoctorDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return (
    <UserDetailPage lang={locale} userId={Number(id)} basePath="/admin/doctors" />
  );
}

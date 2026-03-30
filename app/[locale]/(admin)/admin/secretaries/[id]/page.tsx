import UserDetailPage from "@/components/admin/users/UserDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia Admin - Secretary Details",
};

export default async function AdminSecretaryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return (
    <UserDetailPage
      lang={locale}
      userId={Number(id)}
      basePath="/admin/secretaries"
    />
  );
}

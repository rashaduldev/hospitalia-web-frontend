import { getCurrentLocale } from "@/locales/server";
import { getCurrentUser } from "@/actions/user.actions";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import HospitalDoctorsManagePage from "@/components/pages/hospital/HospitalDoctorsManagePage";

export const metadata: Metadata = {
  title: "Hospitalia - Imported Doctors",
};

export default async function HospitalDoctorsPage() {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });

  if (!user) redirect("/hospital/login");

  return <HospitalDoctorsManagePage userId={user.id} lang={lang} />;
}

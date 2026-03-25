import { getCurrentLocale } from "@/locales/server";
import { getCurrentUser } from "@/actions/user.actions";
import { getHospitalsByUserId } from "@/actions/hospital/hospitaldata";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { HospitalInfo } from "@/types/hospital.type";
import HospitalDoctorsManagePage from "@/components/pages/hospital/HospitalDoctorsManagePage";

export const metadata: Metadata = {
  title: "Hospitalia - Doctors & Consultants",
};

export default async function HospitalDoctorsPage() {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });

  if (!user) redirect("/hospital/login");

  const res = await getHospitalsByUserId({ lang, userId: user.id });
  const hospitals: HospitalInfo[] = res?.payload?.content ?? [];

  return <HospitalDoctorsManagePage hospitals={hospitals} lang={lang} />;
}

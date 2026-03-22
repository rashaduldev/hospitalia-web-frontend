import { getCurrentLocale } from "@/locales/server";
import { getCurrentUser } from "@/actions/user.actions";
import { getHospitalsByUserId } from "@/actions/hospital/hospitaldata";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import HospitalsListPage from "@/components/pages/hospital/HospitalsListPage";
import { HospitalInfo } from "@/types/hospital.type";

export const metadata: Metadata = {
  title: "Hospitalia - Hospitals",
};

export default async function HospitalsPage() {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });

  if (!user) redirect("/hospital/login");

  const res = await getHospitalsByUserId({ lang, userId: user.id });
  const hospitals: HospitalInfo[] = res?.payload?.content ?? [];

  return <HospitalsListPage hospitals={hospitals} lang={lang} />;
}

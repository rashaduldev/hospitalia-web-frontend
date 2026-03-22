import { getCurrentLocale } from "@/locales/server";
import { getCurrentUser } from "@/actions/user.actions";
import { getHospitalById } from "@/actions/hospital/hospitaldata";
import { redirect, notFound } from "next/navigation";
import { Metadata } from "next";
import HospitalDetailPage from "@/components/pages/hospital/HospitalDetailPage";

export const metadata: Metadata = {
  title: "Hospitalia - Hospital",
};

export default async function HospitalDetailRoute({
  params,
}: {
  params: Promise<{ hospitalId: string }>;
}) {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });

  if (!user) redirect("/hospital/login");

  const { hospitalId } = await params;
  const res = await getHospitalById({ lang, id: Number(hospitalId) });

  if (!res?.success || !res.payload) notFound();

  return <HospitalDetailPage hospital={res.payload} lang={lang} />;
}

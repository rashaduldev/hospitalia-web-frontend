import HospitalDashboardPage from "@/components/pages/hospital/HospitalDashboardPage";
import { getCurrentUser } from "@/actions/user.actions";
import { getCurrentLocale } from "@/locales/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Hospital Dashboard",
  description: "Manage your hospital services and appointments.",
};

export default async function HospitalDashboard() {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });

  if (!user) redirect("/hospital/login");

  if (user.onboardingStatus === "REGISTERED") {
    redirect("/hospital/setup-profile");
  }

  return <HospitalDashboardPage hospitalId={user.id} lang={lang} />;
}

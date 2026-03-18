import { getCurrentUser } from "@/actions/user.actions";
import { ErrorHandle } from "@/components/common/ErrorHandle";
import Availability from "@/components/pages/doctor/availability/Availability";
import { getCurrentLocale } from "@/locales/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Set Availability",
  description: "Manage your schedule, locations, and availability for patient appointments.",
};

export default async function DoctorAvailabilityPage() {
  const lang = await getCurrentLocale();
  const res = await getCurrentUser({ lang });

  if (!res) {
    return <ErrorHandle message="Failed to load user information." status={401} />;
  }

  return <Availability userId={res.id} lang={lang} />;
}

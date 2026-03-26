import { Metadata } from "next";
import { getCurrentLocale } from "@/locales/server";
import { getCurrentUser } from "@/actions/user.actions";
import { getSecretaryByUserId } from "@/actions/secretary/secretary.actions";
import { ErrorHandle } from "@/components/common/ErrorHandle";
import Availability from "@/components/pages/doctor/availability/Availability";

export const metadata: Metadata = {
  title: "Hospitalia - Schedule",
  description: "Manage the doctor's schedule and availability slots.",
};

export default async function SecretarySchedulePage() {
  const lang = await getCurrentLocale();
  const res = await getCurrentUser({ lang });

  if (!res) {
    return <ErrorHandle message="Failed to load user information." status={401} />;
  }

  // Single fetch — API now returns doctorUserId directly
  const secretaryRes = await getSecretaryByUserId({ userId: res.id as number, lang });
  const doctorUserId = secretaryRes?.payload?.doctorUserId ?? 0;

  return <Availability userId={doctorUserId} lang={lang} />;
}

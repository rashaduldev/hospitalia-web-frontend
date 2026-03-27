import { Metadata } from "next";
import { getCurrentLocale } from "@/locales/server";
import { getDefaultTimeSlot } from "@/actions/doctor/slot";
import SecretarySchedulePage from "@/components/pages/secretary/SecretarySchedulePage";

export const metadata: Metadata = {
  title: "Hospitalia - Schedule",
  description: "Manage the doctor's schedule and availability slots.",
};

export default async function SecretaryScheduleRoutePage() {
  const lang = await getCurrentLocale();
  const timeSlotsRes = await getDefaultTimeSlot({ lang });

  return (
    <SecretarySchedulePage
      timeSlots={timeSlotsRes?.payload ?? []}
      lang={lang}
    />
  );
}

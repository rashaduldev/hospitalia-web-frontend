import DoctorLocationsPage from "@/components/pages/doctor/locations/DoctorLocationsPage";
import { getCurrentLocale } from "@/locales/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Locations",
  description: "Manage your clinic and hospital locations.",
};

export default async function DoctorLocations() {
  const lang = await getCurrentLocale();

  return <DoctorLocationsPage lang={lang} />;
}

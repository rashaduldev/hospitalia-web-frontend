import { getCurrentUser } from "@/actions/user.actions";
import { ErrorHandle } from "@/components/common/ErrorHandle";
import DoctorLocationsPage from "@/components/pages/doctor/locations/DoctorLocationsPage";
import { getCurrentLocale } from "@/locales/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Locations",
  description: "Manage your clinic and hospital locations.",
};

export default async function DoctorLocations() {
  const lang = await getCurrentLocale();
  const res = await getCurrentUser({ lang });

  if (!res) {
    return <ErrorHandle message="Failed to load user information." status={401} />;
  }

  return <DoctorLocationsPage doctorUserId={res.id} lang={lang} />;
}

import { getCurrentUser } from "@/actions/user.actions";
import { ErrorHandle } from "@/components/common/ErrorHandle";
import { getCurrentLocale } from "@/locales/server";
import { Metadata } from "next";
import DoctorProfilePage from "@/components/pages/doctor/DoctorProfilePage";

export const metadata: Metadata = {
  title: "Hospitalia - My Profile",
  description: "View your professional profile and practice details.",
};

export default async function DoctorProfile() {
  const lang = await getCurrentLocale();
  const res = await getCurrentUser({ lang });

  if (!res) {
    return <ErrorHandle message="Failed to load user information." status={401} />;
  }

  return (
    <DoctorProfilePage
      userId={res.id}
      lang={lang}
      mobileNumber={res.contactInfo?.mobileNumber ?? res.mobileNumber ?? ""}
      countryCode={res.contactInfo?.countryCode ?? res.countryCode ?? ""}
    />
  );
}

import { getCurrentUser } from "@/actions/user.actions";
import { getDoctorInfobyUserid } from "@/actions/doctor/doctordata";
import { getCurrentLocale } from "@/locales/server";
import { ErrorHandle } from "@/components/common/ErrorHandle";
import { OfflineBookingPage } from "@/components/pages/offline-booking/OfflineBookingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Book Offline Appointment",
};

export default async function DoctorOfflineBookingRoute() {
  const lang = await getCurrentLocale();
  const currentUser = await getCurrentUser({ lang });

  if (!currentUser) {
    return <ErrorHandle message="Failed to load user information." status={401} />;
  }

  const doctorInfoRes = await getDoctorInfobyUserid({
    lang,
    SignleDoctorUserId: currentUser.id,
  });
  const doctorId =
    doctorInfoRes?.payload?.id ?? doctorInfoRes?.payload?.doctorId;
  const doctorName = doctorInfoRes?.payload
    ? `${doctorInfoRes.payload.firstName} ${doctorInfoRes.payload.lastName}`
    : "";
  const doctorDesignation =
    doctorInfoRes?.payload?.professionalInfoResponse?.designation ?? "";

  return (
    <OfflineBookingPage
      doctorId={doctorId}
      bookedByUserId={currentUser.id}
      bookingSource="DOCTOR"
      doctorName={doctorName}
      doctorDesignation={doctorDesignation}
      lang={lang}
      backHref={`/${lang}/doctor/appointments`}
    />
  );
}

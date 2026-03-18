import { getDoctorInfobyUserid } from "@/actions/doctor/doctordata";
import Header from "@/components/pages/home/Header";
import { getCurrentLocale } from "@/locales/server";
import { getDoctorLocations } from "@/actions/doctor/location";
import { Location } from "@/types/doctor.location.type";
import { getDoctorUnAvailability } from "@/actions/doctor/unavailability";
import { getCurrentUser } from "@/actions/user.actions";
import { getAccessToken } from "@/actions/auth";
import BookingClientSection from "@/components/pages/booking/BookingClientSection";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Hospitalia - Book Appointment",
  description:
    "Book an appointment, View available locations, schedule, and more.",
};

type Props = {
  params: Promise<{ userId: string }>;
};

const DoctorBookingPage = async ({ params }: Props) => {
  const lang = await getCurrentLocale();
  const { userId } = await params;
  const currentUser = await getCurrentUser({ lang });
  const token = await getAccessToken();
  const SignleDoctorUserId = Number(userId);

  const singleDoctor = await getDoctorInfobyUserid({
    lang,
    SignleDoctorUserId,
  });
  const doctorUserId = singleDoctor?.payload?.userId;

  if (!doctorUserId) {
    notFound();
  }
  const doctorLocations = await getDoctorLocations({ lang, doctorUserId });
  const doctorUnAvailable = await getDoctorUnAvailability({
    lang,
    doctorUserId,
  });

  const locationOptions =
    doctorLocations?.payload?.map((item: Location) => ({
      label: item.locationName,
      value: item.locationId,
    })) || [];
  const locations = doctorLocations?.payload || [];
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto p-8">
        <BookingClientSection
          doctor={singleDoctor?.payload}
          doctorLocations={locations}
          locationOptions={locationOptions}
          lang={lang}
          token={token}
          currentUserId={currentUser?.id}
          doctorUnAvailable={doctorUnAvailable?.payload?.content || []}
        />
      </div>
    </div>
  );
};

export default DoctorBookingPage;

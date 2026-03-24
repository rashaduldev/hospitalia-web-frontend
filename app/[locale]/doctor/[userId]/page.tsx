import { getDoctorInfoByDoctorId } from "@/actions/doctor/doctordata";
import Header from "@/components/pages/home/Header";
import FooterSection from "@/components/common/Footer";
import { getCurrentLocale } from "@/locales/server";
import { getDoctorLocationsByDoctorId } from "@/actions/doctor/location";
import { Location } from "@/types/doctor.location.type";
import { getDoctorUnAvailabilityByDoctorId } from "@/actions/doctor/unavailability";
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
  const doctorId = Number(userId);

  const singleDoctor = await getDoctorInfoByDoctorId({ lang, doctorId });

  if (!singleDoctor?.payload) {
    notFound();
  }
  const doctorLocations = await getDoctorLocationsByDoctorId({ lang, doctorId });
  const doctorUnAvailable = await getDoctorUnAvailabilityByDoctorId({ lang, doctorId });

  const locationOptions =
    doctorLocations?.payload?.map((item: Location) => ({
      label: item.locationName.length > 60 ? item.locationName.slice(0, 60) + "…" : item.locationName,
      value: item.locationId,
    })) || [];
  const locations = doctorLocations?.payload || [];
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <BookingClientSection
          doctor={singleDoctor?.payload}
          doctorId={doctorId}
          doctorLocations={locations}
          locationOptions={locationOptions}
          lang={lang}
          token={token}
          currentUserId={currentUser?.id}
          doctorUnAvailable={doctorUnAvailable?.payload?.content || []}
        />
      </div>
      <FooterSection />
    </div>
  );
};

export default DoctorBookingPage;

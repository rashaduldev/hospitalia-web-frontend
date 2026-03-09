import { getAllDoctor } from "@/actions/doctor/doctordata";
import Header from "@/components/pages/home/Header";
import { getCurrentLocale } from "@/locales/server";
import { getDoctorLocations } from "@/actions/doctor/location";
import { Location } from "@/types/doctor.location.type";
import { NewUser } from "@/types/user.type";
import { getDoctorUnAvailability } from "@/actions/doctor/unavailability";
import { getCurrentUser } from "@/actions/user.actions";
import { getAccessToken } from "@/actions/auth";
import BookingClientSection from "@/components/pages/booking/BookingClientSection";

type Props = {
  params: Promise<{ userId: string }>;
};

const DoctorBookingPage = async ({ params }: Props) => {
  const lang = await getCurrentLocale();
  const { userId } = await params;
  const currentUser = await getCurrentUser({ lang });
  const token = await getAccessToken();

  const doctorData = await getAllDoctor({ lang });
  const doctors = doctorData?.payload?.content || [];

  const doctor = doctors.find(
    (doc: NewUser) => doc?.userId?.toString() === userId,
  );
  const doctorUserId = doctor.userId;
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
          doctor={doctor}
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

import { getAllDoctor } from "@/actions/doctor/doctordata";
import Header from "@/components/pages/home/Header";
import { getCurrentLocale } from "@/locales/server";
import { Typography } from "@/components/ui/Typography";
import doctorMale from "../../../../public/assets/doctor_male.jpg";
import doctorFemale from "../../../../public/assets/doctor_female.jpg";
import Image from "next/image";
import { MapPin, UserPlus } from "lucide-react";
import { getDoctorLocations } from "@/actions/doctor/location";
import { Location } from "@/types/doctor.location.type";
import { Speciality } from "@/types/speciality.type";
import { UserType } from "@/types/user.type";
import DoctorBooking from "@/components/pages/doctor-booking/DoctorBooking";
import { getDoctorUnAvailability } from "@/actions/doctor/unavailability";
import { getCurrentUser } from "@/actions/user.actions";
import { getAccessToken } from "@/actions/auth";

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
    (doc: UserType) => doc?.userId?.toString() === userId,
  );
  const doctorUserId = doctor.userId;
  const doctorLocations = await getDoctorLocations({ lang, doctorUserId });
  const doctorUnAvailable = await getDoctorUnAvailability({
    lang,
    doctorUserId,
  });

  const profileImage = doctor?.profileImage
    ? doctor.profileImage
    : doctor?.gender === "MALE"
      ? doctorMale
      : doctorFemale;

  const locationOptions =
    doctorLocations?.payload?.map((item: Location) => ({
      label: item.locationName,
      value: item.locationId,
    })) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex flex-col md:flex-row items-start max-w-6xl mx-auto p-8 gap-4">
        <div className="text-center border px-9 py-7 rounded-lg flex-1">
          {/* doctor profile info */}
          <div className="space-y-3 border-b pb-6">
            <Image
              className="rounded-full mx-auto"
              src={profileImage}
              alt="Doctor Profile Image"
              height={148}
              width={148}
            />
            <Typography as="h2" size="xl" weight="semiBold">
              {doctor.firstName} {doctor.lastName}
            </Typography>
            <Typography as="h3" size="xs" color="muted_foreground">
              {doctor.professionalInfoResponse?.designation}
            </Typography>
            <Typography as="h3" size="xs" color="muted_foreground">
              {doctor.professionalInfoResponse?.specialities?.length &&
                doctor.professionalInfoResponse.specialities
                  .map((item: Speciality) => item.name)
                  .join(", ")}
            </Typography>
          </div>
          {/* Specialist  */}
          <div className="text-center py-6 border-b">
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <div className="p-2.5 bg-primary/10 rounded-lg">
                <UserPlus size={24} className="text-primary h-6 w-6" />
              </div>
              <Typography size="xl" weight="semiBold">
                Specialist in
              </Typography>
            </div>
            <div className="space-y-1">
              <Typography as="h3" size="xs" color="muted_foreground">
                {doctor.professionalInfoResponse?.specialities?.length &&
                  doctor.professionalInfoResponse.specialities
                    .map((item: Speciality) => item.name)
                    .join(", ")}
              </Typography>
              <Typography as="h3" size="xs" color="muted_foreground">
                {doctor.professionalInfoResponse?.departments}
              </Typography>
            </div>
          </div>
          {/* Chambers */}
          <div className="text-center py-6 space-y-6">
            <div className="flex items-center justify-center gap-2.5">
              <div className="p-2.5 bg-primary/10 rounded-lg">
                <MapPin size={24} className="text-primary h-6 w-6" />
              </div>
              <Typography size="xl" weight="semiBold">
                Chambers
              </Typography>
            </div>
            <div className="space-y-1">
              <Typography
                as="h3"
                size="xs"
                color="muted_foreground"
                className="wrap-break-word"
              >
                {doctorLocations &&
                  doctorLocations.payload
                    .map((item: Location) => item.locationName)
                    .join(", ")}
              </Typography>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 justify-center">
              <Typography className="py-2 rounded-sm bg-secondary text-muted text-sm px-2">
                New Patient: 25,000 CFA
              </Typography>
              <Typography className="py-2 rounded-sm bg-primary text-muted text-sm px-2">
                Returning Patient: 10,000 CFA
              </Typography>
            </div>
            <Typography
              color="foreground"
              className="py-2 bg-primary/20 px-10 rounded-sm leading-4 text-[0.625rem]"
            >
              AVAILABLE ON REQUEST: Confirmation of availability may need
              further processing of your request with the doctor.
            </Typography>
          </div>
        </div>
        <div className="border rounded-lg p-6 text-center space-y-4 flex-1">
          <DoctorBooking
            lang={lang}
            token={token}
            currentUserId={currentUser?.id}
            doctorUserId={doctorUserId}
            locationOptions={locationOptions}
            doctorUnAvailable={doctorUnAvailable?.payload?.content}
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorBookingPage;

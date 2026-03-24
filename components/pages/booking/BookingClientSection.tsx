"use client";

import DoctorProfile from "./DoctorProfile";
import DoctorBooking from "../doctor-booking/DoctorBooking";
import { DoctorLocation, LocationOption } from "@/types/doctor.location.type";
import { UnavailableDate } from "@/types/doctor.unavailable";
import { SingleDoctorInfo } from "@/types/doctor";

const BookingClientSection = ({
  doctor,
  doctorId,
  doctorLocations,
  locationOptions,
  lang,
  token,
  currentUserId,
  doctorUnAvailable,
}: {
  doctor: SingleDoctorInfo;
  doctorId: number;
  doctorLocations: DoctorLocation[];
  locationOptions: LocationOption[];
  lang: string;
  token: string | null;
  currentUserId: number;
  doctorUnAvailable: UnavailableDate[];
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start gap-4">
      <div className="w-full md:w-3/5">
        <DoctorProfile doctor={doctor} doctorLocations={doctorLocations} />
      </div>
      <div className="w-full md:w-2/5">
        <DoctorBooking
          lang={lang}
          doctor={doctor}
          doctorId={doctorId}
          locationOptions={locationOptions}
          doctorLocations={doctorLocations}
          token={token}
          currentUserId={currentUserId}
          doctorUnAvailable={doctorUnAvailable}
        />
      </div>
    </div>
  );
};

export default BookingClientSection;

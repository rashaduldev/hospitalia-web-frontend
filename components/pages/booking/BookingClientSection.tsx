"use client";

import { useState } from "react";
import DoctorProfile from "./DoctorProfile";
import { Typography } from "@/components/ui/Typography";
import DoctorBooking from "../doctor-booking/DoctorBooking";
import { DoctorLocation, LocationOption } from "@/types/doctor.location.type";
import { UnavailableDate } from "@/types/doctor.unavailable";
import { SingleDoctorInfo } from "@/types/doctor";

const BookingClientSection = ({
  doctor,
  doctorLocations,
  locationOptions,
  lang,
  token,
  currentUserId,
  doctorUnAvailable,
}: {
  doctor: SingleDoctorInfo;
  doctorLocations: DoctorLocation[];
  locationOptions: LocationOption[];
  lang: string;
  token: string | null;
  currentUserId: number;
  doctorUnAvailable: UnavailableDate[];
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  if (isSuccess && bookingInfo) {
    return (
      <div className="mt-14 bg-background p-4 text-center space-y-6">
        <div className="border max-w-158.25 w-full mx-auto rounded-sm p-6">
          <Typography
            size="3xl"
            weight="bold"
            color="secondary"
            className="mb-6"
          >
            Appointment Booked Successfully
          </Typography>

          <div className="w-full border rounded-sm p-6 text-left space-y-6">
            <Typography size="xl" weight="bold" color="foreground">
              Appointment Summary
            </Typography>
            <Typography size="sm">
              <strong>Doctor-</strong>{" "}
              <span className="text-muted-foreground">
                {bookingInfo.doctorName}
              </span>
            </Typography>
            <Typography size="sm">
              <strong>Designation:</strong>{" "}
              <span className="text-muted-foreground">
                {bookingInfo.designation}
              </span>
            </Typography>
            <Typography size="sm">
              <strong>Location:</strong>{" "}
              <span className="text-muted-foreground">
                {bookingInfo.location}
              </span>
            </Typography>
            <Typography size="sm">
              <strong>Date:</strong>{" "}
              <span className="text-muted-foreground">{bookingInfo.date}</span>
            </Typography>
            <Typography size="sm">
              <strong>Time:</strong>{" "}
              <span className="text-muted-foreground">
                {bookingInfo.startTime} - {bookingInfo.endTime}
              </span>
            </Typography>
            <Typography size="sm">
              <strong>Price:</strong>{" "}
              <span className="text-muted-foreground">{bookingInfo.price}</span>
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-start gap-4">
      <DoctorProfile doctor={doctor} doctorLocations={doctorLocations} />
      <DoctorBooking
        lang={lang}
        doctor={doctor}
        locationOptions={locationOptions}
        token={token}
        currentUserId={currentUserId}
        doctorUnAvailable={doctorUnAvailable}
        onBookingSuccess={(info) => {
          setBookingInfo(info);
          setIsSuccess(true);
        }}
      />
    </div>
  );
};
export default BookingClientSection;

"use client";

import { useState } from "react";
import DoctorProfile from "./DoctorProfile";
import { Typography } from "@/components/ui/Typography";
import AppButton from "@/components/common/AppButton";
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center space-y-6">
        <Typography size="3xl" weight="bold" color="secondary">
          Appointment Booked Successfully
        </Typography>

        <div className="w-full max-w-md border rounded-lg p-6 bg-muted-foreground/10 text-left space-y-3">
          <Typography size="xl" weight="semiBold" className="border-b pb-2">
            Appointment Summary
          </Typography>
          <Typography size="sm">
            <strong>Doctor:</strong> {bookingInfo.doctorName}
          </Typography>
          <Typography size="sm">
            <strong>Designation:</strong> {bookingInfo.designation}
          </Typography>
          <Typography size="sm">
            <strong>Location:</strong> {bookingInfo.location}
          </Typography>
          <Typography size="sm">
            <strong>Date:</strong> {bookingInfo.date}
          </Typography>
          <Typography size="sm">
            <strong>Time:</strong> {bookingInfo.startTime} -{" "}
            {bookingInfo.endTime}
          </Typography>
          <Typography size="sm">
            <strong>Price:</strong> {bookingInfo.price}
          </Typography>
        </div>

        <AppButton
          className="mt-4 w-full max-w-xs"
          onClick={() => window.location.reload()}
        >
          Back to Home
        </AppButton>
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

"use client";

import { useState } from "react";
import DoctorProfile from "./DoctorProfile";
import DoctorBooking from "../doctor-booking/DoctorBooking";
import { DoctorLocation, LocationOption } from "@/types/doctor.location.type";
import { UnavailableDate } from "@/types/doctor.unavailable";
import { SingleDoctorInfo } from "@/types/doctor";
import { CheckCircle2, User, Briefcase, MapPin, CalendarDays, Clock, Banknote } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <div className="p-1.5 bg-primary/10 rounded-md shrink-0 mt-0.5">
      <Icon className="w-3.5 h-3.5 text-primary" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
    </div>
  </div>
);

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
      <div className="flex items-center justify-center py-12 px-4">
        <div className="border border-border rounded-xl bg-card shadow-sm w-full max-w-md overflow-hidden">
          {/* Success header */}
          <div className="flex flex-col items-center text-center px-6 pt-8 pb-6 bg-secondary/5">
            <div className="p-3 bg-secondary/15 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Appointment Booked!</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your request has been submitted successfully.
            </p>
          </div>

          <Separator />

          {/* Summary */}
          <div className="px-6 py-6 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Appointment Summary
            </p>
            <InfoRow icon={User} label="Doctor" value={bookingInfo.doctorName} />
            {bookingInfo.designation && (
              <InfoRow icon={Briefcase} label="Designation" value={bookingInfo.designation} />
            )}
            <InfoRow icon={MapPin} label="Location" value={bookingInfo.location} />
            <InfoRow icon={CalendarDays} label="Date" value={bookingInfo.date} />
            <InfoRow icon={Clock} label="Time" value={`${bookingInfo.startTime} – ${bookingInfo.endTime}`} />
            <InfoRow icon={Banknote} label="Consultation Fee" value={bookingInfo.price} />
          </div>

          <Separator />

          <div className="px-6 py-5 flex flex-col gap-2">
            <p className="text-[11px] text-muted-foreground text-center">
              Availability is subject to confirmation by the doctor.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/patient/appointments">View My Appointments</Link>
            </Button>
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

"use client";

import { useState } from "react";
import DoctorProfile from "./DoctorProfile";
import DoctorBooking from "../doctor-booking/DoctorBooking";
import { DoctorLocation, LocationOption } from "@/types/doctor.location.type";
import { UnavailableDate } from "@/types/doctor.unavailable";
import { SingleDoctorInfo } from "@/types/doctor";
import { CheckCircle2, CalendarDays, Clock, MapPin, Banknote, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SectionHeading = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <div className="flex items-center gap-2.5 mb-4">
    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <span className="text-sm font-semibold text-foreground">{label}</span>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border last:border-0">
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">{label}</p>
    <p className="text-sm font-medium text-foreground text-right break-all">{value}</p>
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
      <div className="flex flex-col md:flex-row items-start gap-4">
        <div className="w-full md:w-3/5">
          <DoctorProfile doctor={doctor} doctorLocations={doctorLocations} />
        </div>
        <div className="w-full md:w-2/5">
          <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
            {/* Success header */}
            <div className="flex flex-col items-center text-center px-6 pt-8 pb-6 bg-secondary/5 border-b border-border">
              <div className="p-3 bg-secondary/15 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-base font-bold text-foreground">Appointment Booked!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your request has been submitted successfully.
              </p>
            </div>

            {/* Summary */}
            <div className="px-6 py-6">
              <SectionHeading icon={CalendarDays} label="Appointment Summary" />
              <div>
                <DetailRow label="Doctor" value={bookingInfo.doctorName} />
                {bookingInfo.designation && (
                  <DetailRow label="Designation" value={bookingInfo.designation} />
                )}
                <DetailRow label="Location" value={bookingInfo.location} />
                <DetailRow label="Date" value={bookingInfo.date} />
                <DetailRow label="Time" value={`${bookingInfo.startTime} – ${bookingInfo.endTime}`} />
                <DetailRow label="Fee" value={bookingInfo.price} />
              </div>
            </div>

            <Separator />

            {/* Note + CTA */}
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-start gap-2 rounded-lg bg-muted/60 border border-border px-4 py-3">
                <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Availability is subject to confirmation by the doctor.
                </p>
              </div>
              <Button asChild className="w-full font-semibold h-11">
                <Link href="/patient/dashboard">View My Appointments</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-start gap-4">
      <div className="w-full md:w-3/5">
        <DoctorProfile doctor={doctor} doctorLocations={doctorLocations} />
      </div>
      <div className="w-full md:w-2/5">
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
    </div>
  );
};
export default BookingClientSection;

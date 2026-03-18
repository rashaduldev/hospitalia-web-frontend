"use client";

import { useQuery } from "@tanstack/react-query";
import { getDoctorInfobyUserid } from "@/actions/doctor/doctordata";
import { getDoctorLocations } from "@/actions/doctor/location";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Stethoscope,
  MapPin,
  Mail,
  Phone,
  CalendarDays,
  Briefcase,
  Hash,
} from "lucide-react";
import { Speciality } from "@/types/speciality.type";
import { Location } from "@/types/doctor.location.type";

const SectionHeading = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <div className="flex items-center gap-2.5 mb-4">
    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <span className="text-sm font-semibold text-foreground">{label}</span>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border last:border-0">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">{label}</p>
      <p className="text-sm font-medium text-foreground text-right break-all">{value}</p>
    </div>
  );
};

export default function DoctorProfilePage({
  userId,
  lang,
}: {
  userId: number;
  lang: string;
}) {
  const { data: doctorData, isLoading: loadingDoctor } = useQuery({
    queryKey: ["doctorProfile", userId],
    queryFn: () => getDoctorInfobyUserid({ lang, SignleDoctorUserId: userId }),
  });

  const { data: locationsData, isLoading: loadingLocations } = useQuery({
    queryKey: ["doctor-locations", userId],
    queryFn: () => getDoctorLocations({ lang, doctorUserId: userId }),
  });

  const doctor = doctorData?.payload;
  const locations: Location[] = locationsData?.payload || [];
  const specialities: Speciality[] = doctor?.professionalInfoResponse?.specialities ?? [];

  if (loadingDoctor || loadingLocations) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="p-6 space-y-4">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!doctor) return null;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl">
      {/* Personal Info */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">Personal Information</h2>
            <p className="text-xs text-muted-foreground mt-1">Your account details</p>
          </div>
        </div>
        <div className="px-6 py-4">
          <InfoRow label="Full Name" value={`${doctor.firstName} ${doctor.lastName}`} />
          <InfoRow label="Gender" value={doctor.gender} />
          <InfoRow label="Email" value={doctor.email} />
          <InfoRow label="Phone" value={doctor.mobileNumber ? `+${doctor.countryCode} ${doctor.mobileNumber}` : undefined} />
          <InfoRow label="Date of Birth" value={doctor.dateOfBirth} />
        </div>
      </div>

      {/* Professional Info */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
            <Stethoscope className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">Professional Information</h2>
            <p className="text-xs text-muted-foreground mt-1">Your credentials and specialisation</p>
          </div>
        </div>
        <div className="px-6 py-4">
          <InfoRow label="Designation" value={doctor.professionalInfoResponse?.designation} />
          <InfoRow label="ONMS Number" value={doctor.professionalInfoResponse?.onmsRegistrationNumber} />
          {specialities.length > 0 && (
            <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">Specialities</p>
              <div className="flex flex-wrap justify-end gap-1.5">
                {specialities.map((s) => (
                  <Badge key={s.id} variant="secondary" className="text-xs text-white">
                    {s.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {doctor.professionalInfoResponse?.professionalStatement && (
            <div className="py-2.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Professional Statement</p>
              <p className="text-sm text-foreground leading-relaxed">
                {doctor.professionalInfoResponse.professionalStatement}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Locations */}
      {locations.length > 0 && (
        <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-none">Practice Locations</h2>
              <p className="text-xs text-muted-foreground mt-1">Chambers where you see patients</p>
            </div>
          </div>
          <div className="px-6 py-4 space-y-3">
            {locations.map((loc) => (
              <div key={loc.locationId} className="border-b border-border last:border-0 pb-3 last:pb-0">
                <p className="text-sm font-medium text-foreground break-all">{loc.locationName}</p>
                {loc.addressLine1 && (
                  <p className="text-xs text-muted-foreground mt-0.5 break-all">{loc.addressLine1}</p>
                )}
                {(loc.city || loc.postalCode) && (
                  <p className="text-xs text-muted-foreground/80">
                    {loc.city}{loc.postalCode ? ` — ${loc.postalCode}` : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

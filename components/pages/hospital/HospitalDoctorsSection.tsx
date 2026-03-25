"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  MapPin,
  Clock,
  BadgeCheck,
  CalendarCheck,
  Users,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SingleDoctorInfo } from "@/types/doctor";

export type EnrichedHospitalDoctor = {
  doctorId: number;
  locations: string[];
  profile: SingleDoctorInfo | null;
};

const ALL = "__all__";

function getInitials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

function DoctorCard({
  doctor,
  lang,
}: {
  doctor: EnrichedHospitalDoctor;
  lang: string;
}) {
  const p = doctor.profile;
  const firstName = p?.firstName ?? "";
  const lastName = p?.lastName ?? "";
  const fullName = p ? `${firstName} ${lastName}`.trim() : "Unknown Doctor";
  const designation = p?.professionalInfoResponse?.designation ?? "";
  const specialities = p?.professionalInfoResponse?.specialities ?? [];
  const experience = p?.yearsOfExperience;
  const qualification = p?.qualification;
  const isVerified = p?.verified;
  const profileHref = `/${lang}/doctor/${doctor.doctorId}`;

  return (
    <div className="group border border-border rounded-xl bg-card shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary/60 to-primary" />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Avatar + Name block */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0 text-primary font-bold text-base">
            {getInitials(firstName, lastName)}
          </div>

          <div className="flex-1 min-w-0">
            <Link
              href={profileHref}
              className="block font-bold text-foreground text-base leading-snug hover:text-primary transition-colors truncate"
            >
              Dr. {fullName}
            </Link>

            {designation && (
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {designation}
              </p>
            )}

            {isVerified && (
              <div className="flex items-center gap-1 mt-1">
                <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs text-primary font-medium">Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Specialities */}
        {specialities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {specialities.slice(0, 3).map((s) => (
              <Badge
                key={s.id}
                variant="secondary"
                className="text-xs font-medium text-white px-2 py-0.5"
              >
                {s.name}
              </Badge>
            ))}
            {specialities.length > 3 && (
              <span className="text-xs text-muted-foreground self-center">
                +{specialities.length - 3} more
              </span>
            )}
          </div>
        )}

        <Separator />

        {/* Meta: location, experience, qualification */}
        <div className="space-y-1.5 text-sm">
          {doctor.locations.length > 0 && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-secondary" />
              <span className="leading-snug line-clamp-2">
                {doctor.locations.join(" · ")}
              </span>
            </div>
          )}

          {experience != null && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-3.5 h-3.5 shrink-0 text-primary" />
              <span>
                {experience} year{experience !== 1 ? "s" : ""} experience
              </span>
            </div>
          )}

          {qualification && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <Stethoscope className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
              <span className="leading-snug line-clamp-2">{qualification}</span>
            </div>
          )}
        </div>
      </div>

      {/* Book button */}
      <div className="px-5 pb-5">
        <Button asChild size="sm" className="w-full gap-2 font-semibold">
          <Link href={profileHref}>
            <CalendarCheck className="w-4 h-4" />
            Book Appointment
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function HospitalDoctorsSection({
  doctors,
  lang,
}: {
  doctors: EnrichedHospitalDoctor[];
  lang: string;
}) {
  const [specialityFilter, setSpecialityFilter] = useState(ALL);
  const [locationFilter, setLocationFilter] = useState(ALL);

  // Derive unique filter options from the data
  const specialityOptions = useMemo(() => {
    const seen = new Map<number, string>();
    for (const d of doctors) {
      for (const s of d.profile?.professionalInfoResponse?.specialities ?? []) {
        if (!seen.has(s.id)) seen.set(s.id, s.name);
      }
    }
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [doctors]);

  const locationOptions = useMemo(() => {
    const seen = new Set<string>();
    for (const d of doctors) {
      for (const loc of d.locations) seen.add(loc);
    }
    return Array.from(seen);
  }, [doctors]);

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchesSpeciality =
        specialityFilter === ALL ||
        d.profile?.professionalInfoResponse?.specialities?.some(
          (s) => String(s.id) === specialityFilter,
        );

      const matchesLocation =
        locationFilter === ALL || d.locations.includes(locationFilter);

      return matchesSpeciality && matchesLocation;
    });
  }, [doctors, specialityFilter, locationFilter]);

  const hasActiveFilter = specialityFilter !== ALL || locationFilter !== ALL;

  if (doctors.length === 0) return null;

  return (
    <section className="mt-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground leading-none">
            Our Doctors &amp; Consultants
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} of {doctors.length} doctor
            {doctors.length !== 1 ? "s" : ""} shown
          </p>
        </div>
      </div>

      {/* Filter bar */}
      {(specialityOptions.length > 0 || locationOptions.length > 0) && (
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-muted/40 rounded-xl border border-border">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
            Filter by
          </div>

          {specialityOptions.length > 0 && (
            <Select value={specialityFilter} onValueChange={setSpecialityFilter}>
              <SelectTrigger className="h-8 w-auto min-w-[160px] bg-background text-sm">
                <SelectValue placeholder="All Specialities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Specialities</SelectItem>
                {specialityOptions.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {locationOptions.length > 0 && (
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="h-8 w-auto min-w-[160px] bg-background text-sm">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Locations</SelectItem>
                {locationOptions.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {hasActiveFilter && (
            <button
              onClick={() => {
                setSpecialityFilter(ALL);
                setLocationFilter(ALL);
              }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doctor) => (
            <DoctorCard key={doctor.doctorId} doctor={doctor} lang={lang} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center border border-border rounded-xl bg-card">
          <Users className="w-10 h-10 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">
            No doctors match the selected filters
          </p>
          <button
            onClick={() => {
              setSpecialityFilter(ALL);
              setLocationFilter(ALL);
            }}
            className="text-xs text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}

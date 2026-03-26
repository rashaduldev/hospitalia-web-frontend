"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  BedDouble,
  CalendarDays,
  Globe,
  Phone,
  BadgeCheck,
  BookOpen,
  Stethoscope,
  MapPin,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HospitalInfo } from "@/types/hospital.type";
import ManageDoctors from "./ManageDoctors";
import ManageLocations from "./ManageLocations";

const HOSPITAL_TYPE_LABELS: Record<string, string> = {
  GENERAL: "General Hospital",
  SPECIALTY: "Specialty Hospital",
  TEACHING: "Teaching Hospital",
  CLINIC: "Clinic",
  POLYCLINIC: "Polyclinic",
  DIAGNOSTIC: "Diagnostic Center",
  REHABILITATION: "Rehabilitation Center",
  MATERNITY: "Maternity Hospital",
  CHILDREN: "Children's Hospital",
  OTHER: "Other",
};

type Tab = "overview" | "doctors" | "locations";

function InfoItem({ icon: Icon, label, value, href }: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="p-1.5 bg-muted rounded-md shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline truncate block">
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium text-foreground">{value}</p>
        )}
      </div>
    </div>
  );
}

function OverviewTab({ hospital }: { hospital: HospitalInfo }) {
  const p = hospital.professionalInfoResponse;
  const typeLabel = hospital.hospitalType
    ? (HOSPITAL_TYPE_LABELS[hospital.hospitalType] ?? hospital.hospitalType)
    : null;
  const specialities = p?.specialities ?? [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Details */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/30">
          <h3 className="text-sm font-semibold text-foreground">Hospital Details</h3>
        </div>
        <div className="px-5">
          {typeLabel && (
            <InfoItem icon={Building2} label="Type" value={typeLabel} />
          )}
          {hospital.numberOfBeds && (
            <InfoItem icon={BedDouble} label="Number of Beds" value={`${hospital.numberOfBeds} beds`} />
          )}
          {hospital.foundedYear && (
            <InfoItem icon={CalendarDays} label="Founded" value={String(hospital.foundedYear)} />
          )}
          {p?.onmsRegistrationNumber && (
            <InfoItem icon={BadgeCheck} label="Registration Number" value={p.onmsRegistrationNumber} />
          )}
          {hospital.workPhoneNumber && (
            <InfoItem icon={Phone} label="Work Phone" value={hospital.workPhoneNumber} />
          )}
          {hospital.websiteUrl && (
            <InfoItem icon={Globe} label="Website" value={hospital.websiteUrl} href={hospital.websiteUrl} />
          )}
          {!typeLabel && !hospital.numberOfBeds && !hospital.foundedYear && !p?.onmsRegistrationNumber && !hospital.workPhoneNumber && !hospital.websiteUrl && (
            <p className="py-8 text-sm text-muted-foreground text-center">No details added yet.</p>
          )}
        </div>
      </div>

      {/* About + Specialities */}
      <div className="space-y-6">
        {p?.professionalStatement && (
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">About</h3>
            </div>
            <p className="px-5 py-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {p.professionalStatement}
            </p>
          </div>
        )}

        {specialities.length > 0 && (
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Specialities</h3>
            </div>
            <div className="px-5 py-4 flex flex-wrap gap-1.5">
              {specialities.map((s) => (
                <Badge key={s.id} variant="secondary" className="text-xs text-white">
                  {s.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HospitalDetailPage({
  hospital,
  lang,
  userId,
}: {
  hospital: HospitalInfo;
  lang: string;
  userId: number;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Overview", icon: Building2 },
    { key: "doctors", label: "Doctors", icon: Stethoscope },
    { key: "locations", label: "Locations", icon: MapPin },
  ];

  return (
    <div className="py-6 space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => router.push("/hospital/hospitals")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hospitals
          </button>
          <h1 className="text-xl font-bold text-foreground">
            {hospital.hospitalName ?? "Unnamed Hospital"}
          </h1>
          {hospital.hospitalType && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {HOSPITAL_TYPE_LABELS[hospital.hospitalType] ?? hospital.hospitalType}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => router.push(`/hospital/hospitals/${hospital.id}/edit`)}
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "overview" && (
          <OverviewTab hospital={hospital} />
        )}
        {activeTab === "doctors" && (
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <div className="px-6 py-5 border-b border-border bg-muted/30 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Doctors</h3>
            </div>
            <div className="p-6">
              <ManageDoctors hospitalId={hospital.id} lang={lang} userId={userId} />
            </div>
          </div>
        )}
        {activeTab === "locations" && (
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <div className="px-6 py-5 border-b border-border bg-muted/30 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Locations</h3>
            </div>
            <div className="p-6">
              <ManageLocations hospitalId={hospital.id} lang={lang} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

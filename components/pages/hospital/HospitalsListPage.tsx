"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Plus,
  BedDouble,
  CalendarDays,
  Globe,
  Phone,
  Pencil,
  Trash2,
  BadgeCheck,
  Loader2,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HospitalInfo } from "@/types/hospital.type";
import { deleteHospital } from "@/actions/hospital/hospitaldata";
import { useCurrentLocale } from "@/locales/client";
import { toast } from "sonner";

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

function HospitalCard({
  hospital,
  onManage,
  onEdit,
  onDelete,
  deleting,
}: {
  hospital: HospitalInfo;
  onManage: (h: HospitalInfo) => void;
  onEdit: (h: HospitalInfo) => void;
  onDelete: (h: HospitalInfo) => void;
  deleting: boolean;
}) {
  const p = hospital.professionalInfoResponse;
  const typeLabel = hospital.hospitalType
    ? (HOSPITAL_TYPE_LABELS[hospital.hospitalType] ?? hospital.hospitalType)
    : null;
  const specialities = p?.specialities ?? [];

  return (
    <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden flex flex-col">
      {/* Card header */}
      <div className="flex items-start gap-4 px-5 pt-5 pb-4">
        <div className="p-3 bg-primary/10 rounded-xl shrink-0">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-foreground leading-snug truncate">
            {hospital.hospitalName ?? "Unnamed Hospital"}
          </h3>
          {typeLabel && (
            <Badge variant="secondary" className="mt-1.5 text-xs text-white">
              {typeLabel}
            </Badge>
          )}
          {p?.onmsRegistrationNumber && (
            <p className="flex items-center gap-1 text-xs text-primary mt-1.5">
              <BadgeCheck className="w-3 h-3 shrink-0" />
              Reg. {p.onmsRegistrationNumber}
            </p>
          )}
        </div>
      </div>

      {/* Stats row */}
      {(hospital.numberOfBeds || hospital.foundedYear || hospital.websiteUrl || hospital.workPhoneNumber) && (
        <div className="flex flex-wrap items-center gap-4 px-5 py-3 border-t border-border bg-muted/30">
          {hospital.numberOfBeds && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BedDouble className="w-3.5 h-3.5 shrink-0" />
              <span>{hospital.numberOfBeds} beds</span>
            </div>
          )}
          {hospital.foundedYear && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="w-3.5 h-3.5 shrink-0" />
              <span>Est. {hospital.foundedYear}</span>
            </div>
          )}
          {hospital.websiteUrl && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <a
                href={hospital.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate max-w-[120px]"
              >
                Website
              </a>
            </div>
          )}
          {hospital.workPhoneNumber && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{hospital.workPhoneNumber}</span>
            </div>
          )}
        </div>
      )}

      {/* Specialities */}
      {specialities.length > 0 && (
        <div className="px-5 py-3 border-t border-border flex flex-wrap gap-1.5">
          {specialities.slice(0, 4).map((s) => (
            <Badge key={s.id} variant="outline" className="text-xs font-medium">
              {s.name}
            </Badge>
          ))}
          {specialities.length > 4 && (
            <Badge variant="outline" className="text-xs font-medium text-muted-foreground">
              +{specialities.length - 4} more
            </Badge>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-3 mt-auto border-t border-border">
        <Button
          size="sm"
          className="flex-1 gap-1.5"
          onClick={() => onManage(hospital)}
          disabled={deleting}
        >
          Manage
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0"
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <MoreHorizontal className="w-3.5 h-3.5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => onEdit(hospital)}>
              <Pencil className="w-3.5 h-3.5 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={() => onDelete(hospital)}
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function HospitalsListPage({
  hospitals: initialHospitals = [],
  lang,
}: {
  hospitals?: HospitalInfo[];
  lang?: string;
}) {
  const router = useRouter();
  const locale = useCurrentLocale();
  const resolvedLang = lang ?? locale;
  const [hospitals, setHospitals] = useState<HospitalInfo[]>(initialHospitals);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleManage = (hospital: HospitalInfo) => {
    router.push(`/hospital/hospitals/${hospital.id}`);
  };

  const handleEdit = (hospital: HospitalInfo) => {
    router.push(`/hospital/hospitals/${hospital.id}/edit`);
  };

  const handleDelete = async (hospital: HospitalInfo) => {
    if (!confirm(`Delete "${hospital.hospitalName ?? "this hospital"}"? This cannot be undone.`)) return;
    setDeletingId(hospital.id);
    const res = await deleteHospital({ lang: resolvedLang, id: hospital.id });
    if (res.success) {
      setHospitals((prev) => prev.filter((h) => h.id !== hospital.id));
      toast.success("Hospital deleted");
    } else {
      toast.error(res.message ?? "Failed to delete hospital");
    }
    setDeletingId(null);
  };

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Hospitals</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {hospitals.length > 0
              ? `${hospitals.length} hospital${hospitals.length !== 1 ? "s" : ""}`
              : "Manage your hospital entities"}
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => router.push("/hospital/hospitals/create")}
        >
          <Plus className="w-4 h-4" />
          Add Hospital
        </Button>
      </div>

      {/* Grid */}
      {hospitals.length === 0 ? (
        <div className="border border-border rounded-xl bg-card shadow-sm">
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <Building2 className="w-10 h-10 text-primary/60" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">No hospitals yet</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Add your first hospital to get started. You can manage multiple hospitals from here.
              </p>
            </div>
            <Button
              className="gap-2 mt-2"
              onClick={() => router.push("/hospital/hospitals/create")}
            >
              <Plus className="w-4 h-4" />
              Add Hospital
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitals.map((h) => (
            <HospitalCard
              key={h.id}
              hospital={h}
              onManage={handleManage}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deleting={deletingId === h.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

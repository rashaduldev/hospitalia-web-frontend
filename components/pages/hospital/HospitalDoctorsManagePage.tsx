"use client";

import { useState, useRef } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import Link from "next/link";
import {
  Stethoscope,
  MapPin,
  Clock,
  BadgeCheck,
  CalendarCheck,
  Users,
  Upload,
  Download,
  FileSpreadsheet,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDoctorsByHospital } from "@/actions/hospital/hospitalDoctors";
import { getDoctorInfoByDoctorId } from "@/actions/doctor/doctordata";
import { importDoctorsFromXlsx } from "@/actions/hospital/hospitalDoctors";
import { HospitalInfo } from "@/types/hospital.type";
import { SingleDoctorInfo } from "@/types/doctor";
import { useCurrentLocale } from "@/locales/client";
import { toast } from "sonner";

const SAMPLE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/doctors/import/sample`;

function getInitials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

type EnrichedDoctor = {
  doctorId: number;
  locations: string[];
  profile: SingleDoctorInfo | null;
};

function DoctorCard({ doctor, lang }: { doctor: EnrichedDoctor; lang: string }) {
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
      <div className="h-1 w-full bg-gradient-to-r from-primary/60 to-primary" />
      <div className="p-5 flex flex-col gap-4 flex-1">
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
              <p className="text-sm text-muted-foreground mt-0.5 truncate">{designation}</p>
            )}
            {isVerified && (
              <div className="flex items-center gap-1 mt-1">
                <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs text-primary font-medium">Verified</span>
              </div>
            )}
          </div>
        </div>

        {specialities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {specialities.slice(0, 3).map((s) => (
              <Badge key={s.id} variant="secondary" className="text-xs font-medium text-white px-2 py-0.5">
                {s.name}
              </Badge>
            ))}
            {specialities.length > 3 && (
              <span className="text-xs text-muted-foreground self-center">+{specialities.length - 3} more</span>
            )}
          </div>
        )}

        <Separator />

        <div className="space-y-1.5 text-sm">
          {doctor.locations.length > 0 && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-secondary" />
              <span className="leading-snug line-clamp-2">{doctor.locations.join(" · ")}</span>
            </div>
          )}
          {experience != null && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-3.5 h-3.5 shrink-0 text-primary" />
              <span>{experience} year{experience !== 1 ? "s" : ""} experience</span>
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

      <div className="px-5 pb-5">
        <Button asChild size="sm" className="w-full gap-2 font-semibold">
          <Link href={profileHref}>
            <CalendarCheck className="w-4 h-4" />
            View Profile
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ImportDialog({
  open,
  onClose,
  lang,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  lang: string;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    if (loading) return;
    setFile(null);
    setError(null);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file) { setError("Please select an xlsx file to upload."); return; }
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setError(null);
    try {
      const res = await importDoctorsFromXlsx({ lang, formData });
      if (res?.success) {
        toast.success("Doctors imported successfully");
        onSuccess();
        handleClose();
      } else {
        setError(res?.message ?? "Import failed. Please check the file and try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Import Doctors from Spreadsheet
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-5 py-1">
          {/* Instructions */}
          <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-2">
            <p className="text-sm font-semibold text-foreground">How to import:</p>
            <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>Download the sample spreadsheet below</li>
              <li>Fill in doctor information following the column headers</li>
              <li>Save the file as <span className="font-medium text-foreground">.xlsx</span></li>
              <li>Upload the completed file and click <span className="font-medium text-foreground">Import</span></li>
            </ol>
          </div>

          {/* Download sample */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-border bg-background">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FileSpreadsheet className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Sample Template</p>
                <p className="text-xs text-muted-foreground">doctors_import_sample.xlsx</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <a href={SAMPLE_URL} download>
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
            </Button>
          </div>

          {/* File upload */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Upload Filled Spreadsheet <span className="text-destructive">*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                file
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-muted/30"
              }`}
            >
              {file ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB · Click to change
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Click to select file</p>
                  <p className="text-xs text-muted-foreground">Supports .xlsx files only</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-xs text-destructive font-medium flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                {error}
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose} disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <Button onClick={handleSubmit} disabled={loading || !file} className="min-w-24 gap-2">
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Importing...</>
            ) : (
              <><Upload className="w-4 h-4" />Import</>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function HospitalDoctorsManagePage({
  hospitals,
  lang,
}: {
  hospitals: HospitalInfo[];
  lang: string;
}) {
  const locale = useCurrentLocale();
  const [selectedHospitalId, setSelectedHospitalId] = useState<number>(
    hospitals[0]?.id ?? 0,
  );
  const [importOpen, setImportOpen] = useState(false);

  const selectedHospital = hospitals.find((h) => h.id === selectedHospitalId);

  const { data: doctorsData, isLoading: doctorsLoading, refetch } = useQuery({
    queryKey: ["hospital-doctors-manage", selectedHospitalId],
    queryFn: () => getDoctorsByHospital({ lang, hospitalId: selectedHospitalId }),
    enabled: !!selectedHospitalId,
  });

  const rawDoctors = doctorsData?.payload ?? [];

  // Deduplicate by doctorId and merge locations
  const doctorMap = new Map<number, Set<string>>();
  for (const item of rawDoctors) {
    if (!doctorMap.has(item.doctorId)) doctorMap.set(item.doctorId, new Set());
    if (item.hospitalLocationName) doctorMap.get(item.doctorId)!.add(item.hospitalLocationName);
  }
  const uniqueDoctors = Array.from(doctorMap.entries()).map(([doctorId, locs]) => ({
    doctorId,
    locations: Array.from(locs),
  }));

  // Fetch each doctor's profile in parallel
  const profileQueries = useQueries({
    queries: uniqueDoctors.map(({ doctorId }) => ({
      queryKey: ["doctor-profile", doctorId],
      queryFn: () => getDoctorInfoByDoctorId({ lang, doctorId }),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const enriched: EnrichedDoctor[] = uniqueDoctors.map(({ doctorId, locations }, i) => ({
    doctorId,
    locations,
    profile: (profileQueries[i]?.data?.payload as SingleDoctorInfo) ?? null,
  }));

  if (hospitals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <Users className="w-12 h-12 text-muted-foreground/40" />
        <p className="text-base font-semibold text-foreground">No hospitals found</p>
        <p className="text-sm text-muted-foreground">Create a hospital first to manage its doctors.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-none">
              Doctors &amp; Consultants
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and import doctors for your hospital
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Hospital selector (only shown if multiple hospitals) */}
          {hospitals.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 max-w-[200px]">
                  <span className="truncate">{selectedHospital?.hospitalName ?? "Select Hospital"}</span>
                  <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {hospitals.map((h) => (
                  <DropdownMenuItem
                    key={h.id}
                    onClick={() => setSelectedHospitalId(h.id)}
                    className={selectedHospitalId === h.id ? "bg-primary/10 text-primary" : ""}
                  >
                    {h.hospitalName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            size="sm"
            className="gap-2 font-semibold"
            onClick={() => setImportOpen(true)}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Import From Spreadsheet
          </Button>
        </div>
      </div>

      {/* Hospital name badge (single hospital) */}
      {hospitals.length === 1 && selectedHospital && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{selectedHospital.hospitalName}</span>
        </div>
      )}

      {/* Doctor grid */}
      {doctorsLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : enriched.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center border border-dashed border-border rounded-xl">
          <Users className="w-12 h-12 text-muted-foreground/40" />
          <div>
            <p className="text-base font-semibold text-foreground">No doctors yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Import doctors using the spreadsheet to get started.
            </p>
          </div>
          <Button size="sm" className="gap-2 mt-2" onClick={() => setImportOpen(true)}>
            <FileSpreadsheet className="w-4 h-4" />
            Import From Spreadsheet
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {enriched.length} doctor{enriched.length !== 1 ? "s" : ""} in {selectedHospital?.hospitalName}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enriched.map((doctor) => (
              <DoctorCard key={doctor.doctorId} doctor={doctor} lang={locale} />
            ))}
          </div>
        </>
      )}

      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        lang={lang}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

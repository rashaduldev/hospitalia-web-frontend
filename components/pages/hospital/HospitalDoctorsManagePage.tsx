"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Stethoscope,
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
  Mail,
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
  getImportedDoctorsByUser,
  importDoctorsFromXlsx,
  downloadDoctorImportSample,
  inviteDoctorToHospitalia,
} from "@/actions/hospital/hospitalDoctors";
import { SingleDoctorInfo } from "@/types/doctor";
import { useCurrentLocale } from "@/locales/client";
import { toast } from "sonner";

function getInitials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

function DoctorCard({
  doctor,
  lang,
  onInvite,
}: {
  doctor: SingleDoctorInfo;
  lang: string;
  onInvite: (doctorId: number) => void;
}) {
  const firstName = doctor.firstName ?? "";
  const lastName = doctor.lastName ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown Doctor";
  const designation = doctor.professionalInfoResponse?.designation ?? "";
  const specialities = doctor.professionalInfoResponse?.specialities ?? [];
  const experience = doctor.yearsOfExperience;
  const qualification = doctor.qualification;
  const isVerified = doctor.verified;
  const isImported = doctor.status === "IMPORTED";
  const isInvited = doctor.status === "INVITED";
  const profileHref = `/${lang}/doctor/${doctor.id}`;

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

      <div className="px-5 pb-5 flex flex-col gap-2">
        {isImported && (
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-2 font-semibold text-primary border-primary/40 hover:bg-primary/5"
            onClick={() => onInvite(doctor.id!)}
          >
            <Mail className="w-4 h-4" />
            Invite to Hospitalia
          </Button>
        )}
        {isInvited && (
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-2 font-semibold text-amber-600 border-amber-400/40 hover:bg-amber-50 dark:hover:bg-amber-950/20"
            onClick={() => onInvite(doctor.id!)}
          >
            <Mail className="w-4 h-4" />
            Resend Invitation Email
          </Button>
        )}
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
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadSample = async () => {
    setDownloading(true);
    try {
      const result = await downloadDoctorImportSample({ lang });
      if (!result) { toast.error("Failed to download sample template."); return; }
      const bytes = Uint8Array.from(atob(result.base64), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setFile(null);
    setError(null);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
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

        <div className="space-y-5 py-1 max-h-[70vh] overflow-y-auto pr-1">
          {/* Instructions */}
          <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-2">
            <p className="text-sm font-semibold text-foreground">How to import:</p>
            <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>Download the sample spreadsheet and fill in doctor information</li>
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
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleDownloadSample}
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Download
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
          <AlertDialogCancel onClick={handleClose} disabled={loading}>Cancel</AlertDialogCancel>
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
  userId,
  lang,
}: {
  userId: number;
  lang: string;
}) {
  const locale = useCurrentLocale();
  const router = useRouter();
  const [importOpen, setImportOpen] = useState(false);

  const inviteMutation = useMutation({
    mutationFn: (doctorId: number) => inviteDoctorToHospitalia({ lang, doctorId }),
    onSuccess: (res) => {
      if (!res.success) { toast.error(res.message); return; }
      toast.success("Invitation sent successfully");
    },
    onError: () => toast.error("Failed to send invitation"),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["imported-doctors", userId],
    queryFn: () => getImportedDoctorsByUser({ lang, userId }),
  });

  const doctors: SingleDoctorInfo[] = data?.payload?.content ?? [];

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
              Imported Doctors &amp; Consultants
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Doctors imported and managed under your account
            </p>
          </div>
        </div>

        <Button
          size="sm"
          className="gap-2 font-semibold"
          onClick={() => setImportOpen(true)}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Import From Spreadsheet
        </Button>
      </div>

      {/* Doctor grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : doctors.length === 0 ? (
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
            {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} imported
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id ?? doctor.userId}
                doctor={doctor}
                lang={locale}
                onInvite={(doctorId) => inviteMutation.mutate(doctorId)}
              />
            ))}
          </div>
        </>
      )}

      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        lang={lang}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}

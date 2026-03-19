"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPatientUpcomingAppointments,
  getPatientPastAppointments,
  cancelPatientAppointment,
} from "@/actions/patient/appointments.actions";
import {
  getBeneficiaries,
  addBeneficiary,
  deleteBeneficiary,
} from "@/actions/patient/beneficiary.actions";
import { Typography } from "@/components/ui/Typography";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  Search,
  XCircle,
  Eye,
  Loader2,
  AlertCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Appointment } from "@/types/appointment.type";
import { Beneficiary } from "@/types/patient.user.type";
import AppButton from "@/components/common/AppButton";
import ErrorDialog from "@/components/common/ErrorDialog";
import { SessionExpiredError } from "@/lib/errors";
import { toast } from "sonner";
import Papa from "papaparse";

const CANCELLATION_REASONS = [
  "I need to reschedule to a different date",
  "I no longer need this appointment",
  "I found another doctor",
  "Personal emergency or conflict",
  "Transportation or travel issue",
  "Financial reasons",
  "Feeling better, no longer need the visit",
  "Other",
];

const RELATION_OPTIONS = [
  "Father",
  "Mother",
  "Spouse",
  "Husband",
  "Wife",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Grandfather",
  "Grandmother",
  "Uncle",
  "Aunt",
  "Nephew",
  "Niece",
  "Other",
];

const formatApptDate = (d: string | number[]) => {
  try {
    if (Array.isArray(d)) {
      const [year, month, day] = d as number[];
      return format(new Date(year, month - 1, day), "d MMMM yyyy");
    }
    return format(parseISO(d as string), "d MMMM yyyy");
  } catch {
    return String(d);
  }
};

const formatApptTime = (start: string, end: string) => {
  try {
    const parseT = (t: string) => {
      const [h, m] = t.replace("Z", "").split(":");
      return format(new Date(2000, 0, 1, Number(h), Number(m)), "h:mm a");
    };
    return `${parseT(start)} – ${parseT(end)}`;
  } catch {
    return `${start?.slice(0, 5) ?? ""} – ${end?.slice(0, 5) ?? ""}`;
  }
};

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-destructive/10 text-destructive",
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const STATUS_OPTIONS = ["All", "CONFIRMED", "CANCELLED", "COMPLETED"];

// Throws if the API response is not successful so React Query error state fires.
// Throws SessionExpiredError for 403 so the global handler can intercept it.
function assertSuccess<T extends { success: boolean; message: string; statusCode?: number }>(
  res: T
): T {
  if (!res.success) {
    if (res.statusCode === 403 || res.statusCode === 401) {
      throw new SessionExpiredError();
    }
    throw new Error(res.message || "Something went wrong");
  }
  return res;
}

export default function PatientDashboardPage({
  lang,
  patientUserId,
}: {
  lang: string;
  patientUserId: number | null;
}) {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelReasonOther, setCancelReasonOther] = useState("");
  const [page, setPage] = useState(0);

  const [pastSearch, setPastSearch] = useState("");
  const [pastStatusFilter, setPastStatusFilter] = useState("All");
  const [pastPage, setPastPage] = useState(0);

  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryRelation, setBeneficiaryRelation] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [errorDialog, setErrorDialog] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [detailAppointment, setDetailAppointment] = useState<Appointment | null>(null);

  // ── Appointments ──────────────────────────────────────────────────────────
  const {
    data: apptData,
    isLoading: apptLoading,
    isError: apptError,
    error: apptErrorObj,
    isRefetching: apptRefetching,
    refetch: refetchAppts,
  } = useQuery({
    queryKey: ["patientAppointments", patientUserId, page],
    queryFn: async () =>
      assertSuccess(
        await getPatientUpcomingAppointments({
          lang,
          patientUserId: patientUserId!,
          page,
          size: 10,
        })
      ),
    enabled: !!patientUserId,
  });

  const appointments: Appointment[] = apptData?.payload?.content ?? [];
  const totalAppointments: number = apptData?.payload?.totalElements ?? 0;
  const totalPages: number = apptData?.payload?.totalPages ?? 0;

  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      formatApptDate(a.appointmentDate).toLowerCase().includes(q) ||
      a.locationName?.toLowerCase().includes(q) ||
      a.doctorName?.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "All" || a.appointmentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ── Past Appointments ─────────────────────────────────────────────────────
  const {
    data: pastApptData,
    isLoading: pastApptLoading,
    isError: pastApptError,
    error: pastApptErrorObj,
    isRefetching: pastApptRefetching,
    refetch: refetchPastAppts,
  } = useQuery({
    queryKey: ["patientPastAppointments", patientUserId, pastPage],
    queryFn: async () =>
      assertSuccess(
        await getPatientPastAppointments({
          lang,
          patientUserId: patientUserId!,
          page: pastPage,
          size: 10,
        })
      ),
    enabled: !!patientUserId,
  });

  const pastAppointments: Appointment[] = pastApptData?.payload?.content ?? [];
  const totalPastAppointments: number = pastApptData?.payload?.totalElements ?? 0;
  const totalPastPages: number = pastApptData?.payload?.totalPages ?? 0;

  const filteredPast = pastAppointments.filter((a) => {
    const q = pastSearch.toLowerCase();
    const matchesSearch =
      !q ||
      formatApptDate(a.appointmentDate).toLowerCase().includes(q) ||
      a.locationName?.toLowerCase().includes(q) ||
      a.doctorName?.toLowerCase().includes(q);
    const matchesStatus =
      pastStatusFilter === "All" || a.appointmentStatus === pastStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // ── Beneficiaries ─────────────────────────────────────────────────────────
  const {
    data: benefData,
    isLoading: benefLoading,
    isError: benefError,
    isRefetching: benefRefetching,
    error: benefErrorObj,
    refetch: refetchBenef,
  } = useQuery({
    queryKey: ["beneficiaries"],
    queryFn: async () =>
      assertSuccess(await getBeneficiaries({ lang, pageNo: 0, pageSize: 20 })),
  });

  const beneficiaries: Beneficiary[] = benefData?.payload?.content ?? [];

  // ── Mutations ─────────────────────────────────────────────────────────────
  const addBeneficiaryMutation = useMutation({
    mutationFn: async ({
      name,
      relation,
    }: {
      name: string;
      relation: string;
    }) =>
      assertSuccess(
        await addBeneficiary({
          patientUserId: patientUserId!,
          name,
          relation,
          lang,
        })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      setBeneficiaryName("");
      setBeneficiaryRelation("");
      setAddError(null);
      toast.success("Beneficiary added successfully");
    },
    onError: (err: Error) => {
      setAddError(err.message);
    },
  });

  const deleteBeneficiaryMutation = useMutation({
    mutationFn: async (id: number) =>
      assertSuccess(await deleteBeneficiary({ id, lang })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      setDeleteTargetId(null);
      toast.success("Beneficiary removed");
    },
    onError: (err: Error) => {
      setDeleteTargetId(null);
      setErrorDialog(err.message || "Failed to remove beneficiary");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async ({ appointmentId, reason }: { appointmentId: string; reason: string }) =>
      assertSuccess(
        await cancelPatientAppointment({
          appointmentId,
          cancelledByUserId: patientUserId!,
          cancellationReason: reason,
          lang,
        })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientAppointments"] });
      setCancelTargetId(null);
      setCancelReason("");
      setCancelReasonOther("");
      toast.success("Appointment cancelled");
    },
    onError: (err: Error) => {
      setCancelTargetId(null);
      setCancelReason("");
      setCancelReasonOther("");
      setErrorDialog(err.message || "Failed to cancel appointment");
    },
  });

  // ── CSV Export ────────────────────────────────────────────────────────────
  const handleDownloadCSV = () => {
    const rows = (
      selectedIds.size > 0
        ? filtered.filter((a) => selectedIds.has(String(a.appointmentId)))
        : filtered
    ).map((a) => ({
      Date: formatApptDate(a.appointmentDate),
      Doctor: a.doctorName,
      Designation: a.designation,
      Location: a.locationName,
      "Time Duration": formatApptTime(a.startTime, a.endTime),
      "Slot Duration": `${a.slotDuration} Min`,
      Status: a.appointmentStatus,
    }));

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "appointments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Checkbox helpers ──────────────────────────────────────────────────────
  const allSelected =
    filtered.length > 0 &&
    filtered.every((a) => selectedIds.has(String(a.appointmentId)));

  const toggleAll = (checked: boolean) => {
    setSelectedIds(
      checked
        ? new Set(filtered.map((a) => String(a.appointmentId)))
        : new Set()
    );
  };

  const toggleOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  return (
    <div className="p-6 space-y-10">
      {/* ── Upcoming Appointments ─────────────────────────────────────────── */}
      <section className="bg-card rounded-xl border">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b flex items-start justify-between gap-4">
          <div>
            <Typography size="xl" weight="bold" color="foreground" as="h2">
              Upcoming Appointments
            </Typography>
            <Typography size="sm" color="muted" className="mt-0.5">
              Your scheduled and confirmed appointments
            </Typography>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCSV}
            disabled={appointments.length === 0}
            className="flex items-center gap-2 shrink-0"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b flex flex-wrap items-center gap-3 bg-muted/30">
          <div className="relative flex-1 min-w-48 max-w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search doctor, location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Status:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === s
                      ? "bg-primary text-white"
                      : "bg-background border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  }`}
                >
                  {s === "All" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {(search || statusFilter !== "All") && (
            <button
              type="button"
              onClick={() => { setSearch(""); setStatusFilter("All"); }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="py-3 px-4 w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(v) => toggleAll(!!v)}
                    disabled={filtered.length === 0}
                  />
                </th>
                <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Date</th>
                <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Doctor</th>
                <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Location</th>
                <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Time</th>
                <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Status</th>
                <th className="py-3 px-4 w-24" />
              </tr>
            </thead>
            <tbody>
              {apptLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </td>
                </tr>
              ) : apptError ? (
                <tr>
                  <td colSpan={7} className="py-12">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <AlertCircle className="h-8 w-8 text-destructive" />
                      <p className="text-sm font-medium text-destructive">
                        {(apptErrorObj as Error)?.message ?? "Failed to load appointments"}
                      </p>
                      <button
                        type="button"
                        onClick={() => refetchAppts()}
                        disabled={apptRefetching}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${apptRefetching ? "animate-spin" : ""}`} />
                        {apptRefetching ? "Retrying…" : "Try again"}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted-foreground text-sm">
                    {search || statusFilter !== "All"
                      ? "No appointments match your filters"
                      : "No upcoming appointments"}
                  </td>
                </tr>
              ) : (
                filtered.map((appt) => (
                  <tr
                    key={appt.appointmentId}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <Checkbox
                        checked={selectedIds.has(String(appt.appointmentId))}
                        onCheckedChange={(v) => toggleOne(String(appt.appointmentId), !!v)}
                      />
                    </td>
                    <td className="py-3.5 px-4 min-w-[130px]">
                      <p className="text-sm font-medium text-foreground">{formatApptDate(appt.appointmentDate)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">{appt.dayOfWeek ? appt.dayOfWeek.charAt(0) + appt.dayOfWeek.slice(1).toLowerCase() : ""}</p>
                    </td>
                    <td className="py-3.5 px-4 min-w-[150px]">
                      <p className="text-sm font-medium text-foreground whitespace-normal">{appt.doctorName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{appt.designation}</p>
                    </td>
                    <td className="py-3.5 px-4 min-w-[160px] max-w-[220px]">
                      <p className="text-sm text-foreground whitespace-normal leading-snug">{appt.locationName}</p>
                    </td>
                    <td className="py-3.5 px-4 min-w-[140px]">
                      <p className="text-[11px] text-foreground">{formatApptTime(appt.startTime, appt.endTime)}</p>
                      <span className="inline-block mt-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{appt.slotDuration} min slot</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[appt.appointmentStatus] ?? "bg-muted text-muted-foreground"}`}>
                        {appt.appointmentStatus?.charAt(0) + appt.appointmentStatus?.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setDetailAppointment(appt)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Details
                        </button>
                        {appt.appointmentStatus !== "CANCELLED" && appt.appointmentStatus !== "COMPLETED" && (
                          <button
                            type="button"
                            onClick={() => setCancelTargetId(String(appt.appointmentId))}
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border border-destructive/40 text-destructive hover:bg-destructive/5 hover:border-destructive transition-colors"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t text-sm text-muted-foreground">
            <span>
              Showing {page * 10 + 1}–{Math.min((page + 1) * 10, totalAppointments)} of {totalAppointments}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 rounded-md text-xs hover:bg-accent disabled:opacity-40"
              >
                ← Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i).map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  className={`h-7 w-7 rounded-md text-xs ${page === i ? "border font-bold bg-background shadow-sm" : "hover:bg-accent"}`}
                >
                  {i + 1}
                </button>
              ))}
              {totalPages > 5 && <span className="px-1 text-xs">…</span>}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 rounded-md text-xs hover:bg-accent disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Cancel confirmation dialog */}
        <AlertDialog
          open={!!cancelTargetId}
          onOpenChange={(open) => {
            if (!open) {
              setCancelTargetId(null);
              setCancelReason("");
              setCancelReasonOther("");
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
              <AlertDialogDescription>
                Please select a reason for cancelling this appointment.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-3 py-1">
              <Select value={cancelReason} onValueChange={setCancelReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason…" />
                </SelectTrigger>
                <SelectContent>
                  {CANCELLATION_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {cancelReason === "Other" && (
                <Textarea
                  placeholder="Please describe your reason…"
                  value={cancelReasonOther}
                  onChange={(e) => setCancelReasonOther(e.target.value)}
                  rows={3}
                />
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={cancelMutation.isPending}
                onClick={() => {
                  setCancelTargetId(null);
                  setCancelReason("");
                  setCancelReasonOther("");
                }}
              >
                Keep Appointment
              </AlertDialogCancel>
              <AppButton
                variant="destructive"
                isLoading={cancelMutation.isPending}
                loadingText="Cancelling…"
                disabled={!cancelReason || (cancelReason === "Other" && !cancelReasonOther.trim())}
                onClick={() => {
                  if (!cancelTargetId || !cancelReason) return;
                  const reason = cancelReason === "Other" ? cancelReasonOther.trim() : cancelReason;
                  cancelMutation.mutate({ appointmentId: cancelTargetId, reason });
                }}
              >
                Yes, Cancel
              </AppButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {/* ── Past Appointments ─────────────────────────────────────────────── */}
      <section className="bg-card rounded-xl border">
        <div className="px-6 pt-6 pb-4 border-b flex items-start justify-between gap-4">
          <div>
            <Typography size="xl" weight="bold" color="foreground" as="h2">
              Past Appointments
            </Typography>
            <Typography size="sm" color="muted" className="mt-0.5">
              Your completed and past appointment history
            </Typography>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b flex flex-wrap items-center gap-3 bg-muted/30">
          <div className="relative flex-1 min-w-48 max-w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search doctor, location…"
              value={pastSearch}
              onChange={(e) => setPastSearch(e.target.value)}
              className="pl-9 h-9 bg-background"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Status:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPastStatusFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    pastStatusFilter === s
                      ? "bg-primary text-white"
                      : "bg-background border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  }`}
                >
                  {s === "All" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
          {(pastSearch || pastStatusFilter !== "All") && (
            <button
              type="button"
              onClick={() => { setPastSearch(""); setPastStatusFilter("All"); }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Date</th>
                <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Doctor</th>
                <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Location</th>
                <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Time</th>
                <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Status</th>
                <th className="py-3 px-4 w-24" />
              </tr>
            </thead>
            <tbody>
              {pastApptLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </td>
                </tr>
              ) : pastApptError ? (
                <tr>
                  <td colSpan={5} className="py-12">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <AlertCircle className="h-8 w-8 text-destructive" />
                      <p className="text-sm font-medium text-destructive">
                        {(pastApptErrorObj as Error)?.message ?? "Failed to load past appointments"}
                      </p>
                      <button
                        type="button"
                        onClick={() => refetchPastAppts()}
                        disabled={pastApptRefetching}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${pastApptRefetching ? "animate-spin" : ""}`} />
                        {pastApptRefetching ? "Retrying…" : "Try again"}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredPast.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-muted-foreground text-sm">
                    {pastSearch || pastStatusFilter !== "All"
                      ? "No appointments match your filters"
                      : "No past appointments"}
                  </td>
                </tr>
              ) : (
                filteredPast.map((appt) => (
                  <tr
                    key={appt.appointmentId}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 min-w-[130px]">
                      <p className="text-sm font-medium text-foreground">{formatApptDate(appt.appointmentDate)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">{appt.dayOfWeek ? appt.dayOfWeek.charAt(0) + appt.dayOfWeek.slice(1).toLowerCase() : ""}</p>
                    </td>
                    <td className="py-3.5 px-4 min-w-[150px]">
                      <p className="text-sm font-medium text-foreground whitespace-normal">{appt.doctorName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{appt.designation}</p>
                    </td>
                    <td className="py-3.5 px-4 min-w-[160px] max-w-[220px]">
                      <p className="text-sm text-foreground whitespace-normal leading-snug">{appt.locationName}</p>
                    </td>
                    <td className="py-3.5 px-4 min-w-[140px]">
                      <p className="text-[11px] text-foreground">{formatApptTime(appt.startTime, appt.endTime)}</p>
                      <span className="inline-block mt-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{appt.slotDuration} min slot</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[appt.appointmentStatus] ?? "bg-muted text-muted-foreground"}`}>
                        {appt.appointmentStatus?.charAt(0) + appt.appointmentStatus?.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setDetailAppointment(appt)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPastPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t text-sm text-muted-foreground">
            <span>
              Showing {pastPage * 10 + 1}–{Math.min((pastPage + 1) * 10, totalPastAppointments)} of {totalPastAppointments}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPastPage((p) => Math.max(0, p - 1))}
                disabled={pastPage === 0}
                className="px-3 py-1.5 rounded-md text-xs hover:bg-accent disabled:opacity-40"
              >
                ← Previous
              </button>
              {Array.from({ length: Math.min(totalPastPages, 5) }, (_, i) => i).map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPastPage(i)}
                  className={`h-7 w-7 rounded-md text-xs ${pastPage === i ? "border font-bold bg-background shadow-sm" : "hover:bg-accent"}`}
                >
                  {i + 1}
                </button>
              ))}
              {totalPastPages > 5 && <span className="px-1 text-xs">…</span>}
              <button
                type="button"
                onClick={() => setPastPage((p) => Math.min(totalPastPages - 1, p + 1))}
                disabled={pastPage >= totalPastPages - 1}
                className="px-3 py-1.5 rounded-md text-xs hover:bg-accent disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── Beneficiaries ──────────────────────────────────────────────────── */}
      <section>
        <Typography
          size="2xl"
          weight="bold"
          color="secondary"
          as="h2"
          className="mb-6"
        >
          Beneficiaries
        </Typography>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Beneficiaries list */}
          <div className="bg-card rounded-lg border p-6">
            <Typography
              size="xl"
              weight="semiBold"
              color="foreground"
              as="h3"
              className="mb-4"
            >
              My Beneficiaries
            </Typography>

            {benefError ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <AlertCircle className="h-7 w-7 text-destructive" />
                <p className="text-sm font-medium text-destructive">
                  {(benefErrorObj as Error)?.message ||
                    "Failed to load beneficiaries"}
                </p>
                <button
                  type="button"
                  onClick={() => refetchBenef()}
                  disabled={benefRefetching}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${benefRefetching ? "animate-spin" : ""}`} />
                  {benefRefetching ? "Retrying…" : "Try again"}
                </button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-semibold text-foreground">
                      Patient Name
                    </th>
                    <th className="py-2 text-left font-semibold text-foreground">
                      Relations
                    </th>
                    <th className="py-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {benefLoading ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center">
                        <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                      </td>
                    </tr>
                  ) : beneficiaries.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-8 text-center text-muted-foreground text-xs"
                      >
                        No beneficiaries added yet
                      </td>
                    </tr>
                  ) : (
                    beneficiaries.map((b) => (
                      <tr key={b.id} className="border-b last:border-0">
                        <td className="py-3 font-medium">{b.name}</td>
                        <td className="py-3 text-muted-foreground">
                          {b.relation}
                        </td>
                        <td className="py-3 text-right">
                          <AlertDialog
                            open={deleteTargetId === b.id}
                            onOpenChange={(open) =>
                              !open && setDeleteTargetId(null)
                            }
                          >
                            <AlertDialogTrigger asChild>
                              <button
                                type="button"
                                className="p-1.5 rounded text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                aria-label="Remove beneficiary"
                                onClick={() => setDeleteTargetId(b.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Remove Beneficiary
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove{" "}
                                  <span className="font-semibold text-foreground">
                                    {b.name}
                                  </span>{" "}
                                  ({b.relation}) from your beneficiaries? This
                                  action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  disabled={deleteBeneficiaryMutation.isPending}
                                  onClick={() => setDeleteTargetId(null)}
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <AppButton
                                  variant="destructive"
                                  isLoading={deleteBeneficiaryMutation.isPending}
                                  loadingText="Removing…"
                                  onClick={() =>
                                    deleteBeneficiaryMutation.mutate(b.id)
                                  }
                                >
                                  Remove
                                </AppButton>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Add a Beneficiary form */}
          <div className="bg-card rounded-lg border p-6 self-start">
            <Typography
              size="xl"
              weight="semiBold"
              color="foreground"
              as="h3"
              className="mb-4"
            >
              Add a Beneficiary
            </Typography>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <Input
                    placeholder="Enter name"
                    value={beneficiaryName}
                    onChange={(e) => {
                      setBeneficiaryName(e.target.value);
                      setAddError(null);
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Relation
                  </label>
                  <Select
                    value={beneficiaryRelation}
                    onValueChange={(v) => {
                      setBeneficiaryRelation(v);
                      setAddError(null);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select relation" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATION_OPTIONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Inline error message */}
              {addError && (
                <div className="flex items-start gap-2 rounded-md bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              <div className="flex justify-end">
              <AppButton
                className="bg-secondary text-white hover:bg-secondary/90"
                isLoading={addBeneficiaryMutation.isPending}
                loadingText="Adding..."
                disabled={!patientUserId}
                onClick={() => {
                  if (!beneficiaryName.trim() || !beneficiaryRelation) {
                    setAddError("Please fill in all fields");
                    return;
                  }
                  setAddError(null);
                  addBeneficiaryMutation.mutate({
                    name: beneficiaryName.trim(),
                    relation: beneficiaryRelation,
                  });
                }}
              >
                Confirm
              </AppButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Appointment Detail Dialog ──────────────────────────────────────── */}
      <AlertDialog open={!!detailAppointment} onOpenChange={(open) => !open && setDetailAppointment(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Appointment Details</AlertDialogTitle>
            {detailAppointment && (
              <AlertDialogDescription asChild>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm pt-1">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Date</p>
                    <p className="font-medium text-foreground">{formatApptDate(detailAppointment.appointmentDate)}</p>
                    {detailAppointment.dayOfWeek && (
                      <p className="text-xs text-muted-foreground capitalize">{detailAppointment.dayOfWeek.charAt(0) + detailAppointment.dayOfWeek.slice(1).toLowerCase()}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[detailAppointment.appointmentStatus] ?? "bg-muted text-muted-foreground"}`}>
                      {detailAppointment.appointmentStatus?.charAt(0) + detailAppointment.appointmentStatus?.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Doctor</p>
                    <p className="font-medium text-foreground">{detailAppointment.doctorName}</p>
                    {detailAppointment.designation && (
                      <p className="text-xs text-muted-foreground">{detailAppointment.designation}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Patient</p>
                    <p className="font-medium text-foreground">{detailAppointment.patientName}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Location</p>
                    <p className="text-foreground">{detailAppointment.locationName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Time</p>
                    <p className="text-foreground">{formatApptTime(detailAppointment.startTime, detailAppointment.endTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Slot Duration</p>
                    <p className="text-foreground">{detailAppointment.slotDuration} min</p>
                  </div>
                  {detailAppointment.fees > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Fees</p>
                      <p className="text-foreground">{detailAppointment.fees}</p>
                    </div>
                  )}
                  {detailAppointment.notes && (
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Notes</p>
                      <p className="text-foreground">{detailAppointment.notes}</p>
                    </div>
                  )}
                  {detailAppointment.appointmentStatus === "CANCELLED" && detailAppointment.cancellationReason && (
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Cancellation Reason</p>
                      <p className="text-destructive">{detailAppointment.cancellationReason}</p>
                    </div>
                  )}
                </div>
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDetailAppointment(null)}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ErrorDialog
        message={errorDialog}
        onClose={() => setErrorDialog(null)}
      />
    </div>
  );
}

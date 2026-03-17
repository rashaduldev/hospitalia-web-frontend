"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentLocale } from "@/locales/client";
import { getCurrentUser } from "@/actions/user.actions";
import {
  getPatientUpcomingAppointments,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Download,
  Search,
  MoreVertical,
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

const formatDate = (dateStr: string) => {
  try {
    return format(parseISO(dateStr), "do MMMM");
  } catch {
    return dateStr;
  }
};

const formatTime = (start: string, end: string) =>
  `${start?.slice(0, 5) ?? ""} - ${end?.slice(0, 5) ?? ""}`;

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

export default function PatientDashboardPage({ lang }: { lang: string }) {
  const locale = useCurrentLocale();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);

  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryRelation, setBeneficiaryRelation] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [errorDialog, setErrorDialog] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // ── Current user ──────────────────────────────────────────────────────────
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser", locale],
    queryFn: () => getCurrentUser({ lang: locale }),
  });

  // ── Appointments ──────────────────────────────────────────────────────────
  const {
    data: apptData,
    isLoading: apptLoading,
    isError: apptError,
    error: apptErrorObj,
    isRefetching: apptRefetching,
    refetch: refetchAppts,
  } = useQuery({
    queryKey: ["patientAppointments", currentUser?.id, page],
    queryFn: async () =>
      assertSuccess(
        await getPatientUpcomingAppointments({
          lang,
          patientUserId: currentUser!.id,
          page,
          size: 10,
        })
      ),
    enabled: !!currentUser?.id,
  });

  const appointments: Appointment[] = apptData?.payload?.content ?? [];
  const totalAppointments: number = apptData?.payload?.total ?? 0;
  const totalPages = Math.ceil(totalAppointments / 10);

  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase();
    return (
      !q ||
      formatDate(a.appointmentDate).toLowerCase().includes(q) ||
      a.locationName?.toLowerCase().includes(q)
    );
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
          patientUserId: currentUser!.id,
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
    mutationFn: async (appointmentId: string) =>
      assertSuccess(await cancelPatientAppointment({ appointmentId, lang })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientAppointments"] });
      toast.success("Appointment cancelled");
    },
    onError: (err: Error) => {
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
      Date: formatDate(a.appointmentDate),
      Location: a.locationName,
      "Time Duration": formatTime(a.startTime, a.endTime),
      "Time Slot": `${a.slotDuration} Min`,
      Status: a.status,
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
      <section className="bg-card rounded-lg border p-6">
        <Typography size="2xl" weight="bold" color="secondary" as="h2">
          Upcoming Appointments
        </Typography>
        <Typography size="sm" color="muted" className="mt-1 mb-5">
          All your confirmed appointments
        </Typography>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by date, location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <AppButton
            variant="outline"
            size="sm"
            onClick={handleDownloadCSV}
            className="flex items-center gap-2"
            disabled={appointments.length === 0}
          >
            <Download className="h-4 w-4" />
            Download CSV
          </AppButton>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-3 w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(v) => toggleAll(!!v)}
                    disabled={filtered.length === 0}
                  />
                </th>
                <th className="py-3 px-3 text-left font-semibold text-foreground">
                  Date
                </th>
                <th className="py-3 px-3 text-left font-semibold text-foreground">
                  Location
                </th>
                <th className="py-3 px-3 text-left font-semibold text-foreground">
                  Time Duration
                </th>
                <th className="py-3 px-3 text-left font-semibold text-foreground">
                  Time Slot
                </th>
                <th className="py-3 px-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {apptLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </td>
                </tr>
              ) : apptError ? (
                <tr>
                  <td colSpan={6} className="py-10">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <AlertCircle className="h-8 w-8 text-destructive" />
                      <p className="text-sm font-medium text-destructive">
                        {(apptErrorObj as Error)?.message ||
                          "Failed to load appointments"}
                      </p>
                      <button
                        type="button"
                        onClick={() => refetchAppts()}
                        disabled={apptRefetching}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${apptRefetching ? "animate-spin" : ""}`} />
                        {apptRefetching ? "Retrying…" : "Try again"}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No upcoming appointments found
                  </td>
                </tr>
              ) : (
                filtered.map((appt) => (
                  <tr
                    key={appt.appointmentId}
                    className="border-b hover:bg-accent/30 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <Checkbox
                        checked={selectedIds.has(String(appt.appointmentId))}
                        onCheckedChange={(v) =>
                          toggleOne(String(appt.appointmentId), !!v)
                        }
                      />
                    </td>
                    <td className="py-3 px-3 font-medium">
                      {formatDate(appt.appointmentDate)}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground max-w-xs">
                      {appt.locationName}
                    </td>
                    <td className="py-3 px-3">
                      {formatTime(appt.startTime, appt.endTime)}
                    </td>
                    <td className="py-3 px-3">{appt.slotDuration} Min</td>
                    <td className="py-3 px-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="p-1 rounded hover:bg-accent cursor-pointer"
                          >
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() =>
                              cancelMutation.mutate(String(appt.appointmentId))
                            }
                          >
                            Cancel Appointment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
            <span>
              Showing {page * 10 + 1}–
              {Math.min((page + 1) * 10, totalAppointments)} of{" "}
              {totalAppointments} products
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 rounded hover:bg-accent disabled:opacity-40 flex items-center gap-1"
              >
                ← Previous
              </button>
              {Array.from(
                { length: Math.min(totalPages, 5) },
                (_, i) => i
              ).map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  className={`h-7 w-7 rounded text-sm ${
                    page === i
                      ? "border font-bold bg-background shadow-sm"
                      : "hover:bg-accent"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              {totalPages > 5 && <span className="px-1 text-xs">...</span>}
              <button
                type="button"
                onClick={() =>
                  setPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={page >= totalPages - 1}
                className="px-3 py-1 rounded hover:bg-accent disabled:opacity-40 flex items-center gap-1"
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
                disabled={!currentUser}
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

      <ErrorDialog
        message={errorDialog}
        onClose={() => setErrorDialog(null)}
      />
    </div>
  );
}

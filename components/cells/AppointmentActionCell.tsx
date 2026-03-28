"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  Eye,
  Trash,
  MoreVertical,
  User,
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  Banknote,
  AlertCircle,
  Loader2,
  Hash,
  FileText,
  XCircle,
  Timer,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/Typography";
import { useCurrentLocale, useI18n } from "@/locales/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DetailItem } from "./DetailItemHelper";
import { cancelAppointment } from "@/actions/doctor/appointment";
import { cancelAppointmentSchema } from "@/schema/doctor.booking.schema";
import { Appointment } from "@/types/appointment.type";
import { useRouter } from "next/navigation";

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-destructive/10 text-destructive",
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export const AppointmentActionCell = ({
  appointment,
}: {
  appointment: Appointment;
}) => {
  const t = useI18n();
  const router = useRouter();
  const lang = useCurrentLocale();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const closeCancelModal = () => {
    if (loading) return;
    setIsCancelOpen(false);
    setReason(null);
    setValidationError(null);
  };

  const handleCancel = async () => {
    const result = cancelAppointmentSchema.safeParse({ reason });

    if (!result.success) {
      const errorMessage = result.error.message;
      setValidationError(errorMessage);
      return;
    }

    if (!reason) {
      setValidationError("Reason is required");
      return;
    }

    setValidationError(null);
    setLoading(true);
    const res = await cancelAppointment({
      appointmentId: appointment.appointmentId,
      cancelledByUserId: Number(appointment.doctorId),
      cancellationReason: reason,
      lang,
    });

    if (res?.success) {
      closeCancelModal();
      router.refresh();
    } else {
      setValidationError(res?.message);
    }
    setLoading(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>{t("table.actions")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsViewOpen(true)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" /> {t("table.view_details")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsCancelOpen(true)}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <Trash className="mr-2 h-4 w-4" /> {t("table.cancel")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Details Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-none shadow-2xl">
          {/* Header */}
          <div className="bg-primary/5 px-6 py-5 border-b flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-bold text-foreground leading-none">
                {t("table.appointment_details")}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Hash className="w-3 h-3" />{appointment.appointmentId}
                </span>
                <span className="text-muted-foreground/40">·</span>
                <StatusBadge status={appointment.appointmentStatus} />
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* People */}
            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                icon={<User className="w-4 h-4 text-primary" />}
                label="Patient"
                value={appointment.patientName}
              />
              <DetailItem
                icon={<Stethoscope className="w-4 h-4 text-primary" />}
                label="Doctor"
                value={`${appointment.doctorName}${appointment.designation ? ` · ${appointment.designation}` : ""}`}
              />
            </div>

            <hr className="border-border" />

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" /> Date
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {appointment.appointmentDate
                    ? format(
                        Array.isArray(appointment.appointmentDate)
                          ? new Date(appointment.appointmentDate[0], appointment.appointmentDate[1] - 1, appointment.appointmentDate[2])
                          : new Date(appointment.appointmentDate),
                        "EEEE, dd MMM yyyy",
                      )
                    : "N/A"}
                </p>
                {appointment.dayOfWeek && (
                  <p className="text-xs text-muted-foreground capitalize">
                    {appointment.dayOfWeek.charAt(0) + appointment.dayOfWeek.slice(1).toLowerCase()}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1 border-l pl-4">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" /> Time
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {appointment.startTime && appointment.endTime
                    ? `${format(parseISO(`1970-01-01T${appointment.startTime}`), "h:mm a")} – ${format(parseISO(`1970-01-01T${appointment.endTime}`), "h:mm a")}`
                    : "N/A"}
                </p>
                {appointment.slotDuration && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Timer className="w-3 h-3" />{appointment.slotDuration} min slot
                  </p>
                )}
              </div>
            </div>

            {/* Location & Fee */}
            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                icon={<MapPin className="w-4 h-4 text-primary" />}
                label="Location"
                value={appointment.locationName}
              />
              <DetailItem
                icon={<Banknote className="w-4 h-4 text-secondary" />}
                label="Consultation Fee"
                value={`${appointment.fees} CFA`}
              />
            </div>

            {/* Notes */}
            {appointment.notes && (
              <>
                <hr className="border-border" />
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Notes</p>
                    <p className="text-sm text-foreground leading-relaxed">{appointment.notes}</p>
                  </div>
                </div>
              </>
            )}

            {/* Cancellation info */}
            {appointment.appointmentStatus === "CANCELLED" && (
              <>
                <hr className="border-border" />
                <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-destructive text-xs font-semibold uppercase tracking-wider">
                    <XCircle className="w-3.5 h-3.5" /> Cancellation Details
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Cancelled by</p>
                      <p className="text-sm font-medium text-foreground">
                        {appointment.cancelledByUserId == null
                          ? "System"
                          : appointment.cancelledByUserId === appointment.patientUserId
                          ? `Patient · ${appointment.patientName}`
                          : appointment.cancelledByUserId === appointment.doctorUserId
                          ? `Doctor · ${appointment.doctorName}`
                          : "System"}
                      </p>
                    </div>
                    {appointment.cancelledAt && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Cancelled on</p>
                        <p className="text-sm font-medium text-foreground">
                          {(() => {
                            try {
                              const d = appointment.cancelledAt;
                              const date = Array.isArray(d)
                                ? new Date((d as number[])[0], (d as number[])[1] - 1, (d as number[])[2])
                                : typeof d === "number"
                                ? new Date(d)
                                : new Date(d as string);
                              return format(date, "dd MMM yyyy");
                            } catch {
                              return String(appointment.cancelledAt);
                            }
                          })()}
                        </p>
                      </div>
                    )}
                  </div>
                  {appointment.cancellationReason && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Reason</p>
                      <p className="text-sm text-foreground leading-relaxed">{appointment.cancellationReason}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <Dialog open={isCancelOpen} onOpenChange={closeCancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              {t("table.con_cancel")}
            </DialogTitle>
            <DialogDescription>
              {t("table.sureText")} <b>{appointment.patientName}</b>?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Typography size="xs" className="font-semibold">
                  Reason for Cancellation{" "}
                  <span className="text-destructive">*</span>
                </Typography>
                <span
                  className={`text-[10px] ${reason && reason?.length < 5 ? "text-muted-foreground" : "text-primary"}`}
                >
                  {reason && reason.length}/300
                </span>
              </div>

              <Textarea
                placeholder="Explain the reason (minimum 5 characters)..."
                value={reason || ""}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                className={
                  validationError
                    ? "border-destructive focus-visible:ring-destructive"
                    : "resize-none"
                }
                disabled={loading}
                rows={4}
              />
            </div>

            {validationError && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 animate-in fade-in zoom-in duration-200">
                <p className="text-xs text-destructive font-medium flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={closeCancelModal}
              disabled={loading}
            >
              No, Keep it
            </Button>

            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={loading || (reason?.trim().length ?? 0) < 5}
              className="min-w-25"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

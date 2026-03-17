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
      cancelledByUserId: Number(appointment.doctorUserId),
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
        <DialogContent className="sm:max-w-125 p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-primary/5 p-6 border-b">
            <DialogTitle className="text-2xl font-bold text-foreground">
              {t("table.appointment_details")}
            </DialogTitle>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-6">
              <DetailItem
                icon={<User className="w-4 h-4 text-primary" />}
                label="Patient Name"
                value={appointment.patientName}
              />
              <DetailItem
                icon={<Stethoscope className="w-4 h-4 text-primary" />}
                label="Doctor"
                value={`${appointment.doctorName} (${appointment.designation})`}
              />
            </div>

            <hr className="border-border" />

            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <Calendar className="w-4 h-4" /> Date
                </div>
                <Typography
                  size="xs"
                  color="foreground"
                  className="font-semibold"
                >
                  {appointment?.appointmentDate
                    ? format(
                        new Date(appointment.appointmentDate),
                        "EEEE, dd MMM yyyy",
                      )
                    : "N/A"}
                </Typography>
              </div>
              <div className="flex flex-col gap-1 border-l pl-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <Clock className="w-4 h-4" /> Time Slot
                </div>
                <Typography
                  size="xs"
                  color="foreground"
                  className="font-semibold"
                >
                  {appointment.startTime && appointment.endTime
                    ? `${format(parseISO(`1970-01-01T${appointment.startTime}`), "hh:mm a")} - ${format(parseISO(`1970-01-01T${appointment.endTime}`), "hh:mm a")}`
                    : "N/A"}
                </Typography>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
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

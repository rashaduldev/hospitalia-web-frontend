"use client";

import { useState } from "react";
import { Appointment } from "@/types/appointment.type";
import { format } from "date-fns";
import {
  Eye,
  Trash,
  CheckCircle2,
  MoreVertical,
  User,
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  Banknote,
  FileText,
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
import { useI18n } from "@/locales/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { DetailItem } from "./DetailItemHelper";

type Props = {
  appointment: Appointment;
};

export const AppointmentActionCell = ({ appointment }: Props) => {
  console.log("Appointment data:", appointment);

  const t = useI18n();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    // try {
    //   const res = await deleteAppointment(appointment.id);
    //   if (res.status === 200 || res.status === 201) {
    //     toast.success(t("message.success_cancel"));
    //     setIsCancelOpen(false);
    //   } else {
    //     toast.error(res.message || "Failed to cancel");
    //   }
    // } catch (error) {
    //   toast.error("An error occurred");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>{t("table.actions")}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setIsViewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" /> {t("table.view_details")}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => console.log("Complete", appointment.id)}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />{" "}
            {t("table.mark_completed")}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsCancelOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" /> {t("table.cancel")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Details Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-125 p-0 overflow-hidden border-none shadow-2xl text-foreground!">
          {/* Header with Background Accent */}
          <div className="bg-primary/5 p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {t("table.appointment_details")}
                </DialogTitle>
                <Typography size="xs" color="foreground" className="mt-1">
                  PatietId: {appointment.patientUserId}
                </Typography>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Patient & Doctor Info Section */}
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

            {/* Schedule Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" /> <span>Date</span>
                  </div>
                  <Typography size="xs" color="foreground" className="px-6">
                    {appointment?.appointmentDate
                      ? format(
                          appointment?.appointmentDate,
                          "EEEE, dd MMM yyyy",
                        )
                      : "N/A"}
                  </Typography>
                </div>
                <div className="flex flex-col gap-1 border-l pl-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" /> <span>Time Slot</span>
                  </div>
                  <Typography
                    size="xs"
                    color="foreground"
                    className="font-semibold"
                  >
                    {appointment.startTime} - {appointment.endTime}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Location & Payment Section */}
            <div className="grid grid-cols-2 gap-6">
              <DetailItem
                icon={<MapPin className="w-4 h-4 text-primary" />}
                label="Location"
                value={appointment.locationName}
              />
              <DetailItem
                icon={<Banknote className="w-4 h-4 text-secondary" />}
                label="Consultation Fee"
                value={`${appointment.fees} BDT`}
              />
            </div>

            {/* Notes Section */}
            {appointment.notes && (
              <div className="bg-chart-5/10 p-4 rounded-lg border">
                <div className="flex items-center gap-2 text-chart-5 text-xs font-bold uppercase mb-1">
                  <FileText className="w-3 h-3" /> Notes
                </div>
                <p className="text-sm text-chart-5 italic">
                  &quot;{appointment.notes}&quot;
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {t("table.con_cancel")}
            </DialogTitle>
            <DialogDescription>
              {t("table.sureText")} <b>{appointment.patientName}</b>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCancelOpen(false)}
              disabled={loading}
            >
              {t("table.nokeepit")} No, Keep it
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={loading}
            >
              {loading ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

"use client";

import { useState } from "react";
import { useForm, useController, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { CalendarCheck2, Loader2, Clock, MapPin, LogIn, Stethoscope } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DoctorBookingFormValues,
  doctorBookingSchema,
} from "@/schema/doctor.booking.schema";
import { bookAppointment } from "@/actions/doctor/booking";
import { getDoctorAvailabilityWithLocation } from "@/actions/doctor/availability";
import { getAvailableSlots } from "@/actions/doctor/slot";
import { getAppointmentsByDate } from "@/actions/doctor/appointment";
import { UnavailableDate } from "@/types/doctor.unavailable";
import { SingleDoctorInfo } from "@/types/doctor";
import { DoctorLocation } from "@/types/doctor.location.type";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/locales/client";
import { cn } from "@/lib/utils";

const SectionHeading = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="flex items-center gap-2.5 mb-4">
    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <span className="text-sm font-semibold text-foreground">{label}</span>
  </div>
);

const DoctorBooking = ({
  locationOptions,
  doctorLocations,
  doctor,
  currentUserId,
  token,
  doctorUnAvailable = [],
  lang,
}: {
  locationOptions: { label: string; value: number }[];
  doctorLocations: DoctorLocation[];
  doctor: SingleDoctorInfo;
  token: string | null;
  currentUserId: number;
  doctorUnAvailable: UnavailableDate[];
  lang: string;
}) => {
  const t = useI18n();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const doctorUserId = doctor.userId;

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DoctorBookingFormValues>({
    resolver: zodResolver(doctorBookingSchema(t)),
    defaultValues: {
      location: "",
      availableDates: "",
      availableSlots: "",
      patientType: "new",
      appointmentTypeId: "",
    },
  });

  const selectedLocation = useWatch({ control, name: "location" });
  const selectedDate = useWatch({ control, name: "availableDates" });
  const patientType = useWatch({ control, name: "patientType" });
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const { field: dateField } = useController({ name: "availableDates", control });
  const { field: slotField } = useController({ name: "availableSlots", control });
  const { field: appointmentTypeField } = useController({ name: "appointmentTypeId", control });

  const { data: locationAvailability, isLoading: isLoadingAvailability } = useQuery({
    queryKey: ["doctorAvailability", doctorUserId, selectedLocation],
    queryFn: async () => {
      const res = await getDoctorAvailabilityWithLocation({
        lang,
        doctorUserId,
        doctorLocationId: Number(selectedLocation),
      });
      return res.payload || [];
    },
    enabled: !!selectedLocation,
  });

  const { data: slotData, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["availableSlots", doctorUserId, selectedLocation, selectedDate],
    queryFn: async () => {
      if (!selectedDate) return [];
      const res = await getAvailableSlots({
        doctorUserId,
        doctorLocationId: Number(selectedLocation),
        lang,
        requestedDate: format(parseISO(selectedDate), "yyyy-MM-dd"),
      });
      return res.payload || [];
    },
    enabled: Boolean(selectedDate && doctorUserId && selectedLocation),
  });

  const selectedLocationData = doctorLocations.find(
    (l) => l.locationId === Number(selectedLocation)
  );
  const newPatientFee = selectedLocationData?.newPatientFee ?? null;
  const oldPatientFee = selectedLocationData?.oldPatientFee ?? null;
  const feeCurrency = selectedLocationData?.feeCurrency ?? "";
  const formatFee = (fee: number | null) =>
    fee != null ? `${fee.toLocaleString()} ${feeCurrency}`.trim() : "Not available";

  const appointmentTypes = selectedLocationData?.supportedAppointmentTypes ?? [];

  const { data: appointmentsOnDate = [] } = useQuery({
    queryKey: ["appointmentsOnDate", doctorUserId, selectedDate],
    queryFn: () =>
      getAppointmentsByDate({
        doctorUserId,
        date: format(parseISO(selectedDate!), "yyyy-MM-dd"),
        lang,
      }),
    enabled: Boolean(selectedDate && doctorUserId),
  });

  const bookedStartTimes = new Set(
    appointmentsOnDate
      .filter((a) => a.appointmentStatus !== "CANCELLED")
      .map((a) => a.startTime)
  );

  const isDayAvailable = (date: Date) => {
    if (!locationAvailability?.content) return false;
    const dayName = format(date, "EEEE").toUpperCase();
    return locationAvailability.content.some((item: any) => item.dayOfWeek === dayName);
  };

  const isDateUnavailable = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return doctorUnAvailable.some((item) => item.unavailableDate === dateString);
  };

  const formatTimeTo12H = (time: string) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${minute} ${ampm}`;
  };

  const categorizeSlots = (slots: any[]) => {
    const groups: Record<string, any[]> = { Morning: [], Afternoon: [], Evening: [] };
    slots?.forEach((slot) => {
      const hour = parseInt(slot.startTime.split(":")[0]);
      const period = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
      groups[period].push(slot);
    });
    return groups;
  };

  const groupedSlots = categorizeSlots(slotData?.slots || []);
  const hasSlots = Object.values(groupedSlots).some((s) => s.length > 0);
  const isLoggedIn = !!token;

  const onSubmit = async (data: DoctorBookingFormValues) => {
    if (!token) { setShowLoginDialog(true); return; }
    const selectedSlotObj = slotData?.slots?.find((s: any) => s.startTime === data.availableSlots);
    if (!currentUserId) {
      setError("root", { type: "manual", message: "must login" });
      return;
    }
    const res = await bookAppointment({
      doctorUserId,
      patientUserId: currentUserId,
      appointmentDate: format(parseISO(data.availableDates), "yyyy-MM-dd"),
      dayOfWeek: format(parseISO(data.availableDates), "EEEE").toUpperCase(),
      fees: patientType === "new" ? (newPatientFee ?? 0) : (oldPatientFee ?? 0),
      appointmentTypeId: Number(data.appointmentTypeId),
      appointmentSlotDto: {
        locationId: Number(selectedLocation),
        startTime: selectedSlotObj?.startTime,
        endTime: selectedSlotObj?.endTime,
        slotDuration: selectedSlotObj?.slotDuration || 15,
        available: false,
      },
      notes: "Doctor booking request",
    });

    if (res.success) {
      const selectedLocationObj = locationOptions.find((l) => Number(l.value) === Number(selectedLocation));
      const params = new URLSearchParams({
        doctorUserId: String(doctorUserId),
        doctorName: `${doctor.firstName} ${doctor.lastName}`,
        designation: doctor.professionalInfoResponse?.designation || "",
        location: selectedLocationObj?.label || "",
        date: format(parseISO(data.availableDates), "do MMMM"),
        startTime: formatTimeTo12H(selectedSlotObj?.startTime),
        endTime: formatTimeTo12H(selectedSlotObj?.endTime),
        price: formatFee(patientType === "new" ? newPatientFee : oldPatientFee),
      });
      router.push(`/booking/confirmation?${params.toString()}`);
      return;
    }

    setError("root", { type: "manual", message: res.message });
  };

  return (
    <div className="border border-border rounded-xl bg-card shadow-sm flex-1">
      <div className="px-6 py-5 border-b border-border">
        <h3 className="text-base font-bold text-foreground">
          {t("booking.booking_appoinment")}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select a location, date and available time slot
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">
        {/* Location */}
        <div>
          <SectionHeading icon={MapPin} label={t("booking.select_location")} />
          <ControlledSelect
            name="location"
            control={control}
            placeholder={t("booking.select_location")}
            options={locationOptions}
            onChange={() => {
              setValue("availableDates", "");
              setValue("availableSlots", "");
              queryClient.removeQueries({ queryKey: ["availableDates", "availableSlots"] });
            }}
          />
        </div>

        <Separator />

        {/* Patient Type */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Consultation Fees
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setValue("patientType", "new")}
              className={cn(
                "rounded-lg px-3 py-2.5 text-center border transition-all duration-200",
                patientType === "new"
                  ? "bg-secondary/20 border-secondary"
                  : "bg-secondary/10 border-secondary/20 hover:border-secondary/50",
              )}
            >
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-1">
                {t("booking.patient_types.new")}
              </p>
              <p className={`text-sm font-bold ${newPatientFee != null ? "text-secondary" : "text-muted-foreground"}`}>
                {formatFee(newPatientFee)}
              </p>
            </button>
            <button
              type="button"
              onClick={() => setValue("patientType", "returning")}
              className={cn(
                "rounded-lg px-3 py-2.5 text-center border transition-all duration-200",
                patientType === "returning"
                  ? "bg-primary/20 border-primary"
                  : "bg-primary/10 border-primary/20 hover:border-primary/50",
              )}
            >
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-1">
                {t("booking.patient_types.returning")}
              </p>
              <p className={`text-sm font-bold ${oldPatientFee != null ? "text-primary" : "text-muted-foreground"}`}>
                {formatFee(oldPatientFee)}
              </p>
            </button>
          </div>
        </div>

        <Separator />

        {/* Appointment Type */}
        {appointmentTypes.length > 0 && (
          <>
            <div>
              <SectionHeading icon={Stethoscope} label="Appointment Type" />
              <div className="space-y-2">
                {appointmentTypes.map((type) => {
                  const isSelected = appointmentTypeField.value === String(type.id);
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => appointmentTypeField.onChange(String(type.id))}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg px-4 py-3 border text-left transition-all duration-200",
                        isSelected
                          ? "bg-primary/10 border-primary"
                          : "bg-background border-border hover:border-primary/40 hover:bg-primary/5",
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                          isSelected ? "border-primary" : "border-muted-foreground/40",
                        )}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <div>
                        <p className={cn("text-sm font-medium", isSelected ? "text-primary" : "text-foreground")}>
                          {type.name}
                        </p>
                        {type.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.appointmentTypeId && (
                <p className="text-xs text-destructive mt-2">
                  {errors.appointmentTypeId.message}
                </p>
              )}
            </div>
            <Separator />
          </>
        )}

        {/* Calendar */}
        <div>
          <SectionHeading icon={CalendarCheck2} label={t("booking.available_dates")} />
          {isLoadingAvailability ? (
            <div className="w-full h-64 rounded-xl bg-muted animate-pulse" />
          ) : (
            <Calendar
              key={selectedLocation}
              mode="single"
              locale={enUS}
              className="mx-auto border rounded-xl"
              selected={
                dateField.value && !isNaN(new Date(dateField.value).getTime())
                  ? new Date(dateField.value)
                  : undefined
              }
              onSelect={(date) => {
                dateField.onChange(date?.toISOString());
                setValue("availableSlots", "");
              }}
              disabled={(date) =>
                !selectedLocation ||
                date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                !isDayAvailable(date) ||
                isDateUnavailable(date)
              }
              modifiers={{
                available: (date) => isDayAvailable(date) && !isDateUnavailable(date),
                unavailable: (date) => isDateUnavailable(date),
              }}
              modifiersClassNames={{
                available: "bg-secondary/15 text-foreground font-medium",
                unavailable: "bg-destructive/10 text-destructive line-through",
                selected: "bg-primary! text-white! font-bold!",
              }}
            />
          )}
          {errors.availableDates && (
            <p className="text-xs text-destructive mt-2 text-center">
              {errors.availableDates.message}
            </p>
          )}
        </div>

        <Separator />

        {/* Slots */}
        <div>
          <SectionHeading icon={Clock} label={t("booking.available_slots")} />

          {!selectedDate ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t("booking.select_date_first")}
            </p>
          ) : isLoadingSlots ? (
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 w-28 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : !hasSlots ? (
            <p className="text-sm text-destructive font-medium text-center py-4">
              {t("booking.no_slot_available")}
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedSlots).map(
                ([label, slots]) =>
                  slots.length > 0 && (
                    <div key={label}>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        {label}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {slots.map((slot, idx) => {
                          const isSelected = slotField.value === slot.startTime;
                          const isBooked = slot.available === false || bookedStartTimes.has(slot.startTime);
                          return (
                            <button
                              key={idx}
                              type="button"
                              disabled={isBooked}
                              onClick={() => !isBooked && slotField.onChange(slot.startTime)}
                              className={cn(
                                "text-xs font-medium px-3 py-2 rounded-lg border transition-all",
                                isBooked
                                  ? "bg-destructive/10 text-destructive/60 border-destructive/20 line-through cursor-not-allowed"
                                  : isSelected
                                    ? "bg-primary text-white border-primary shadow-sm"
                                    : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5",
                              )}
                            >
                              {formatTimeTo12H(slot.startTime)} – {formatTimeTo12H(slot.endTime)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ),
              )}
            </div>
          )}

          {errors.availableSlots && (
            <p className="text-xs text-destructive mt-2 text-center">
              {errors.availableSlots.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p className="text-xs text-destructive font-medium">{errors.root.message}</p>
        )}

        <Button type="submit" className="w-full font-semibold h-11" disabled={isSubmitting}>
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Booking...</>
          ) : (
            t("booking.confirm_booking")
          )}
        </Button>
      </form>

      {/* Login Dialog */}
      <Dialog open={!isLoggedIn && showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                <LogIn className="h-4 w-4 text-primary" />
              </div>
              <DialogTitle className="text-base font-semibold">
                {t("booking.login.title")}
              </DialogTitle>
            </div>
            <DialogDescription>{t("booking.login.des")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              {t("booking.login.cancel_btn")}
            </Button>
            <Button onClick={() => router.push(`/patient/login?callback=${encodeURIComponent(pathname)}`)}>
              {t("booking.login.login_btn")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorBooking;

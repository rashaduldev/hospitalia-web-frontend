"use client";

import { useState } from "react";
import { useForm, useController, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  CalendarCheck2,
  Loader2,
  Clock,
  MapPin,
  Stethoscope,
  User,
  Phone,
  CalendarPlus,
  CheckCircle2,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import {
  offlineBookingSchema,
  OfflineBookingFormValues,
} from "@/schema/offline.booking.schema";
import { getDoctorAvailabilityByDoctorId } from "@/actions/doctor/availability";
import { getAvailableSlots } from "@/actions/doctor/slot";
import { getAppointmentsByDate } from "@/actions/doctor/appointment";
import { getDoctorLocations } from "@/actions/doctor/location";
import { getDoctorUnAvailability } from "@/actions/doctor/unavailability";
import { DoctorLocation } from "@/types/doctor.location.type";
import { UnavailableDate } from "@/types/doctor.unavailable";
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

interface OfflineBookingWidgetProps {
  doctorId: number;
  doctorUserId: number;
  doctorName: string;
  doctorDesignation?: string;
  lang: string;
  defaultLocationId?: number;
}

export function OfflineBookingWidget({
  doctorId,
  doctorUserId: _doctorUserId,
  doctorName,
  doctorDesignation,
  lang,
  defaultLocationId,
}: OfflineBookingWidgetProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<OfflineBookingFormValues | null>(null);
  const queryClient = useQueryClient();

  const buildDefaultValues = () => ({
    patientFirstName: "",
    patientLastName: "",
    patientPhone: "",
    location: defaultLocationId ? String(defaultLocationId) : "",
    patientType: "new" as const,
    appointmentTypeId: "",
    availableDates: "",
    availableSlots: "",
  });

  const {
    handleSubmit,
    control,
    setValue,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OfflineBookingFormValues>({
    resolver: zodResolver(offlineBookingSchema),
    defaultValues: buildDefaultValues(),
  });

  const selectedLocation = useWatch({ control, name: "location" });
  const selectedDate = useWatch({ control, name: "availableDates" });
  const patientType = useWatch({ control, name: "patientType" });
  const { field: dateField } = useController({ name: "availableDates", control });
  const { field: slotField } = useController({ name: "availableSlots", control });
  const { field: appointmentTypeField } = useController({
    name: "appointmentTypeId",
    control,
  });

  // Fetch doctor locations
  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ["offline-booking-locations", doctorId],
    queryFn: async () => {
      const res = await getDoctorLocations({ doctorId, lang });
      return (res.payload as DoctorLocation[]) || [];
    },
    enabled: open && !!doctorId,
  });

  // Fetch unavailability (paginated response — extract .content array)
  const { data: unavailableDates = [] } = useQuery({
    queryKey: ["offline-booking-unavailability", doctorId],
    queryFn: async () => {
      const res = await getDoctorUnAvailability({ doctorId, lang });
      return (res.payload as any)?.content as UnavailableDate[] || [];
    },
    enabled: open && !!doctorId,
  });

  const locationOptions = (locationsData || []).map((l) => ({
    label: l.locationName,
    value: l.locationId,
  }));

  // Fetch weekly availability when location selected
  const { data: locationAvailability, isLoading: isLoadingAvailability } = useQuery({
    queryKey: ["offline-booking-availability", doctorId, selectedLocation],
    queryFn: async () => {
      const res = await getDoctorAvailabilityByDoctorId({
        lang,
        doctorId,
        doctorLocationId: Number(selectedLocation),
      });
      return res.payload || [];
    },
    enabled: !!selectedLocation,
  });

  // Fetch slots when date selected
  const { data: slotData, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["offline-booking-slots", doctorId, selectedLocation, selectedDate],
    queryFn: async () => {
      if (!selectedDate) return [];
      const res = await getAvailableSlots({
        doctorId,
        doctorLocationId: Number(selectedLocation),
        lang,
        requestedDate: format(parseISO(selectedDate), "yyyy-MM-dd"),
      });
      return res.payload || [];
    },
    enabled: Boolean(selectedDate && doctorId && selectedLocation),
  });

  // Fetch booked appointments on selected date to mark booked slots
  const { data: appointmentsOnDate = [] } = useQuery({
    queryKey: ["offline-booking-appointments-on-date", doctorId, selectedDate],
    queryFn: () =>
      getAppointmentsByDate({
        doctorId,
        date: format(parseISO(selectedDate!), "yyyy-MM-dd"),
        lang,
      }),
    enabled: Boolean(selectedDate && doctorId),
  });

  const selectedLocationData = (locationsData || []).find(
    (l) => l.locationId === Number(selectedLocation)
  );
  const newPatientFee = selectedLocationData?.newPatientFee ?? null;
  const oldPatientFee = selectedLocationData?.oldPatientFee ?? null;
  const feeCurrency = selectedLocationData?.feeCurrency ?? "";
  const appointmentTypes = selectedLocationData?.supportedAppointmentTypes ?? [];

  const formatFee = (fee: number | null) =>
    fee != null ? `${fee.toLocaleString()} ${feeCurrency}`.trim() : "Not set";

  const bookedStartTimes = new Set(
    appointmentsOnDate
      .filter((a: any) => a.appointmentStatus !== "CANCELLED")
      .map((a: any) => a.startTime)
  );

  const isDayAvailable = (date: Date) => {
    if (!locationAvailability?.content) return false;
    const dayName = format(date, "EEEE").toUpperCase();
    return locationAvailability.content.some((item: any) => item.dayOfWeek === dayName);
  };

  const isDateUnavailable = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return unavailableDates.some((item) => item.unavailableDate === dateString);
  };

  const formatTimeTo12H = (time: string) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const h = parseInt(hour);
    return `${h % 12 || 12}:${minute} ${h >= 12 ? "PM" : "AM"}`;
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

  const onSubmit = async (data: OfflineBookingFormValues) => {
    const selectedSlotObj = slotData?.slots?.find(
      (s: any) => s.startTime === data.availableSlots
    );

    const payload = {
      doctorId,
      patientUserId: null,
      patientInfo: {
        firstName: data.patientFirstName,
        lastName: data.patientLastName,
        phone: data.patientPhone,
      },
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
      notes: `Offline booking — ${data.patientFirstName} ${data.patientLastName} (${data.patientPhone})`,
    };

    console.log("[Offline Booking] Payload ready (API call deferred):", payload);
    setSubmittedData(data);
    setSubmitted(true);
  };

  const handleOpenChange = (v: boolean) => {
    if (v) {
      reset(buildDefaultValues());
      setSubmitted(false);
      setSubmittedData(null);
      setOpen(true);
    } else {
      setOpen(false);
      setTimeout(() => {
        setSubmitted(false);
        setSubmittedData(null);
        reset(buildDefaultValues());
      }, 300);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="gap-2 shrink-0">
          <CalendarPlus className="w-4 h-4" />
          Book Offline Appointment
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-lg flex flex-col gap-0 p-0"
      >
        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <SheetTitle className="text-base font-bold leading-none">
            Offline Appointment Booking
          </SheetTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Book an appointment on behalf of a walk-in or phone-in patient
          </p>
        </SheetHeader>

        {submitted && submittedData ? (
          // Success / review state
          <div className="flex flex-col items-center justify-center flex-1 gap-5 px-6 py-8">
            <div className="p-4 bg-secondary/10 rounded-full">
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold">Booking Ready</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Patient details and slot have been collected. The submission API will be wired up shortly.
              </p>
            </div>
            <div className="w-full bg-muted/40 border border-border rounded-xl p-4 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Patient</span>
                <span className="font-medium">
                  {submittedData.patientFirstName} {submittedData.patientLastName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{submittedData.patientPhone}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {format(parseISO(submittedData.availableDates), "do MMMM yyyy")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">
                  {formatTimeTo12H(submittedData.availableSlots)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Patient Type</span>
                <span className="font-medium capitalize">{submittedData.patientType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Doctor</span>
                <span className="font-medium">{doctorName}</span>
              </div>
            </div>
            <div className="w-full flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSubmitted(false);
                  setSubmittedData(null);
                  reset(buildDefaultValues());
                }}
              >
                Book Another
              </Button>
              <Button className="flex-1" onClick={() => handleOpenChange(false)}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">

              {/* Doctor (pre-set, read-only display) */}
              <div>
                <SectionHeading icon={Stethoscope} label="Doctor" />
                <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{doctorName}</p>
                    {doctorDesignation && (
                      <p className="text-xs text-muted-foreground truncate">{doctorDesignation}</p>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full shrink-0">
                    Pre-set
                  </span>
                </div>
              </div>

              <Separator />

              {/* Patient Information */}
              <div>
                <SectionHeading icon={User} label="Patient Information" />
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="offlinePatientFirstName">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="offlinePatientFirstName"
                        {...register("patientFirstName")}
                        placeholder="John"
                      />
                      {errors.patientFirstName && (
                        <p className="text-xs text-destructive">
                          {errors.patientFirstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="offlinePatientLastName">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="offlinePatientLastName"
                        {...register("patientLastName")}
                        placeholder="Doe"
                      />
                      {errors.patientLastName && (
                        <p className="text-xs text-destructive">
                          {errors.patientLastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="offlinePatientPhone">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      <Input
                        id="offlinePatientPhone"
                        {...register("patientPhone")}
                        type="tel"
                        placeholder="+1 234 567 8900"
                        className="pl-9"
                      />
                    </div>
                    {errors.patientPhone && (
                      <p className="text-xs text-destructive">{errors.patientPhone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location */}
              <div>
                <SectionHeading icon={MapPin} label="Location" />
                {isLoadingLocations ? (
                  <div className="h-10 rounded-lg bg-muted animate-pulse" />
                ) : (
                  <ControlledSelect
                    name="location"
                    control={control}
                    placeholder="Select location"
                    options={locationOptions}
                    onChange={() => {
                      setValue("availableDates", "");
                      setValue("availableSlots", "");
                      setValue("appointmentTypeId", "");
                      queryClient.removeQueries({
                        queryKey: ["offline-booking-availability"],
                      });
                    }}
                  />
                )}
              </div>

              <Separator />

              {/* Consultation Fees / Patient Type */}
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
                        : "bg-secondary/10 border-secondary/20 hover:border-secondary/50"
                    )}
                  >
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-1">
                      New Patient
                    </p>
                    <p
                      className={`text-sm font-bold ${newPatientFee != null ? "text-secondary" : "text-muted-foreground"}`}
                    >
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
                        : "bg-primary/10 border-primary/20 hover:border-primary/50"
                    )}
                  >
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-1">
                      Returning
                    </p>
                    <p
                      className={`text-sm font-bold ${oldPatientFee != null ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {formatFee(oldPatientFee)}
                    </p>
                  </button>
                </div>
              </div>

              {/* Appointment Type */}
              {appointmentTypes.length > 0 && (
                <>
                  <Separator />
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
                                : "bg-background border-border hover:border-primary/40 hover:bg-primary/5"
                            )}
                          >
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                                isSelected ? "border-primary" : "border-muted-foreground/40"
                              )}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  isSelected ? "text-primary" : "text-foreground"
                                )}
                              >
                                {type.name}
                              </p>
                              {type.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {type.description}
                                </p>
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
                </>
              )}

              <Separator />

              {/* Calendar */}
              <div>
                <SectionHeading icon={CalendarCheck2} label="Select Date" />
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
                      available: (date) =>
                        isDayAvailable(date) && !isDateUnavailable(date),
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

              {/* Time Slots */}
              <div>
                <SectionHeading icon={Clock} label="Available Time Slots" />
                {!selectedDate ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Select a date to see available slots
                  </p>
                ) : isLoadingSlots ? (
                  <div className="flex flex-wrap gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-10 w-28 rounded-lg bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : !hasSlots ? (
                  <p className="text-sm text-destructive font-medium text-center py-4">
                    No slots available for this date
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
                                const isBooked =
                                  slot.available === false ||
                                  bookedStartTimes.has(slot.startTime);
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    disabled={isBooked}
                                    onClick={() =>
                                      !isBooked && slotField.onChange(slot.startTime)
                                    }
                                    className={cn(
                                      "text-xs font-medium px-3 py-2 rounded-lg border transition-all",
                                      isBooked
                                        ? "bg-destructive/10 text-destructive/60 border-destructive/20 line-through cursor-not-allowed"
                                        : isSelected
                                          ? "bg-primary text-white border-primary shadow-sm"
                                          : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                                    )}
                                  >
                                    {formatTimeTo12H(slot.startTime)} –{" "}
                                    {formatTimeTo12H(slot.endTime)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                )}
                {errors.availableSlots && (
                  <p className="text-xs text-destructive mt-2 text-center">
                    {errors.availableSlots.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full font-semibold h-11"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...
                  </>
                ) : (
                  "Confirm Offline Booking"
                )}
              </Button>
            </form>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}

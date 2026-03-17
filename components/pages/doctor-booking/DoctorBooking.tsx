"use client";

import { useState } from "react";
import { useForm, useController, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { CalendarCheck2, Loader2, Clock } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { Calendar } from "@/components/ui/calendar";
import { Typography } from "@/components/ui/Typography";
import AppButton from "@/components/common/AppButton";
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
import { UnavailableDate } from "@/types/doctor.unavailable";
import { SingleDoctorInfo } from "@/types/doctor";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/locales/client";
import { cn } from "@/lib/utils";

const DoctorBooking = ({
  locationOptions,
  doctor,
  currentUserId,
  token,
  doctorUnAvailable = [],
  lang,
  onBookingSuccess,
}: {
  locationOptions: { label: string; value: number }[];
  doctor: SingleDoctorInfo;
  token: string | null;
  currentUserId: number;
  doctorUnAvailable: UnavailableDate[];
  lang: string;
  onBookingSuccess?: (info: any) => void;
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
    },
  });

  const selectedLocation = useWatch({ control, name: "location" });
  const selectedDate = useWatch({ control, name: "availableDates" });
  const patientType = useWatch({ control, name: "patientType" });
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const { field: dateField } = useController({
    name: "availableDates",
    control,
  });
  const { field: slotField } = useController({
    name: "availableSlots",
    control,
  });

  // Availability Query
  const { data: locationAvailability, isLoading: isLoadingAvailability } =
    useQuery({
      queryKey: ["doctorAvailability", doctorUserId, selectedLocation],
      queryFn: async () => {
        const res = await getDoctorAvailabilityWithLocation({
          lang,
          doctorUserId: doctorUserId,
          doctorLocationId: Number(selectedLocation),
        });
        return res.payload || [];
      },
      enabled: !!selectedLocation,
    });

  // Slots Query
  const { data: slotData, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["availableSlots", doctorUserId, selectedLocation, selectedDate],
    queryFn: async () => {
      if (!selectedDate) return [];
      const res = await getAvailableSlots({
        doctorUserId: doctorUserId,
        doctorLocationId: Number(selectedLocation),
        lang,
        requestedDate: format(parseISO(selectedDate), "yyyy-MM-dd"),
      });

      return res.payload || [];
    },
    enabled: Boolean(selectedDate && doctorUserId && selectedLocation),
  });

  // --- Helper Functions ---
  const isDayAvailable = (date: Date) => {
    if (!locationAvailability?.content) return false;
    const dayName = format(date, "EEEE").toUpperCase();
    return locationAvailability.content.some(
      (item: any) => item.dayOfWeek === dayName,
    );
  };

  const isDateUnavailable = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return doctorUnAvailable.some(
      (item) => item.unavailableDate === dateString,
    );
  };

  const formatTimeTo12H = (time: string) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minute}${ampm}`;
  };

  const categorizeSlots = (slots: any[]) => {
    const groups: Record<string, any[]> = {
      Morning: [],
      Afternoon: [],
      Evening: [],
    };

    slots?.forEach((slot) => {
      const hour = parseInt(slot.startTime.split(":")[0]);
      let period = "Evening";
      if (hour < 12) period = "Morning";
      else if (hour < 17) period = "Afternoon";

      groups[period].push(slot);
    });

    return groups;
  };

  const groupedSlots = categorizeSlots(slotData?.slots || []);
  const hasSlots = Object.values(groupedSlots).some(
    (slots) => slots.length > 0,
  );
  const isLoggedIn = !!token;
  const redirectToLogin = () => {
    router.push(`/patient/login?callback=${encodeURIComponent(pathname)}`);
  };
  // Submit
  const onSubmit = async (data: DoctorBookingFormValues) => {
    if (!token) {
      setShowLoginDialog(true);
      return;
    }
    const selectedSlotObj = slotData?.slots?.find(
      (s: any) => s.startTime === data.availableSlots,
    );
    if (!currentUserId) {
      setError("root", {
        type: "manual",
        message: "must login",
      });
    }
    const res = await bookAppointment({
      doctorUserId: doctorUserId,
      patientUserId: currentUserId,
      appointmentDate: format(parseISO(data.availableDates), "yyyy-MM-dd"),
      dayOfWeek: format(parseISO(data.availableDates), "EEEE").toUpperCase(),
      fees: patientType === "new" ? 25000 : 10000,
      appointmentTypeId: patientType === "new" ? 1 : 2,
      appointmentSlotDto: {
        locationId: Number(selectedLocation),
        startTime: selectedSlotObj?.startTime,
        endTime: selectedSlotObj?.endTime,
        slotDuration: selectedSlotObj?.duration || 15,
        available: false,
      },
      notes: "Doctor booking request",
    });

    if (res.success) {
      const selectedLocationObj = locationOptions.find(
        (l) => Number(l.value) == Number(selectedLocation),
      );

      if (onBookingSuccess) {
        onBookingSuccess({
          doctorName: `${doctor.firstName} ${doctor.lastName}`,
          designation: `${doctor.professionalInfoResponse?.designation}`,
          location: selectedLocationObj?.label || "",
          date: format(parseISO(data.availableDates), "do MMMM"),
          startTime: formatTimeTo12H(selectedSlotObj?.startTime),
          endTime: formatTimeTo12H(selectedSlotObj?.endTime),
          price: patientType === "new" ? "25,000 CFA" : "10,000 CFA",
        });
      }

      return;
    }

    if (!res.success) {
      setError("root", {
        type: "manual",
        message: res.message,
      });
      return;
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Typography
          size="3xl"
          weight="semiBold"
          color="secondary"
          className="text-center"
        >
          {t("booking.booking_appoinment")}
        </Typography>

        {/* Location Select */}
        <ControlledSelect
          className="text-left"
          name="location"
          control={control}
          placeholder={t("booking.select_location")}
          options={locationOptions}
          onChange={(value) => {
            setValue("location", value);
            setValue("availableDates", "");
            setValue("availableSlots", "");

            queryClient.removeQueries({
              queryKey: ["availableSlots"],
            });
          }}
        />
        <div className="text-center space-y-6">
          <div className="space-y-1">
            <Typography
              size="xs"
              color="muted_foreground"
              className="wrap-break-word"
            >
              {locationOptions &&
                locationOptions.map((item) => item.label).join(", ")}
            </Typography>
          </div>
          {/* Patient Type Select */}
          <div className="grid grid-cols-2 gap-3">
            {(["new", "returning"] as const).map((type, index) => {
              const isSelected = patientType === type;
              const isPrimary = index === 1;
              const borderColor = isPrimary
                ? "border-primary"
                : "border-secondary";
              const bgColor = isPrimary
                ? "bg-primary/90 hover:bg-primary/90"
                : "bg-secondary/90 hover:bg-secondary/90";

              return (
                <AppButton
                  key={type}
                  type="button"
                  onClick={() => setValue("patientType", type)}
                  className={cn(
                    "w-full block rounded-sm text-muted font-medium text-sm transition-all",
                    bgColor,
                    isSelected ? `border-4 font-bold ${borderColor}` : "border",
                  )}
                >
                  {type === "new"
                    ? t("booking.patient_types.new")
                    : t("booking.patient_types.returning")}
                </AppButton>
              );
            })}
          </div>
          <Typography
            color="foreground"
            className="py-2 bg-primary/20 px-10 rounded-sm leading-4 text-[0.625rem]"
          >
            {t("booking.booking_des")}
          </Typography>
        </div>
        {/* Calendar */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <CalendarCheck2 size={24} className="text-primary h-6 w-6" />
            </div>
            <Typography size="xl" weight="semiBold" color="secondary">
              {t("booking.available_dates")}
            </Typography>
          </div>
          {isLoadingAvailability ? (
            <div className="mx-auto border rounded-sm w-full max-w-sm h-70 bg-muted-foreground/10 animate-pulse"></div>
          ) : (
            <Calendar
              mode="single"
              className="mx-auto border rounded-sm"
              selected={dateField.value ? new Date(dateField.value) : undefined}
              onSelect={(date) => dateField.onChange(date?.toISOString())}
              disabled={(date) =>
                !selectedLocation ||
                date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                !isDayAvailable(date) ||
                isDateUnavailable(date)
              }
              modifiers={{
                today: new Date(),
                available: (date) =>
                  isDayAvailable(date) && !isDateUnavailable(date),
                unavailable: (date) => isDateUnavailable(date),
              }}
              modifiersClassNames={{
                today: "rounded-sm",
                available:
                  "bg-secondary-foreground/80 text-foreground font-normal",
                unavailable: "bg-destructive text-muted!",
                selected:
                  "border border-secondary bg-secondary text-foreground !font-bold",
              }}
            />
          )}

          {errors.availableDates && (
            <Typography size="xs" className="text-destructive text-center">
              {errors.availableDates.message}
            </Typography>
          )}
        </div>

        {/* Slots Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <Clock size={24} className="text-primary h-6 w-6" />
            </div>
            <Typography size="xl" weight="semiBold" color="secondary">
              {t("booking.available_slots")}
            </Typography>
          </div>

          {!selectedDate ? (
            <Typography
              size="xs"
              color="foreground"
              weight="semiBold"
              className="text-center"
            >
              {t("booking.select_date_first")}
            </Typography>
          ) : isLoadingSlots ? (
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center py-4 px-2 rounded-sm border w-20 h-16 bg-muted-foreground/20 animate-pulse"
                >
                  <div className="h-3 w-12 bg-muted-foreground/10 rounded mb-1"></div>
                  <div className="h-3 w-16 bg-muted-foreground/10 rounded"></div>
                </div>
              ))}
            </div>
          ) : !hasSlots ? (
            <Typography size="sm" className="text-destructive font-medium">
              {t("booking.no_slot_available")}
            </Typography>
          ) : (
            /* 3. SHOW SLOTS IF THEY EXIST */
            <div className="space-y-6">
              {Object.entries(groupedSlots).map(
                ([label, slots]) =>
                  slots.length > 0 && (
                    <div key={label} className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-muted-foreground/10 p-2 rounded-sm">
                        {slots.map((slot, idx) => {
                          const isSelected = slotField.value === slot.startTime;
                          return (
                            <AppButton
                              key={idx}
                              type="button"
                              onClick={() => slotField.onChange(slot.startTime)}
                              className={cn(
                                "flex flex-col items-center justify-center p-2 h-auto rounded-sm border bg-secondary-foreground hover:bg-secondary-foreground transition-all",
                                {
                                  "border-secondary": isSelected,
                                  "border-transparent": !isSelected,
                                },
                              )}
                            >
                              <Typography
                                size="xs"
                                color="foreground"
                                className="px-1 mb-1 opacity-70"
                              >
                                {label}
                              </Typography>
                              <Typography
                                size="xs"
                                color="foreground"
                                weight={isSelected ? "semiBold" : "normal"}
                              >
                                {formatTimeTo12H(slot.startTime)} -{" "}
                                {formatTimeTo12H(slot.endTime)}
                              </Typography>
                            </AppButton>
                          );
                        })}
                      </div>
                    </div>
                  ),
              )}
            </div>
          )}
          {errors.availableSlots && (
            <Typography
              size="xs"
              className="text-destructive text-center font-medium mt-2"
            >
              {errors.availableSlots.message}
            </Typography>
          )}
        </div>
        {errors.root && (
          <div className="">
            <Typography
              size="xs"
              weight="medium"
              color="destructive"
              className="text-left"
            >
              {errors.root.message}
            </Typography>
          </div>
        )}

        {/* Submit Button */}
        <AppButton
          type="submit"
          className="w-full text-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            t("booking.confirm_booking")
          )}
        </AppButton>
      </form>

      {/* Login Dialog */}
      <Dialog
        open={!isLoggedIn && showLoginDialog}
        onOpenChange={setShowLoginDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {t("booking.login.title")}
            </DialogTitle>
            <DialogDescription>{t("booking.login.des")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 sm:justify-end">
            <AppButton
              variant="outline"
              onClick={() => setShowLoginDialog(false)}
            >
              {t("booking.login.cancel_btn")}
            </AppButton>
            <AppButton onClick={redirectToLogin}>
              {t("booking.login.login_btn")}
            </AppButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorBooking;

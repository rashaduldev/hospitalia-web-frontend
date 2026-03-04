"use client";

import { useState } from "react";
import { useForm, useController, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { CalendarCheck2, Loader2, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
import { DoctorBookingType } from "@/types/doctor.booking";

const DoctorBooking = ({
  locationOptions,
  doctorUserId,
  currentUserId,
  token,
  doctorUnAvailable = [],
  lang = "en",
}: DoctorBookingType) => {
  const router = useRouter();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DoctorBookingFormValues>({
    resolver: zodResolver(doctorBookingSchema),
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
          doctorUserId,
          doctorLocationId: Number(selectedLocation),
        });
        return res.payload || [];
      },
      enabled: !!selectedLocation,
    });

  // Slots Query
  const { data: slotData, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["availableSlots", doctorUserId, selectedDate],
    queryFn: async () => {
      if (!selectedDate) return [];
      const res = await getAvailableSlots({
        doctorUserId,
        lang,
        requestedDate: format(parseISO(selectedDate), "yyyy-MM-dd"),
      });

      return res.payload || [];
    },
    enabled: Boolean(selectedDate && doctorUserId),
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

  // Submit
  const onSubmit = async (data: DoctorBookingFormValues) => {
    if (!token) {
      return setShowLoginDialog(true);
    }

    const selectedSlotObj = slotData?.slots?.find(
      (s: any) => s.startTime === data.availableSlots,
    );
    const res = await bookAppointment({
      doctorUserId,
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
      router.push("/success");
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
    <div className="max-w-xl mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Typography
          size="3xl"
          weight="semiBold"
          color="secondary"
          className="text-center"
        >
          Book Appointment
        </Typography>

        {/* Location Select */}
        <ControlledSelect
          className="text-left"
          name="location"
          control={control}
          placeholder="Select Location"
          options={locationOptions}
          onChange={() => {
            setValue("availableDates", "");
            setValue("availableSlots", "");
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
                  className={`w-full block rounded-sm text-muted font-medium text-sm ${bgColor} ${isSelected ? `border-2 ${borderColor}` : "border border-transparent"} transition-all`}
                >
                  {type === "new"
                    ? "New Patient: 25,000 CFA"
                    : "Returning Patient: 10,000 CFA"}
                </AppButton>
              );
            })}
          </div>
          <Typography
            color="foreground"
            className="py-2 bg-primary/20 px-10 rounded-sm leading-4 text-[0.625rem]"
          >
            AVAILABLE ON REQUEST: Confirmation of availability may need further
            processing of your request with the doctor.
          </Typography>
        </div>
        {/* Calendar */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <CalendarCheck2 size={24} className="text-primary h-6 w-6" />
            </div>
            <Typography size="xl" weight="semiBold" color="secondary">
              Available Dates
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
                available: (date) =>
                  isDayAvailable(date) && !isDateUnavailable(date),
                unavailable: (date) => isDateUnavailable(date),
              }}
              modifiersClassNames={{
                available: "bg-secondary-foreground text-foreground",
                unavailable: "bg-destructive text-muted!",
                selected: "border-1 border-secondary",
              }}
            />
          )}

          {errors.availableDates && (
            <Typography size="xs" className="text-destructive">
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
              Available Slots
            </Typography>
          </div>

          {!selectedDate ? (
            <Typography
              size="xs"
              color="foreground"
              weight="semiBold"
              className="text-center"
            >
              Please select a date first
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
              No slots available for this date. Please try another day.
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
                              className={`flex flex-col items-center justify-center p-2 h-auto rounded-sm border bg-secondary-foreground hover:bg-secondary-foreground transition-all ${
                                isSelected
                                  ? "border-secondary"
                                  : "border-transparent bg-secondary-foreground"
                              }`}
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
            "Confirm Booking"
          )}
        </AppButton>
      </form>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Authentication Required
            </DialogTitle>
            <DialogDescription>
              Please login to your account to confirm this booking. Only
              registered patients can book appointments.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 sm:justify-end">
            <AppButton
              variant="outline"
              onClick={() => setShowLoginDialog(false)}
            >
              Cancel
            </AppButton>
            <AppButton
              onClick={() => (window.location.href = "/patient/login")}
            >
              Go to Login
            </AppButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorBooking;

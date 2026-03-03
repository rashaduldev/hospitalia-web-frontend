"use client";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { Calendar } from "@/components/ui/calendar";
import { Typography } from "@/components/ui/Typography";
import {
  DoctorBookingFormValues,
  doctorBookingSchema,
} from "@/schema/doctor.booking.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck2, Loader2 } from "lucide-react";
import { useForm, useController } from "react-hook-form";
import { format } from "date-fns";
import AppButton from "@/components/common/AppButton";

const DoctorBooking = ({
  locationOptions,
  doctorAvailable = [],
  doctorUnAvailable = [],
}: {
  locationOptions: any;
  doctorAvailable: any[];
  doctorUnAvailable: any[];
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DoctorBookingFormValues>({
    resolver: zodResolver(doctorBookingSchema),
    defaultValues: {
      location: "",
      availableDates: "",
      availableSlots: "",
    },
  });
  console.log("locationOptions", locationOptions);

  const { field } = useController({
    name: "availableDates",
    control,
  });

  // Logic helpers
  const isDayAvailable = (date: Date) => {
    const dayName = format(date, "EEEE").toUpperCase();
    return doctorAvailable.some((item) => item.dayOfWeek === dayName);
  };

  const isDateUnavailable = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return doctorUnAvailable.some(
      (item) => item.unavailableDate === dateString,
    );
  };
  // Helper to generate slots
  const getAvailableSlots = (selectedDate: string) => {
    if (!selectedDate) return [];

    const dayName = format(new Date(selectedDate), "EEEE").toUpperCase();
    const availability = doctorAvailable.find((a) => a.dayOfWeek === dayName);

    if (!availability) return [];

    const slots = [];
    let current = new Date(`1970-01-01T${availability.startTime}`);
    const end = new Date(`1970-01-01T${availability.endTime}`);

    while (current < end) {
      const slotTime = format(current, "HH:mm");
      slots.push(slotTime);
      // Increment by timeSlot minutes
      current = new Date(current.getTime() + availability.timeSlot * 60000);
    }
    return slots;
  };

  const slots = getAvailableSlots(field.value);

  const onSubmit = (data: DoctorBookingFormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Typography size="3xl" weight="semiBold" color="secondary">
        Book Appointment
      </Typography>

      <div className="space-y-1">
        <ControlledSelect
          name="location"
          control={control}
          placeholder="Select Location"
          options={locationOptions}
        />
      </div>
      <Typography
        as="h3"
        size="xs"
        color="muted_foreground"
        className="wrap-break-word"
      >
        {locationOptions &&
          locationOptions.map((item: any) => item.label).join(", ")}
      </Typography>
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 justify-center">
        <Typography className="py-2 rounded-sm bg-secondary text-muted text-sm px-2">
          New Patient: 25,000 CFA
        </Typography>
        <Typography className="py-2 rounded-sm bg-primary text-muted text-sm px-2">
          Returning Patient: 10,000 CFA
        </Typography>
      </div>

      <Typography
        color="foreground"
        className="py-2 bg-primary/20 px-10 rounded-sm leading-4 text-[0.625rem]"
      >
        AVAILABLE ON REQUEST: Confirmation of availability may need further
        processing of your request with the doctor.
      </Typography>
      {/* Available Dates */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2.5">
          <div className="p-2.5 bg-primary/10 rounded-lg">
            <CalendarCheck2 size={24} className="text-primary h-6 w-6" />
          </div>
          <Typography size="xl" weight="semiBold" color="secondary">
            Available Dates
          </Typography>
        </div>

        <Calendar
          mode="single"
          className="mx-auto border rounded-md p-3"
          selected={field.value ? new Date(field.value) : undefined}
          onSelect={(date) => field.onChange(date?.toISOString())}
          modifiers={{
            available: (date) =>
              isDayAvailable(date) && !isDateUnavailable(date),
            unavailable: (date) => isDateUnavailable(date),
          }}
          modifiersClassNames={{
            available: "bg-secondary/40! rounded-sm",
            unavailable:
              "bg-destructive! text-muted! cursor-not-allowed rounded-sm",
            selected: "bg-secondary! border-2 border-secondary!",
            today: "bg-accent text-accent-foreground font-bold",
          }}
          disabled={(date) =>
            date < new Date(new Date().setHours(0, 0, 0, 0)) ||
            isDateUnavailable(date) ||
            !isDayAvailable(date)
          }
          classNames={{
            day_disabled:
              "text-muted-foreground opacity-50 cursor-not-allowed bg-slate-50",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          }}
        />
        {errors.availableDates && (
          <p className="text-destructive text-xs text-center">
            {errors.availableDates.message}
          </p>
        )}
      </div>
      {/* Available Slots */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2.5">
          <div className="p-2.5 bg-primary/10 rounded-lg">
            <CalendarCheck2 size={24} className="text-primary h-6 w-6" />
          </div>
          <Typography size="xl" weight="semiBold" color="secondary">
            Available Slots
          </Typography>
        </div>

        {!field.value ? (
          <Typography
            size="sm"
            color="muted_foreground"
            className="text-center italic"
          >
            Please select a date first
          </Typography>
        ) : slots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 bg-muted-foreground/10 rounded px-11 py-1">
            {slots.map((slot) => {
              const isSelected = control._formValues.availableSlots === slot;
              const hour = parseInt(slot.split(":")[0]);
              let period = "Morning";
              if (hour >= 12 && hour < 17) period = "Afternoon";
              if (hour >= 17) period = "Evening";

              return (
                <AppButton
                  key={slot}
                  type="button"
                  //   onClick={() => {
                  //     control._methods.setValue("availableSlots", slot);
                  //   }}
                  className={`py-2 text-xs border rounded-md transition-colors bg-secondary hover:bg-secondary border-secondary ${
                    isSelected ? "border-2" : ""
                  }`}
                >
                  <Typography
                    size="xs"
                    color="foreground"
                    className="block leading-4"
                  >
                    {period} <br /> {slot}
                  </Typography>
                </AppButton>
              );
            })}
          </div>
        ) : (
          <Typography size="sm" color="destructive">
            No slots available for this day
          </Typography>
        )}

        {errors.availableSlots && (
          <Typography size="sm" color="destructive">
            {errors.availableSlots.message}
          </Typography>
        )}
      </div>

      <AppButton type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Confirm Appointment
      </AppButton>
    </form>
  );
};

export default DoctorBooking;

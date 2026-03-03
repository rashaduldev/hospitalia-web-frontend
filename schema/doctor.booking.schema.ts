import * as z from "zod";

export const doctorBookingSchema = z.object({
  location: z.string().min(2, "Location is required"),
  availableDates: z.string().min(1, "Available Dates is required"),
  availableSlots: z.string().min(1, "Available Slots is required"),
});

export type DoctorBookingFormValues = z.infer<typeof doctorBookingSchema>;

import * as z from "zod";

export const doctorBookingSchema = z.object({
  location: z.string().min(1, "Please select a location"),
  availableDates: z.string().min(1, "Please select an appointment date"),
  availableSlots: z.string().min(1, "Please select a time slot"),
  patientType: z.enum(["new", "returning"], {
    message: "Please select your patient status",
  }),
});

export type DoctorBookingFormValues = z.infer<typeof doctorBookingSchema>;

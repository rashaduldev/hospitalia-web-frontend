import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const offlineBookingSchema = z.object({
  patientFirstName: z.string().min(1, "First name is required"),
  patientLastName: z.string().min(1, "Last name is required"),
  patientGender: z.enum(["Male", "Female"], { message: "Gender is required" }),
  patientAge: z.union([
    z.number().int().min(0, "Age must be positive").max(150, "Invalid age"),
    z.nan().transform(() => undefined),
  ]).optional(),
  patientPhone: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => isValidPhoneNumber(val), "Please enter a valid phone number"),
  patientEmail: z.union([z.string().email("Invalid email address"), z.literal("")]).optional(),
  countryCode: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  patientType: z.enum(["new", "returning"]),
  appointmentTypeId: z.string().min(1, "Appointment type is required"),
  availableDates: z.string().min(1, "Date is required"),
  availableSlots: z.string().min(1, "Time slot is required"),
});

export type OfflineBookingFormValues = z.infer<typeof offlineBookingSchema>;

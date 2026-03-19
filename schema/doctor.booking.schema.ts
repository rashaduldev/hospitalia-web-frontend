import { z } from "zod";
import { useI18n } from "@/locales/client";
type TFunction = ReturnType<typeof useI18n>;

export const doctorBookingSchema = (t: TFunction) =>
  z.object({
    location: z.string().min(1, t("booking.errors.locationRequired")),
    availableDates: z.string().min(1, t("booking.errors.dateRequired")),
    availableSlots: z.string().min(1, t("booking.errors.slotRequired")),
    patientType: z.enum(["new", "returning"], {
      message: t("booking.errors.patientTypeRequired"),
    }),
    appointmentTypeId: z.string().min(1, t("booking.errors.appointmentTypeRequired")),
  });

export type DoctorBookingFormValues = z.infer<
  ReturnType<typeof doctorBookingSchema>
>;

export const cancelAppointmentSchema = z.object({
  reason: z
    .string()
    .min(5, "Reason must be at least 5 characters")
    .max(300, "Reason is too long"),
});

export type CancelAppointmentForm = z.infer<typeof cancelAppointmentSchema>;

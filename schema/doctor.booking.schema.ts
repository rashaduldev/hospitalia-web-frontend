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
  });

export type DoctorBookingFormValues = z.infer<
  ReturnType<typeof doctorBookingSchema>
>;

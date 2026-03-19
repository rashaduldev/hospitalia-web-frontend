import { z } from "zod";
import { useI18n } from "@/locales/client";

type TFunction = ReturnType<typeof useI18n>;

export const locationSchema = (t: TFunction) =>
  z.object({
    locationName: z
      .string()
      .min(2, t("location.errors.nameRequired"))
      .max(180, t("location.errors.nameTooLong")),
    addressLine1: z
      .string()
      .min(5, t("location.errors.addressRequired"))
      .max(180, t("location.errors.addressTooLong")),
    addressLine2: z.string().max(180).optional(),
    city: z
      .string()
      .min(1, t("location.errors.cityRequired"))
      .max(100, t("location.errors.cityTooLong")),
    state: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    postalCode: z
      .string()
      .min(1, t("location.errors.postalRequired"))
      .max(20, t("location.errors.postalTooLong")),
    newPatientFee: z.coerce.number().min(0).optional(),
    oldPatientFee: z.coerce.number().min(0).optional(),
    feeCurrency: z.string().max(10).optional(),
    supportedAppointmentTypeIds: z.array(z.number()).default([]),
  });

export type LocationFormValues = z.infer<ReturnType<typeof locationSchema>>;

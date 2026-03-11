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
    city: z
      .string()
      .min(1, t("location.errors.cityRequired"))
      .max(100, t("location.errors.cityTooLong")),
    postalCode: z
      .string()
      .min(1, t("location.errors.postalRequired"))
      .max(20, t("location.errors.postalTooLong")),
  });

export type LocationFormValues = z.infer<ReturnType<typeof locationSchema>>;

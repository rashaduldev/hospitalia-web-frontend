import * as z from "zod";

export const locationSchema = z.object({
  locationName: z
    .string()
    .min(2, "Location name is required")
    .max(180, "Location name is too long"),
  addressLine1: z
    .string()
    .min(5, "Location address is required")
    .max(180, "Location address is too long"),
  city: z.string().min(1, "City is required").max(100, "City is too long"),
  postalCode: z.coerce
    .string()
    .min(1, "Postal code is required")
    .max(20, "Postal code is too long"),
});

export type LocationFormValues = z.infer<typeof locationSchema>;

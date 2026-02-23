import * as z from "zod";

export const locationSchema = z.object({
  locationName: z.string().min(2, "Hospital name is required"),
  addressLine1: z.string().min(5, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

export type LocationFormValues = z.infer<typeof locationSchema>;
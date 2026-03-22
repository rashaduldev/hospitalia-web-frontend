import { z } from "zod";

export const HospitalLocationSchema = z.object({
  locationName: z.string().min(2, "Location name is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  latitude: z.coerce.number().optional().or(z.literal("")),
  longitude: z.coerce.number().optional().or(z.literal("")),
});

export type HospitalLocationFormValues = z.infer<typeof HospitalLocationSchema>;

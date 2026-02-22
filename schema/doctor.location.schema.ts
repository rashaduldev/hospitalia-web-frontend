import z from "zod";

export const locationSchema = z.object({
  locationName: z.string().min(2, "Hospital name is required"),
  addressLine1: z.string().min(5, "Full address is required"),
});
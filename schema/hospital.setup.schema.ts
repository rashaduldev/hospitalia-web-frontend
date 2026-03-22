import { z } from "zod";

export const HospitalSetupSchema = z.object({
  hospitalName: z.string().min(2, "Hospital name is required"),
  hospitalType: z.string().min(1, "Hospital type is required"),
  workPhoneNumber: z.string().optional(),
  websiteUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  numberOfBeds: z.coerce.number().int().positive().optional().or(z.literal("")),
  foundedYear: z.coerce
    .number()
    .int()
    .min(1800, "Enter a valid year")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .optional()
    .or(z.literal("")),
  onmsRegistrationNumber: z.string().optional(),
  about: z.string().optional(),
  specialityIds: z.array(z.number()).optional(),
});

export type HospitalSetupFormValues = z.infer<typeof HospitalSetupSchema>;

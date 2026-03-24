import { z } from "zod";

export const doctorProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  gender: z.enum(["MALE", "FEMALE"] as const),
  email: z.string().email("Invalid email address"),
  countryCode: z.string().optional(),
  mobileNumber: z.string().optional(),

  // Professional
  designation: z.string().min(1, "Designation is required").max(100),
  workPhoneNumber: z.string().optional(),
  onmsRegistrationNumber: z.string().optional(),
  professionalStatement: z.string().max(1000).optional(),
  specialityIds: z.array(z.number()).optional(),

  // License & credentials
  medicalLicenseNumber: z.string().optional(),
  licenseIssuingAuthority: z.string().optional(),
  licenseExpiryDate: z.string().optional(),
  yearsOfExperience: z.coerce.number().min(0).optional(),
  qualification: z.string().optional(),
});

export type DoctorProfileFormValues = z.infer<typeof doctorProfileSchema>;

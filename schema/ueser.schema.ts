import { z } from "zod";

export const formSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().optional(),
    gender: z.enum(["male", "female", "others"], {
      message: "Gender is required",
    }),
    email: z.email("Invalid email").optional().or(z.literal("")),
    dateOfBirth: z.string().optional().or(z.literal("")),
    userType: z.string().optional().or(z.literal("")),
    countryCode: z.string().min(1, "CountryCode is required").optional(),
    mobileNumber: z
      .string()
      .min(4, "MobileNumber number is too short")
      .max(15, "MobileNumber number is too long"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    designation: z.string().min(2, "Designation is required"),
    speciality: z.string().min(1, "Speciality is required"),
    onmsRegistrationNumber: z.string().optional(),
    professionalStatement: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type FormValues = z.infer<typeof formSchema>;
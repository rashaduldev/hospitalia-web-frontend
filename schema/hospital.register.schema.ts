import { z } from "zod";

export const HospitalRegisterSchema = z
  .object({
    hospitalName: z.string().min(2, "Hospital name is required"),
    email: z.string().email("Enter a valid email address"),
    mobileNumber: z.string().min(5, "Phone number is required"),
    countryCode: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type HospitalRegisterFormValues = z.infer<typeof HospitalRegisterSchema>;

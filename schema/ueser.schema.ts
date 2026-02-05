import { z } from "zod";

export const formSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    phone: z
      .string()
      .min(10, "Phone number is too short")
      .max(15, "Phone number is too long"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    gender: z.enum(["male", "female", "others"], {
      message: "Gender is required",
    }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    designation: z.string().min(2, "Designation is required"),
    speciality: z.enum(["gaini", "teeth", "others"], {
      message: "Speciality is required",
    }),
    onms: z.string().optional(),
    statement: z.string().min(10, "Professional statement is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type FormValues = z.infer<typeof formSchema>;

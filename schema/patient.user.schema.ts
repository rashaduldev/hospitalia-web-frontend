import { z } from "zod";

// Patient Registration schema
export const PatientRegisterFormSchema = (t: (key: string) => string) =>
  z
    .object({
      firstName: z.string().min(2, t("register.errors.firstNameMin")),
      lastName: z.string().optional(),
      gender: z.enum(["MALE", "FEMALE"], {
        message: t("register.errors.genderRequired"),
      }),
      email: z
        .string()
        .optional()
        .or(z.literal(""))
        .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
          message: t("register.errors.invalidEmail"),
        }),
      dateOfBirth: z.string().optional().or(z.literal("")),
      userType: z.literal("PATIENT"),
      countryCode: z.string().min(1, t("register.errors.countryRequired")),
      mobileNumber: z
        .string()
        .min(1, t("register.errors.phoneRequired"))
        .min(4, t("register.errors.phoneShort"))
        .max(15, t("register.errors.phoneLong")),
      password: z.string().min(8, t("register.errors.passwordMin")),
      confirmPassword: z
        .string()
        .min(1, t("register.errors.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("register.errors.passwordMismatch"),
      path: ["confirmPassword"],
    });

export type PatientRegisterFormValues = z.infer<
  ReturnType<typeof PatientRegisterFormSchema>
>;

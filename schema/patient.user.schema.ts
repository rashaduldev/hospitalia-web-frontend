import { z } from "zod";

// Patient Registration schema
export const PatientRegisterFormSchema = (t: (key: string) => string) =>
  z
    .object({
      firstName: z
        .string()
        .min(1, t("register.errors.firstNameRequired"))
        .min(2, t("register.errors.firstNameMin"))
        .max(50, t("register.errors.firstNameMax")),
      lastName: z.string().max(50, t("register.errors.lastNameMax")).optional(),
      gender: z.enum(["MALE", "FEMALE"], {
        message: t("register.errors.genderRequired"),
      }),
      email: z
        .string()
        .min(1, t("register.errors.emailRequired"))
        .max(50, t("register.errors.emailMax"))
        .email(t("register.errors.invalidEmail")),
      dateOfBirth: z.string().optional().or(z.literal("")),
      userType: z.literal("PATIENT"),
      countryCode: z.string().min(1, t("register.errors.countryRequired")),
      mobileNumber: z
        .string()
        .min(1, t("register.errors.phoneRequired"))
        .min(4, t("register.errors.phoneShort"))
        .max(15, t("register.errors.phoneLong")),
      password: z
        .string()
        .min(8, t("register.errors.passwordMin"))
        .max(32, t("register.errors.passwordMax"))
        .regex(/[A-Z]/, t("register.errors.passwordUppercase"))
        .regex(/[0-9]/, t("register.errors.passwordNumber"))
        .regex(/[^a-zA-Z0-9]/, t("register.errors.passwordSpecial")),
      confirmPassword: z
        .string()
        .min(1, t("register.errors.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("register.errors.passwordNotMatch"),
      path: ["confirmPassword"],
    });

export type PatientRegisterFormValues = z.infer<
  ReturnType<typeof PatientRegisterFormSchema>
>;

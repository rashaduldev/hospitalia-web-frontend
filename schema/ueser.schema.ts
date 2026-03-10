import { z } from "zod";

export const loginFormSchema = (t: (key: string) => string) =>
  z.object({
    countryCode: z.string().nonempty(t("login.errors.countryRequired")),
    phoneNumber: z
      .string()
      .nonempty(t("login.errors.phoneRequired"))
      .min(4, t("login.errors.phoneShort"))
      .max(15, t("login.errors.phoneLong")),

    password: z.string().min(6, t("login.errors.passwordMin")),
  });

export type LoginFormValues = z.infer<ReturnType<typeof loginFormSchema>>;

// Doctor Registration schema
export const RegisterFormSchema = (t: (key: string) => string) =>
  z.object({
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

    userType: z.enum(["DOCTOR", "HOSPITAL"], {
      message: t("register.errors.userTypeRequired"),
    }),

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

    // Professional fields
    designation: z.string().min(2, t("register.errors.designation")),
    specialityId: z.string().min(1, t("register.errors.speciality")),
    onmsRegistrationNumber: z
      .string()
      .min(2, t("register.errors.onmsRegistrationNumber")),
    professionalStatement: z
      .string()
      .max(5000, t("register.errors.professionalStatementLong"))
      .optional(),
  });

export type RegisterFormValues = z.infer<ReturnType<typeof RegisterFormSchema>>;

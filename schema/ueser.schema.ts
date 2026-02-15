import { z } from "zod";


export const loginFormSchema = (t: (key: string) => string) =>
  z.object({
    countryCode: z
      .string()
      .nonempty(t("login.errors.countryRequired")),
    phoneNumber: z
      .string()
      .nonempty(t("login.errors.phoneRequired"))
      .min(4, t("login.errors.phoneShort"))
      .max(15, t("login.errors.phoneLong")),

    password: z
      .string()
      .min(6, t("login.errors.passwordMin")),
  });

export type LoginFormValues = z.infer<
  ReturnType<typeof loginFormSchema>
>;

// Doctor Registration schema
export const RegisterFormSchema = (t: (key: string) => string) =>
  z
    .object({
      firstName: z
        .string()
        .min(2, t("register.errors.firstNameMin")),

      lastName: z.string().optional(),

      gender: z.enum(["MALE", "FEMALE"], {
        message: t("register.errors.genderRequired"),
      }),

      email: z
        .string()
        .email(t("register.errors.invalidEmail"))
        .optional()
        .or(z.literal("")),

      dateOfBirth: z.string().optional().or(z.literal("")),

      userType: z.enum(["DOCTOR", "HOSPITAL", "SECRETARY"], {
        message: t("register.errors.userTypeRequired"),
      }),

      countryCode: z
        .string()
        .nonempty(t("register.errors.countryRequired")),

      mobileNumber: z
        .string()
        .nonempty(t("register.errors.phoneRequired"))
        .min(4, t("register.errors.phoneShort"))
        .max(15, t("register.errors.phoneLong")),

      password: z
        .string()
        .min(8, t("register.errors.passwordMin"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          t("register.errors.passwordStrength"),
        ),

      confirmPassword: z
        .string()
        .min(1, t("register.errors.confirmPasswordRequired")),

      designation: z
        .string()
        .min(2, t("register.errors.designationRequired")),

      specialityId: z
        .string()
        .min(1, t("register.errors.specialityRequired")),

      onmsRegistrationNumber: z.string().optional(),

      professionalStatement: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("register.errors.passwordNotMatch"),
      path: ["confirmPassword"],
    });

export type FormValues = z.infer<
  ReturnType<typeof RegisterFormSchema>
>;
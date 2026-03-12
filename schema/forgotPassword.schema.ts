import { useI18n } from "@/locales/client";
import * as z from "zod";
type TFunction = ReturnType<typeof useI18n>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = (t: TFunction) =>
  z
    .object({
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
export type ResetPasswordValues = z.infer<
  ReturnType<typeof resetPasswordSchema>
>;

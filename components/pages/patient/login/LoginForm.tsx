"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CountryAndPhoneInput } from "@/components/common/Country&PhoneInput";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { Typography } from "@/components/ui/Typography";
import { useI18n } from "@/locales/client";
import { loginFormSchema, LoginFormValues } from "@/schema/ueser.schema";
import AppButton from "@/components/common/AppButton";

const PatientLoginForm = () => {
  const t = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(
      loginFormSchema((key) => t(key as keyof typeof t) as string),
    ),
    defaultValues: {
      password: "",
      countryCode: "",
      phoneNumber: "",
    },
  });
  const router = useRouter();
  const onSubmit = async ({
    countryCode,
    phoneNumber,
    password,
  }: LoginFormValues) => {
    const res = await login({
      countryCode,
      phoneNumber,
      password,
    });

    if (!res.success) {
      setError("root", {
        type: "manual",
        message: res.message,
      });
      return;
    }
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Dynamic Title & Description */}
      <DynamicHeading
        title={t("login.title")}
        description={t("login.description")}
        titleProps={{ size: "2xl", weight: "semiBold", color: "foreground" }}
        className="mb-6"
      />

      <div className="space-y-4">
        {/* Country and Phone */}
        <CountryAndPhoneInput
          control={control}
          required="*"
          countrycode="countryCode"
          mobileNumber="phoneNumber"
          label={t("login.phoneLabel")}
          errors={errors}
        />

        {/* Password */}
        <div className="relative">
          <ControlledInput
            name="password"
            required="*"
            label={t("login.passwordLabel")}
            type={showPassword ? "text" : "password"}
            control={control}
            placeholder="••••••••"
          />
          <button
            onClick={() => setShowPassword((p) => !p)}
            className="absolute cursor-pointer top-7 right-3"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Eye className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Server Error message */}
        {errors.root && (
          <Typography size="xs" color="destructive" weight="semiBold">
            {errors.root.message}
          </Typography>
        )}

        {/* Submit Button */}
        <AppButton
          className="w-full"
          type="submit"
          isLoading={isSubmitting}
          loadingText={t("login.loginLoading")}
        >
          {t("login.loginBtn")}
        </AppButton>
      </div>

      {/* Links */}
      <div className="mt-8 space-y-4 flex flex-col gap-2">
        <Link href="/patient/register">
          <Typography
            size="sm"
            weight="medium"
            color="secondary"
            className="hover:underline"
          >
            {t("login.noAccount")}
          </Typography>
        </Link>

        <Link href="/forgot-password">
          <Typography
            size="sm"
            weight="medium"
            color="primary"
            className="hover:underline"
          >
            {t("login.forgotPassword")}
          </Typography>
        </Link>
      </div>
    </form>
  );
};

export default PatientLoginForm;

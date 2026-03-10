"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, LoginFormValues } from "@/schema/ueser.schema";
import Link from "next/link";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { Typography } from "@/components/ui/Typography";
import { useI18n } from "@/locales/client";
import AppButton from "@/components/common/AppButton";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import {
  parsePhoneNumber,
  getCountryCallingCode,
  Country,
} from "react-phone-number-input";

const LoginForm = ({ isPatient }: { isPatient: boolean }) => {
  const t = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    setError,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(
      loginFormSchema((key) => t(key as keyof typeof t) as string),
    ),
    defaultValues: {
      countryCode: "+221",
      phoneNumber: "+221",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const phoneNumberObj = parsePhoneNumber(data.phoneNumber);
    const cleanPhoneNumber = phoneNumberObj
      ? phoneNumberObj.nationalNumber
      : data.phoneNumber;
    const res = await login({
      countryCode: data.countryCode,
      phoneNumber: cleanPhoneNumber,
      password: data.password,
    });

    if (!res.success) {
      setError("root", { type: "manual", message: res.message });
      return;
    }

    router.replace("/dashboard");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DynamicHeading
        title={t("login.title")}
        description={t("login.description")}
        titleProps={{ size: "2xl", weight: "semiBold", color: "foreground" }}
        className="mb-6"
      />

      <div className="space-y-4">
        {/* Phone Number Field */}
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field, fieldState }) => (
            <div className="space-y-1 w-full">
              <Label>{t("login.phoneLabel")}</Label>
              <PhoneInput
                {...field}
                defaultCountry="SN"
                international
                value={field.value}
                onChange={(value) => field.onChange(value || "")}
                onCountryChange={(country: Country | undefined) => {
                  if (country) {
                    const code = `+${getCountryCallingCode(country)}`;
                    setValue("countryCode", code);
                    setValue("phoneNumber", code);
                  }
                }}
              />
              {fieldState.error && (
                <Typography size="xs" color="destructive">
                  {fieldState.error.message}
                </Typography>
              )}
            </div>
          )}
        />

        {/* Password Field */}
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
            type="button"
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

        {/* Server Errors */}
        {errors.root && (
          <Typography size="xs" color="destructive" weight="semiBold">
            {errors.root.message}
          </Typography>
        )}

        <AppButton
          className="w-full"
          type="submit"
          isLoading={isSubmitting}
          loadingText={t("login.loginLoading")}
        >
          {t("login.loginBtn")}
        </AppButton>
      </div>

      <div className="mt-8 space-y-4 flex flex-col gap-2">
        <Link href={isPatient ? "/register?userType=patient" : "/register"}>
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

export default LoginForm;

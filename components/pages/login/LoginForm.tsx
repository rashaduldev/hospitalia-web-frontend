"use client";

import { useForm } from "react-hook-form";
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
import { ControlledPhoneInput } from "@/components/common/FormUIControllers/ControlledPhoneInput";
import { getCleanPhoneData } from "@/lib/phone-utils";

const LoginForm = () => {
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
    const { countryCode, number: phoneNumber } = getCleanPhoneData(
      data.phoneNumber,
    );
    const res = await login({
      countryCode,
      phoneNumber,
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-112.5 mx-auto"
    >
      <DynamicHeading
        title={t("login.doctortitle")}
        description={t("login.description")}
        titleProps={{ size: "2xl", weight: "semiBold", color: "foreground" }}
        className="mb-6"
      />

      <div className="space-y-4">
        {/* Phone Number Field */}
        <ControlledPhoneInput
          name="phoneNumber"
          control={control}
          requiredMark="*"
          label={t("login.phoneLabel")}
          setValue={setValue}
          defaultCountry="SN"
        />

        {/* Password Field */}
        <div className="relative">
          <ControlledInput
            name="password"
            requiredMark="*"
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
          className="w-full dark:text-foreground"
          type="submit"
          isLoading={isSubmitting}
          loadingText={t("login.loginLoading")}
        >
          {t("login.loginBtn")}
        </AppButton>
      </div>

      <div className="mt-8 space-y-4 flex flex-col gap-2">
        <Link href="/register">
          <Typography
            size="sm"
            weight="medium"
            color="secondary"
            className="hover:underline dark:text-foreground"
          >
            {t("login.noAccount")}
          </Typography>
        </Link>

        <Link href="/forgot-password">
          <Typography
            size="sm"
            weight="medium"
            color="primary"
            className="hover:underline dark:text-foreground"
          >
            {t("login.forgotPassword")}
          </Typography>
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;

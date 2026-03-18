"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/actions/auth.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { Typography } from "@/components/ui/Typography";
import { useCurrentLocale, useI18n } from "@/locales/client";
import { loginFormSchema, LoginFormValues } from "@/schema/ueser.schema";
import AppButton from "@/components/common/AppButton";
import { getCleanPhoneData } from "@/lib/phone-utils";
import { ControlledPhoneInput } from "@/components/common/FormUIControllers/ControlledPhoneInput";
import { useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/actions/user.actions";

const PatientLoginForm = () => {
  const router = useRouter();
  const t = useI18n();
  const queryClient = useQueryClient();
  const lang = useCurrentLocale();
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");
  const [showPassword, setShowPassword] = useState(false);

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
      password: "",
      countryCode: "",
      phoneNumber: "",
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
      setError("root", {
        type: "manual",
        message: res.message,
      });
      return;
    }

    const user = await queryClient.fetchQuery({
      queryKey: ["currentUser"],
      queryFn: () => getCurrentUser({ lang }),
    });

    if (user?.userType === "PATIENT") {
      router.replace(callback || "/patient/dashboard");
    } else {
      router.replace(callback || "/dashboard");
    }
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Dynamic Title & Description */}
      <DynamicHeading
        title={t("patientLogin.title")}
        description={t("patientLogin.description")}
        titleProps={{ size: "2xl", weight: "semiBold", color: "foreground" }}
        className="mb-6"
      />

      <div className="space-y-4">
        {/* Country and Phone */}
        <ControlledPhoneInput
          name="phoneNumber"
          control={control}
          requiredMark="*"
          label={t("login.phoneLabel")}
          setValue={setValue}
          defaultCountry="SN"
          readOnlyCountryCode
        />

        {/* Password */}
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
      <div className="mt-8 flex flex-col gap-3">
        <Link
          href={{
            pathname: "/patient/register",
            query: callback && { callback },
          }}
        >
          <Typography
            size="sm"
            weight="medium"
            color="primary"
            className="hover:underline"
          >
            {t("patientLogin.noAccount")}
          </Typography>
        </Link>

        <Link href="/forgot-password">
          <Typography
            size="sm"
            weight="medium"
            color="muted_foreground"
            className="hover:underline hover:text-foreground"
          >
            {t("login.forgotPassword")}
          </Typography>
        </Link>
      </div>
    </form>
  );
};

export default PatientLoginForm;

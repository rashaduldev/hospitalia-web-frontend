"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, LoginFormValues } from "@/schema/ueser.schema";
import { Button } from "@/components/ui/button";
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
import { Spinner } from "@/components/ui/spinner";
import { saveSession } from "@/lib/saveSession";

const DoctorLoginForm = () => {
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
    saveSession(res);
    const role = res?.payload?.user?.roles[0]?.roleName.toLowerCase();
    const userType = res?.payload?.user?.userType?.toLowerCase();
    const dashboardPath = `/${role}/${userType}/dashboard`;
    router.push(dashboardPath);
  };

  return (
    <div className="max-w-111.5 mx-auto w-full">
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
            countrycode="countryCode"
            mobileNumber="phoneNumber"
            label={t("login.phoneLabel")}
            errors={errors}
          />

          {/* Password */}
          <div className="relative">
            <ControlledInput
              name="password"
              label={t("login.passwordLabel")}
              type={showPassword ? "text" : "password"}
              control={control}
              placeholder="••••••••"
            />
            <div
              onClick={() => setShowPassword((p) => !p)}
              className="absolute cursor-pointer top-7 right-3"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Server Error message */}
          {errors.root && (
            <Typography size="xs" color="destructive" weight="semiBold">
              {errors.root.message}
            </Typography>
          )}

          {/* Submit Button */}
          <div className="w-full text-left">
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner data-icon="inline-start" />}
              {isSubmitting ? t("login.loginLoading") : t("login.loginBtn")}
            </Button>
          </div>
        </div>

        {/* Links */}
        <div className="mt-8 space-y-4 flex flex-col gap-2">
          <Link href="/doctor/registration">
            <Typography
              size="sm"
              weight="medium"
              color="secondary"
              className="hover:underline"
            >
              {t("login.noAccount")}
            </Typography>
          </Link>

          <Link href="/doctor/forgot-password">
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
    </div>
  );
};

export default DoctorLoginForm;

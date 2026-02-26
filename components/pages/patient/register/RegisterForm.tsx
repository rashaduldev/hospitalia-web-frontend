"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { CountryAndPhoneInput } from "@/components/common/Country&PhoneInput";
import { useRouter } from "next/navigation";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { ControlledDateInput } from "@/components/common/FormUIControllers/ControlledDateInput";
import { register } from "@/actions/auth.actions";
import { useI18n } from "@/locales/client";
import { Typography } from "@/components/ui/Typography";
import {
  PatientRegisterFormSchema,
  PatientRegisterFormValues,
} from "@/schema/patient.user.schema";
import { PatientRegisterRequestData } from "@/types/patient.user.type";
import AppButton from "@/components/common/AppButton";

export default function PatinetRegistrationForm() {
  const t = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success] = useState(false);

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PatientRegisterFormValues>({
    resolver: zodResolver(
      PatientRegisterFormSchema((key) => t(key as any, {}) as string),
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "PATIENT",
      countryCode: "",
      mobileNumber: "",
    },
    mode: "onChange",
  });

  const router = useRouter();

  const onSubmit = async (data: PatientRegisterFormValues) => {
    const registerPayload: PatientRegisterRequestData = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      email: data.email || "",
      dateOfBirth: data.dateOfBirth,
      userType: data.userType,
      countryCode: data.countryCode,
      mobileNumber: data.mobileNumber,
      password: data.password,
    };

    const res = await register(registerPayload);

    if (!res.success) {
      setError("root", {
        type: "manual",
        message: res.message,
      });
      return;
    }

    router.push("/patient/login");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-lg border bg-card p-6 space-y-5">
        <Typography size="2xl" as="h3" color="foreground">
          {t("register.personalInfo")}
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <ControlledInput
            name="firstName"
            label={t("register.firstName")}
            control={control}
            placeholder="Enter your first name"
          />

          <ControlledInput
            name="lastName"
            label={t("register.lastName")}
            control={control}
            placeholder="Enter your last name"
          />

          <ControlledSelect
            name="gender"
            label={t("register.gender")}
            control={control}
            placeholder="Choose your gender"
            options={[
              {
                label: t("register.genderOptions.male"),
                value: "MALE",
              },
              {
                label: t("register.genderOptions.female"),
                value: "FEMALE",
              },
            ]}
          />
          <ControlledInput
            name="email"
            label={t("register.email")}
            type="email"
            control={control}
            placeholder="Enter your email"
          />

          <ControlledDateInput
            name="dateOfBirth"
            label={t("register.dateOfBirth")}
            control={control}
            error={errors.dateOfBirth?.message}
          />

          <CountryAndPhoneInput
            control={control}
            countrycode="countryCode"
            mobileNumber="mobileNumber"
            label={t("register.phone")}
            errors={errors}
          />

          <div className="relative">
            <ControlledInput
              name="password"
              label={t("register.password")}
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

          <div className="relative">
            <ControlledInput
              name="confirmPassword"
              label={t("register.confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              control={control}
              placeholder="••••••••"
            />
            <div
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute cursor-pointer top-7 right-3"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </div>
      {errors.root && (
        <p className="text-destructive text-xs font-semibold mt-4">
          {errors.root.message}
        </p>
      )}
      <div className="flex flex-col items-center gap-4 mt-6 mb-12">
        <AppButton
          className="w-full max-w-md"
          type="submit"
          isLoading={isSubmitting}
          loadingText={t("register.creating")}
          disabled={success}
        >
          {t("register.submit")}
        </AppButton>

        <Link
          href="/patient/login"
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("register.alreadyAccount")}
        </Link>
      </div>
    </form>
  );
}

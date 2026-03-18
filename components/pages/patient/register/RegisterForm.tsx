"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { ControlledDateInput } from "@/components/common/FormUIControllers/ControlledDateInput";
import { Patientregister } from "@/actions/auth.actions";
import { useI18n } from "@/locales/client";
import { Typography } from "@/components/ui/Typography";
import {
  PatientRegisterFormSchema,
  PatientRegisterFormValues,
} from "@/schema/patient.user.schema";
import { PatientRegisterRequestData } from "@/types/patient.user.type";
import AppButton from "@/components/common/AppButton";
import { getCleanPhoneData } from "@/lib/phone-utils";
import { ControlledPhoneInput } from "@/components/common/FormUIControllers/ControlledPhoneInput";

export default function PatinetRegistrationForm({ lang }: { lang: string }) {
  const t = useI18n();
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    handleSubmit,
    control,
    setError,
    reset,
    setValue,
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
    const { countryCode, number: mobileNumber } = getCleanPhoneData(
      data.mobileNumber,
    );
    const bodyData: PatientRegisterRequestData = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      email: data.email || "",
      dateOfBirth: data.dateOfBirth,
      userType: data.userType,
      countryCode,
      mobileNumber,
      password: data.password,
    };

    const res = await Patientregister({ bodyData, lang });

    if (!res.success) {
      setError("root", {
        type: "manual",
        message: res.message,
      });
      return;
    }
    router.replace(callback ? `/patient/login?callback=${callback}` : "/patient/login");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center mb-8">
        <Typography size="3xl" as="h1" weight="bold" color="foreground">
          {t("patientRegister.pageTitle")}
        </Typography>
        <Typography size="sm" color="muted" className="mt-2">
          {t("patientRegister.pageSubtitle")}
        </Typography>
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-5">
        <Typography size="2xl" as="h3" color="foreground">
          {t("patientRegister.sectionTitle")}
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <ControlledInput
            name="firstName"
            requiredMark="*"
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
            required="*"
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
            requiredMark="*"
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
            disableFuture
          />

          <ControlledPhoneInput
            name="mobileNumber"
            control={control}
            requiredMark="*"
            label={t("patientRegister.phoneLabel")}
            setValue={setValue}
            defaultCountry="SN"
            readOnlyCountryCode
          />

          <div className="relative">
            <ControlledInput
              name="password"
              requiredMark="*"
              label={t("register.password")}
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

          <div className="relative">
            <ControlledInput
              name="confirmPassword"
              requiredMark="*"
              label={t("register.confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              control={control}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute cursor-pointer top-7 right-3"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
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
          className="w-full max-w-md dark:text-foreground"
          type="submit"
          isLoading={isSubmitting}
          loadingText={t("patientRegister.creating")}
        >
          {t("patientRegister.submit")}
        </AppButton>

        <Link
          href={{
            pathname: "/patient/login",
            query: callback && { callback },
          }}
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("patientRegister.alreadyAccount")}
        </Link>
      </div>
    </form>
  );
}

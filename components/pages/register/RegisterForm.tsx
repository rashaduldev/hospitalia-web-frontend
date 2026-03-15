"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSpecialitiesAllCustomer } from "@/actions/speciality.customer";
import { useQuery } from "@tanstack/react-query";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { ControlledTextarea } from "@/components/common/FormUIControllers/ControlledTextarea";
import { ControlledDateInput } from "@/components/common/FormUIControllers/ControlledDateInput";
import { register } from "@/actions/auth.actions";
import { useI18n } from "@/locales/client";
import { Typography } from "@/components/ui/Typography";
import { RegisterFormSchema, RegisterFormValues } from "@/schema/ueser.schema";
import AppButton from "@/components/common/AppButton";
import { RegisterUser } from "@/types/user.type";
import { getCleanPhoneData } from "@/lib/phone-utils";
import { ControlledPhoneInput } from "@/components/common/FormUIControllers/ControlledPhoneInput";

export default function PatinetRegistrationForm({ lang }: { lang: string }) {
  const t = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success] = useState(false);

  const {
    handleSubmit,
    control,
    setError,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(
      RegisterFormSchema((key) => t(key as keyof typeof t) as string),
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      dateOfBirth: "",
      confirmPassword: "",
      designation: "",
      countryCode: "",
      mobileNumber: "",
      specialityId: "",
      onmsRegistrationNumber: "",
    },
    mode: "onChange",
  });

  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["specialities"],
    queryFn: async () => {
      const res = await getSpecialitiesAllCustomer();

      if (!res.success) {
        throw new Error(res.message);
      }

      return res.payload;
    },
  });
  const specialities = data?.content ?? [];

  const onSubmit = async (data: RegisterFormValues) => {
    const { countryCode, number: mobileNumber } = getCleanPhoneData(
      data.mobileNumber,
    );
    const bodyData: RegisterUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      userType: data.userType,
      countryCode,
      mobileNumber,
      password: data.password,
      professionalInfoRequest: {
        designation: data.designation,
        specialityId: [Number(data.specialityId)],
        onmsRegistrationNumber: data.onmsRegistrationNumber,
        professionalStatement: data.professionalStatement,
      },
    };
    const res = await register({ bodyData, lang });

    if (!res.success) {
      setError("root", {
        type: "manual",
        message: res.message,
      });
      return;
    }
    router.replace("/login");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* PERSONAL INFO */}
      <div className="rounded-lg border bg-card p-6 space-y-5">
        <Typography size="2xl" as="h3" color="foreground">
          {t("register.personalInfo")}
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* First Name */}
          <ControlledInput
            name="firstName"
            requiredMark="*"
            label={t("register.firstName")}
            control={control}
            placeholder="Enter your first name"
          />

          {/* Last Name */}
          <ControlledInput
            name="lastName"
            label={t("register.lastName")}
            control={control}
            placeholder="Enter your last name"
          />

          {/* Gender */}
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
          {/* User Type */}
          <ControlledSelect
            name="userType"
            required="*"
            label={t("register.userType")}
            control={control}
            placeholder="Select user type"
            options={[
              {
                label: t("register.userTypeOptions.doctor"),
                value: "DOCTOR",
              },
              {
                label: t("register.userTypeOptions.hospital"),
                value: "HOSPITAL",
              },
            ]}
          />

          {/* Email */}
          <ControlledInput
            name="email"
            requiredMark="*"
            label={t("register.email")}
            type="email"
            control={control}
            placeholder="Enter your email"
          />

          {/* Date of Birth */}
          <ControlledDateInput
            name="dateOfBirth"
            label={t("register.dateOfBirth")}
            control={control}
            error={errors.dateOfBirth?.message}
            disableFuture
          />

          {/* CountryCode with phone */}
          <ControlledPhoneInput
            name="mobileNumber"
            control={control}
            requiredMark="*"
            label={t("login.phoneLabel")}
            setValue={setValue}
            defaultCountry="SN"
          />

          {/* Password */}
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

          {/* Confirm Password */}
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

      {/* PROFESSIONAL INFO */}
      <div className="rounded-lg border bg-card p-6 space-y-5 mt-12">
        <Typography size="2xl" as="h3" color="foreground">
          {t("register.professionalInfo")}
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Designation */}
          <ControlledInput
            name="designation"
            requiredMark="*"
            label={t("register.designation")}
            control={control}
            placeholder="Enter your title/designation"
          />

          {/* Speciality */}
          <ControlledSelect
            name="specialityId"
            required="*"
            label="Speciality"
            control={control}
            placeholder="Select speciality"
            options={specialities.map((item) => ({
              label: item.name,
              value: String(item.id),
            }))}
          />
          {/* ONMS Registration Number */}
          <ControlledInput
            name="onmsRegistrationNumber"
            requiredMark="*"
            label={t("register.onms")}
            control={control}
            placeholder="Enter your registration number"
          />
        </div>

        {/* Professional Statement */}
        <ControlledTextarea
          name="professionalStatement"
          label={t("register.statement")}
          control={control}
          placeholder="Write your professional statement"
        />
      </div>

      {/* Feedback Messages */}
      {errors.root && (
        <Typography
          color="destructive"
          size="xs"
          weight="semiBold"
          className="mt-4"
        >
          {errors.root.message}
        </Typography>
      )}
      {/* Submit Button */}
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
          href="/login"
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("register.alreadyAccount")}
        </Link>
      </div>
    </form>
  );
}

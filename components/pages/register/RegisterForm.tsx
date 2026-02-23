"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormSchema, RegisterFormValues } from "@/schema/ueser.schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { CountryAndPhoneInput } from "@/components/common/Country&PhoneInput";
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
import { Spinner } from "@/components/ui/spinner";
import { RegisterRequestData } from "@/types/user.type";

export default function RegistrationForm({
  isPatient,
}: {
  isPatient: boolean;
}) {
  const t = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success] = useState(false);

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(
      RegisterFormSchema(
        (key) => t(key as keyof typeof t) as string,
        isPatient,
      ),
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: isPatient ? "PATIENT" : "DOCTOR",
      designation: "",
      countryCode: "",
      mobileNumber: "",
      specialityId: "",
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

  const onSubmit = async (data : RegisterFormValues) => {
    const registerPayload: RegisterRequestData = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      userType: data.userType || (isPatient ? "PATIENT" : "DOCTOR"),
      countryCode: data.countryCode,
      mobileNumber: data.mobileNumber,
      password: data.password,
    };

    if (!isPatient) {
      const profInfo: any = {};      

      if (data.designation) profInfo.designation = data.designation;
      if (data.specialityId) profInfo.specialityId = [Number(data.specialityId)];
      if (data.onmsRegistrationNumber)
        profInfo.onmsRegistrationNumber = data.onmsRegistrationNumber;
      if (data.professionalStatement)
        profInfo.professionalStatement = data.professionalStatement;

      if (Object.keys(profInfo).length > 0) {
        registerPayload.professionalInfoRequest = profInfo;
      }
    }
    const res = await register(registerPayload);

    if (!res.success) {
      setError("root", {
        type: "manual",
        message: res.message,
      });
      return;
    }

    router.push(isPatient ? "/login?userType=patient" : "/login");
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
          {!isPatient && (
            <ControlledSelect
              name="userType"
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
                {
                  label: t("register.userTypeOptions.secretary"),
                  value: "SECRETARY",
                },
              ]}
            />
          )}

          {/* Email */}
          <ControlledInput
            name="email"
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
          />

          {/* CountryCode with phone */}
          <CountryAndPhoneInput
            control={control}
            countrycode="countryCode"
            mobileNumber="mobileNumber"
            label={t("register.phone")}
            errors={errors}
          />

          {/* Password */}
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

          {/* Confirm Password */}
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

      {/* PROFESSIONAL INFO */}
      {!isPatient && (
        <div className="rounded-lg border bg-card p-6 space-y-5 mt-12">
          <Typography size="2xl" as="h3" color="foreground">
            {t("register.professionalInfo")}
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Designation */}
            <ControlledInput
              name="designation"
              label={t("register.designation")}
              control={control}
              placeholder="Enter your title/designation"
            />

            {/* Speciality */}
            <ControlledSelect
              name="specialityId"
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
      )}
      {/* Feedback Messages */}
      {errors.root && (
        <p className="text-destructive text-xs font-semibold mt-4">
          {errors.root.message}
        </p>
      )}
      {/* Submit Button */}
      <div className="flex flex-col items-center gap-4 mt-6 mb-12">
        <Button
          className="w-full max-w-md"
          type="submit"
          disabled={isSubmitting || success}
        >
          {isSubmitting && <Spinner data-icon="inline-start" />}
          {isSubmitting
            ? "Creating account..."
            : "Register as a Healthcare Provider"}
        </Button>

        <Link
          href={isPatient ? "/login?userType=patient" : "/login"}
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("register.alreadyAccount")}
        </Link>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff, User, Stethoscope, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSpecialitiesAllCustomer } from "@/actions/speciality.customer";
import { useQuery } from "@tanstack/react-query";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { ControlledTextarea } from "@/components/common/FormUIControllers/ControlledTextarea";
import { ControlledDateInput } from "@/components/common/FormUIControllers/ControlledDateInput";
import { register } from "@/actions/auth.actions";
import { useI18n } from "@/locales/client";
import { RegisterFormSchema, RegisterFormValues } from "@/schema/ueser.schema";
import { Button } from "@/components/ui/button";
import { RegisterUser } from "@/types/user.type";
import { getCleanPhoneData } from "@/lib/phone-utils";
import { ControlledPhoneInput } from "@/components/common/FormUIControllers/ControlledPhoneInput";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function PatinetRegistrationForm({ lang }: { lang: string }) {
  const t = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
      if (!res.success) throw new Error(res.message);
      return res.payload;
    },
  });
  const specialities = data?.content ?? [];

  const onSubmit = async (data: RegisterFormValues) => {
    const { countryCode, number: mobileNumber } = getCleanPhoneData(data.mobileNumber);
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
      setError("root", { type: "manual", message: res.message });
      return;
    }
    reset();
    setShowSuccess(true);
  };

  return (
    <>
    <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
      <DialogContent className="max-w-sm text-center">
        <DialogTitle className="sr-only">Registration Successful</DialogTitle>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="p-4 bg-secondary/15 rounded-full">
            <CheckCircle2 className="w-10 h-10 text-secondary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Account Created!</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your account has been successfully registered. You can now sign in.
            </p>
          </div>
          <Button
            className="w-full mt-2 font-semibold"
            onClick={() => router.replace("/doctor/login")}
          >
            Go to Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-3">
      {/* Personal Info */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">
              {t("register.personalInfo")}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Your basic personal details</p>
          </div>
        </div>
        <div className="p-6">
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
                { label: t("register.genderOptions.male"), value: "MALE" },
                { label: t("register.genderOptions.female"), value: "FEMALE" },
              ]}
            />
            <ControlledSelect
              name="userType"
              required="*"
              label={t("register.userType")}
              control={control}
              placeholder="Select user type"
              options={[
                { label: t("register.userTypeOptions.doctor"), value: "DOCTOR" },
                { label: t("register.userTypeOptions.hospital"), value: "HOSPITAL" },
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
              label={t("login.phoneLabel")}
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
                {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
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
                {showConfirmPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Info */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
            <Stethoscope className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">
              {t("register.professionalInfo")}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Your credentials and professional background</p>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ControlledInput
              name="designation"
              requiredMark="*"
              label={t("register.designation")}
              control={control}
              placeholder="Enter your title/designation"
            />
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
            <ControlledInput
              name="onmsRegistrationNumber"
              requiredMark="*"
              label={t("register.onms")}
              control={control}
              placeholder="Enter your registration number"
            />
          </div>
          <ControlledTextarea
            name="professionalStatement"
            label={t("register.statement")}
            control={control}
            placeholder="Write your professional statement"
          />
        </div>
      </div>

      {errors.root && (
        <p className="text-xs text-destructive font-semibold">{errors.root.message}</p>
      )}

      <div className="flex flex-col items-center gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full max-w-md h-11 font-semibold"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" />{t("register.creating")}</>
          ) : (
            t("register.submit")
          )}
        </Button>
        <Link href="/doctor/login" className="text-sm font-medium text-primary hover:underline">
          {t("register.alreadyAccount")}
        </Link>
      </div>
    </form>
    </>
  );
}

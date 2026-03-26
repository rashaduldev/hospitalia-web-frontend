"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { ControlledPhoneInput } from "@/components/common/FormUIControllers/ControlledPhoneInput";
import { SecretaryOnboardSchema, SecretaryOnboardValues } from "@/schema/secretary.onboard.schema";
import { getSecretaryInvitationInfo, onboardSecretary } from "@/actions/secretary/secretary.actions";
import { getCleanPhoneData } from "@/lib/phone-utils";

export default function SecretaryOnboardPage({
  lang,
  token,
}: {
  lang: string;
  token: string;
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: invitationData, isLoading, isError } = useQuery({
    queryKey: ["secretary-invitation-info", token],
    queryFn: () => getSecretaryInvitationInfo({ invitationToken: token, lang }),
    enabled: !!token,
    retry: false,
  });

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SecretaryOnboardValues>({
    resolver: zodResolver(SecretaryOnboardSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (invitationData?.payload) {
      const { firstName, lastName, email, mobileNumber, gender } = invitationData.payload;
      reset((prev) => ({
        ...prev,
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        email: email ?? "",
        mobileNumber: mobileNumber ?? "",
        gender: (gender as "MALE" | "FEMALE" | "OTHER") ?? prev.gender,
      }));
    }
  }, [invitationData, reset]);

  const onSubmit = async (data: SecretaryOnboardValues) => {
    const { countryCode, number: mobileNumber } = getCleanPhoneData(data.mobileNumber);
    const res = await onboardSecretary({
      invitationToken: token,
      lang,
      body: {
        firstName: data.firstName,
        lastName: data.lastName ?? "",
        gender: data.gender,
        email: data.email,
        countryCode,
        mobileNumber,
        password: data.password,
      },
    });

    if (!res.success) {
      setError("root", { type: "manual", message: res.message });
      return;
    }
    setSuccess(true);
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="p-4 bg-destructive/10 rounded-full">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Invalid Invitation</h2>
          <p className="text-sm text-muted-foreground mt-1">
            This invitation link is missing a token. Please use the link from your invitation email.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !invitationData?.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="p-4 bg-destructive/10 rounded-full">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Invalid or Expired Invitation</h2>
          <p className="text-sm text-muted-foreground mt-1">
            This invitation link is no longer valid. Please contact your doctor to request a new one.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="p-4 bg-secondary/15 rounded-full">
          <CheckCircle2 className="w-10 h-10 text-secondary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Account Created!</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your secretary account is ready. You can now sign in.
          </p>
        </div>
        <Button
          className="mt-2 font-semibold min-w-40"
          onClick={() => router.replace(`/${lang}/doctor/login`)}
        >
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">Your Details</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Review your pre-filled information and set your password
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ControlledInput
              name="firstName"
              requiredMark="*"
              label="First Name"
              control={control}
              placeholder="Enter your first name"
            />
            <ControlledInput
              name="lastName"
              label="Last Name"
              control={control}
              placeholder="Enter your last name"
            />
            <ControlledSelect
              name="gender"
              required="*"
              label="Gender"
              control={control}
              placeholder="Choose your gender"
              options={[
                { label: "Male", value: "MALE" },
                { label: "Female", value: "FEMALE" },
                { label: "Other", value: "OTHER" },
              ]}
            />
            {/* Email is locked — pre-filled by invitation, cannot be changed */}
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">
                Email <span className="text-destructive text-sm">*</span>
              </label>
              <input
                type="email"
                value={invitationData?.payload?.email ?? ""}
                readOnly
                className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground shadow-xs cursor-not-allowed"
              />
            </div>
            <ControlledPhoneInput
              name="mobileNumber"
              control={control}
              requiredMark="*"
              label="Phone Number"
              setValue={setValue}
              defaultCountry="SN"
              readOnlyCountryCode
            />
            <div />
            <div className="relative">
              <ControlledInput
                name="password"
                requiredMark="*"
                label="Password"
                type={showPassword ? "text" : "password"}
                control={control}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute cursor-pointer top-7 right-3"
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4 text-muted-foreground" />
                  : <Eye className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
            <div className="relative">
              <ControlledInput
                name="confirmPassword"
                requiredMark="*"
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                control={control}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute cursor-pointer top-7 right-3"
              >
                {showConfirm
                  ? <EyeOff className="w-4 h-4 text-muted-foreground" />
                  : <Eye className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {errors.root && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-xs text-destructive font-medium flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            {errors.root.message}
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full max-w-md h-11 font-semibold"
        >
          {isSubmitting
            ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating Account...</>
            : "Complete Registration"}
        </Button>
      </div>
    </form>
  );
}

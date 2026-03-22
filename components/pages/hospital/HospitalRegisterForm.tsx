"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff, Building2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledPhoneInput } from "@/components/common/FormUIControllers/ControlledPhoneInput";
import { hospitalRegister } from "@/actions/auth.actions";
import { HospitalRegisterSchema, HospitalRegisterFormValues } from "@/schema/hospital.register.schema";
import { Button } from "@/components/ui/button";
import { getCleanPhoneData } from "@/lib/phone-utils";

export default function HospitalRegisterForm({ lang }: { lang: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HospitalRegisterFormValues>({
    resolver: zodResolver(HospitalRegisterSchema),
    defaultValues: {
      hospitalName: "",
      email: "",
      mobileNumber: "",
      countryCode: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: HospitalRegisterFormValues) => {
    const { countryCode, number: mobileNumber } = getCleanPhoneData(data.mobileNumber);

    const res = await hospitalRegister({
      bodyData: {
        hospitalName: data.hospitalName,
        email: data.email,
        countryCode,
        mobileNumber,
        password: data.password,
      },
      lang,
    });

    if (!res.success) {
      setError("root", { type: "manual", message: res.message });
      return;
    }

    reset();
    router.replace("/hospital/login");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-3">
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">Hospital Details</h2>
            <p className="text-xs text-muted-foreground mt-1">Basic information about your hospital</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <ControlledInput
                name="hospitalName"
                requiredMark="*"
                label="Hospital Name"
                control={control}
                placeholder="e.g. Dhaka Medical Center"
              />
            </div>

            <ControlledInput
              name="email"
              requiredMark="*"
              label="Email Address"
              type="email"
              control={control}
              placeholder="admin@hospital.com"
            />

            <ControlledPhoneInput
              name="mobileNumber"
              control={control}
              requiredMark="*"
              label="Phone Number"
              setValue={setValue}
              defaultCountry="SN"
            />

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
                label="Confirm Password"
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
            <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating account...</>
          ) : (
            "Create Hospital Account"
          )}
        </Button>
        <Link href="/hospital/login" className="text-sm font-medium text-primary hover:underline">
          Already have an account? Sign in
        </Link>
      </div>
    </form>
  );
}

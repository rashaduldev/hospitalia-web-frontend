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
import { useI18n } from "@/locales/client";
import { Button } from "@/components/ui/button";
import { ControlledPhoneInput } from "@/components/common/FormUIControllers/ControlledPhoneInput";
import { getCleanPhoneData } from "@/lib/phone-utils";
import { Loader2 } from "lucide-react";

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
    const { countryCode, number: phoneNumber } = getCleanPhoneData(data.phoneNumber);
    const res = await login({ countryCode, phoneNumber, password: data.password });

    if (!res.success) {
      setError("root", { type: "manual", message: res.message });
      return;
    }

    const userType = res.payload?.user?.userType;
    const REDIRECT: Record<string, string> = {
      DOCTOR: "/doctor/dashboard",
      HOSPITAL: "/hospital/dashboard",
      ADMIN: "/admin/dashboard",
    };
    router.replace(REDIRECT[userType as string] ?? "/doctor/dashboard");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your doctor or secretary account</p>
      </div>

      <div className="space-y-4">
        <ControlledPhoneInput
          name="phoneNumber"
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

        {errors.root && (
          <p className="text-xs text-destructive font-semibold">{errors.root.message}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full h-11 font-semibold">
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" />{t("login.loginLoading")}</>
          ) : (
            t("login.loginBtn")
          )}
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Link href="/register" className="text-sm font-medium text-primary hover:underline">
          {t("login.noAccount")}
        </Link>
        <Link href="/forgot-password" className="text-sm font-medium text-muted-foreground hover:underline hover:text-foreground">
          {t("login.forgotPassword")}
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;

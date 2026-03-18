"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledPhoneInput } from "@/components/common/FormUIControllers/ControlledPhoneInput";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { adminLogin } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCleanPhoneData } from "@/lib/phone-utils";
import Link from "next/link";

const adminLoginSchema = z.object({
  countryCode: z.string(),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type AdminLoginValues = z.infer<typeof adminLoginSchema>;

const AdminLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    setError,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      countryCode: "+221",
      phoneNumber: "+221",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginValues) => {
    const { countryCode, number: phoneNumber } = getCleanPhoneData(data.phoneNumber);
    const res = await adminLogin({ countryCode, phoneNumber, password: data.password });

    if (!res.success) {
      setError("root", { type: "manual", message: res.message });
      return;
    }

    router.replace("/admin/dashboard");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in with your administrator credentials to access the platform.
        </p>
      </div>

      <div className="space-y-4">
        <ControlledPhoneInput
          name="phoneNumber"
          control={control}
          requiredMark="*"
          label="Phone Number"
          setValue={setValue}
          defaultCountry="SN"
          readOnlyCountryCode
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

        {errors.root && (
          <p className="text-xs text-destructive font-semibold">{errors.root.message}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full h-11 font-semibold">
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" />Signing in…</>
          ) : (
            "Sign In"
          )}
        </Button>
      </div>

      <div className="mt-8">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-muted-foreground hover:underline hover:text-foreground"
        >
          Forgot your password?
        </Link>
      </div>
    </form>
  );
};

export default AdminLoginForm;

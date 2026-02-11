"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginformSchema, LoginFormValues } from "@/schema/ueser.schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CountryAndPhoneInput } from "@/components/common/Country&PhoneInput";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { Typography } from "@/components/ui/Typography";
import { LoginRequestPayload } from "@/types/user.type";

const DoctorLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginformSchema),
    defaultValues: {
      password: "",
      countryCode: "",
      phoneNumber: "",
    },
  });
  const router = useRouter();
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const payload: LoginRequestPayload = {
        countryCode: data.countryCode,
        phoneNumber: data.phoneNumber,
        password: data.password,
      };
      const res = await loginAction(payload);
      if (!res.success) {
        setError("root", {
          type: "manual",
          message: res.message,
        });
        return;
      }
      router.push("/dashboard");
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message: error.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="max-w-111.5 mx-auto w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Dynamic Title & Description */}
        <DynamicHeading
          title="Login as a Provider"
          description="Enter your details below to login"
          titleProps={{ size: "2xl", weight: "semiBold", color: "primary" }}
          className="mb-6"
        />

        <div className="space-y-4">
          {/* Country and Phone */}
          <CountryAndPhoneInput
            control={control}
            countrycode="countryCode"
            mobileNumber="phoneNumber"
            label="Phone"
            errors={errors}
          />

          {/* Password */}
          <div className="relative">
            <ControlledInput
              name="password"
              label="Password"
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

          {/* Feedback Messages */}
          {errors.root && (
            <Typography size="xs" color="destructive" weight="semiBold">
              {errors.root.message}
            </Typography>
          )}

          {/* Submit Button */}
          <div className="w-full text-left">
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Login..." : "Login"}
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
              Don't have an account? Sign up
            </Typography>
          </Link>
          <Link href="/doctor/forgot-password">
            <Typography
              size="sm"
              weight="medium"
              color="primary"
              className="hover:underline"
            >
              {" "}
              Forgot your password?
            </Typography>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default DoctorLoginForm;

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
import { useServerFormError } from "@/hooks/useServerFormError";
import { FormError, FormSuccess } from "@/components/common/Feedback";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { Typography } from "@/components/ui/Typography";

const DoctorLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
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
  const serverErrorHandler = useServerFormError<LoginFormValues>(setError);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await loginAction(data);
      setSuccess(true);
      router.push("/dashboard");
    } catch (error: any) {
      serverErrorHandler(error);
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
            nameCode="countryCode"
            mobileNumber="phoneNumber"
            label="Phone"
            error={errors.phoneNumber?.message}
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
          <div className="space-y-2">
            {errors.root?.serverError?.message && (
              <FormError message={errors.root.serverError.message} />
            )}
            {success && (
              <FormSuccess message="Account created successfully! Redirecting to dashboard..." />
            )}
          </div>

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

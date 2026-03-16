"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "@/schema/forgotPassword.schema";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import AppButton from "@/components/common/AppButton";
import { Typography } from "@/components/ui/Typography";
import { forgotPassword } from "@/actions/auth.actions";

const AuthForgotPassword = ({ lang }: { lang: string }) => {
  const router = useRouter();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    const email = data?.email;
    const res = await forgotPassword({ email, lang });
    if (!res.success) {
      setError("root", { type: "manual", message: res.message });
      return;
    }

    router.push("/verify-otp");
  };

  return (
    <Card className="w-full rounded-sm">
      <CardHeader>
        <DynamicHeading
          title="Forgot password"
          description="Enter your email address and we'll send OTP code to reset your password"
        />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ControlledInput
            name="email"
            control={control}
            requiredMark="*"
            label="Email Address"
            placeholder="Enter your email"
          />

          {/* error from API */}
          {errors.root && (
            <Typography size="sm" color="destructive">
              {errors.root.message}
            </Typography>
          )}

          <AppButton
            type="submit"
            className="w-full dark:text-foreground"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Send OTP"
            )}
          </AppButton>

          <AppButton
            variant="outline"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="w-full flex items-center gap-1"
            onClick={() => router.back()}
          >
            Back to Sign in
          </AppButton>
        </form>
      </CardContent>
    </Card>
  );
};
export default AuthForgotPassword;

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import AppButton from "@/components/common/AppButton";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import {
  resetPasswordSchema,
  ResetPasswordValues,
} from "@/schema/forgotPassword.schema";
import { Typography } from "@/components/ui/Typography";
import { useI18n } from "@/locales/client";

export default function AuthResetPassword({ onSubmit, isLoading }: any) {
  const t = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema(t)),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <DynamicHeading
          title="Reset your password"
          description="Enter your new password below"
        />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Password */}
          <div className="relative">
            <ControlledInput
              name="password"
              requiredMark="*"
              label="New Password"
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

          {/* Confirm Password */}
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

          {/* Error Message */}
          {errors.root && (
            <Typography
              color="destructive"
              size="xs"
              weight="semiBold"
              className="mt-2"
            >
              {errors.root.message}
            </Typography>
          )}

          <AppButton
            className="w-full dark:text-foreground"
            type="submit"
            isLoading={isLoading}
            loadingText="Updating..."
          >
            Update Password
          </AppButton>
        </form>
      </CardContent>
    </Card>
  );
}

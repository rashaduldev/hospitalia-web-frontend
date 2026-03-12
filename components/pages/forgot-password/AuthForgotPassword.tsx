"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "@/schema/forgotPassword.schema";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import AppButton from "@/components/common/AppButton";
import { useRouter } from "next/navigation";

export default function AuthForgotPassword({
  onSubmit,
  isLoading,
  className,
}: any) {
  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const router = useRouter();

  return (
    <Card className={cn("w-full rounded-sm", className)}>
      <CardHeader>
        <DynamicHeading
          title="Reset password"
          description="Enter your email address and we'll send OTP code to reset your password"
        />
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((data) => onSubmit(data.email))}
          className="space-y-4"
        >
          <ControlledInput
            name="email"
            requiredMark="*"
            control={control}
            label="Email Address"
            placeholder="Enter your email"
          />
          <AppButton
            className="w-full dark:text-foreground"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
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
}

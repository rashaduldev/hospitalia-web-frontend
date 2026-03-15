"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import AppButton from "@/components/common/AppButton";
import {
  VerifyOtpFormValues,
  verifyOtpSchema,
} from "@/schema/forgotPassword.schema";
import { verifyOtp } from "@/actions/auth.actions";
import { Typography } from "@/components/ui/Typography";

const AuthOTPVerify = ({ email, lang }: { email: string; lang: string }) => {
  const router = useRouter();
  const [code, setCode] = useState("");

  const {
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = async (otpCode: string) => {
    const res = await verifyOtp({ email, otp: otpCode, lang });
    if (!res.success) {
      setError("code", { type: "manual", message: res.message });
      return;
    }
    router.push("/reset-password");
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          <DynamicHeading title="Verify Email" />
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          Please enter your OTP and verify
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        {/* error */}
        {errors.code && (
          <Typography size="xs" color="destructive">
            {errors.code.message}
          </Typography>
        )}

        <AppButton
          className="w-full dark:text-foreground"
          disabled={code.length !== 6 || isSubmitting}
          onClick={handleSubmit(() => onSubmit(code))}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : (
            "Verify Code"
          )}
        </AppButton>
      </CardContent>
    </Card>
  );
};
export default AuthOTPVerify;

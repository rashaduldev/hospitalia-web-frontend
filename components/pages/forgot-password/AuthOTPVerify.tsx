"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
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

export default function AuthOTPVerify({
  deliveryAddress,
  onSubmit,
  isLoading,
  errors,
}: any) {
  const [code, setCode] = useState("");

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          <DynamicHeading title="Verify Email" />
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          Sent to{" "}
          <span className="flex items-center gap-1 font-semibold">
            <Mail size={12} />
            {deliveryAddress}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {errors?.code && (
          <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
            {errors.code}
          </div>
        )}
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <AppButton
          className="w-full dark:text-foreground"
          disabled={code.length !== 6 || isLoading}
          onClick={() => onSubmit(code)}
        >
          {isLoading ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : (
            "Verify Code"
          )}
        </AppButton>
      </CardContent>
    </Card>
  );
}

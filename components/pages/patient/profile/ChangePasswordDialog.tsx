"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AppButton from "@/components/common/AppButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/Typography";

// ── schema ─────────────────────────────────────────────────────────────────

const ChangePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be at most 32 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordValues = z.infer<typeof ChangePasswordSchema>;

// ── password field with visibility toggle ──────────────────────────────────

function PasswordField({
  id,
  label,
  placeholder,
  error,
  ...inputProps
}: React.ComponentProps<"input"> & {
  id: string;
  label: string;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          className="pr-10"
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && (
        <Typography size="xs" color="destructive">
          {error}
        </Typography>
      )}
    </div>
  );
}

// ── dialog ─────────────────────────────────────────────────────────────────

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangePassword: (newPassword: string) => Promise<void>;
}

export default function ChangePasswordDialog({
  open,
  onOpenChange,
  onChangePassword,
}: ChangePasswordDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: ChangePasswordValues) => {
    try {
      await onChangePassword(values.newPassword);
      handleClose();
    } catch {
      // error shown via parent's ErrorDialog
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
              <KeyRound className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle className="text-base font-semibold">
              Change Password
            </DialogTitle>
          </div>
          <DialogDescription>
            Enter your current password and choose a new one.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PasswordField
            id="newPassword"
            label="New Password"
            placeholder="Enter new password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm New Password"
            placeholder="Re-enter new password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <AppButton
              type="submit"
              isLoading={isSubmitting}
              loadingText="Updating…"
            >
              Update Password
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

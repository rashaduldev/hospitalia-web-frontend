"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShieldAlert } from "lucide-react";
import AppButton from "@/components/common/AppButton";

const COUNTDOWN_SECONDS = 5;

interface SessionExpiredDialogProps {
  open: boolean;
}

export default function SessionExpiredDialog({
  open,
}: SessionExpiredDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  const loginPath = pathname.startsWith("/patient")
    ? "/patient/login"
    : "/login";

  const redirect = () => router.replace(loginPath);

  // Countdown + auto-redirect
  useEffect(() => {
    if (!open) {
      setCountdown(COUNTDOWN_SECONDS);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          redirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-sm"
        // Prevent closing by clicking outside or pressing Escape
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-5 w-5 flex-shrink-0" />
            Session Expired
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Your login session has expired. Please sign in again to continue.</p>
          <p>
            Redirecting to login in{" "}
            <span className="font-semibold text-foreground">{countdown}</span>{" "}
            second{countdown !== 1 ? "s" : ""}…
          </p>
        </div>

        <DialogFooter>
          <AppButton onClick={redirect}>Go to Login</AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

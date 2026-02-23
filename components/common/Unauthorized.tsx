"use client";

import { ShieldAlert, ArrowLeft, Home, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/Typography";
import { useI18n } from "@/locales/client";

export default function Unauthorized() {
  const router = useRouter();
  const t = useI18n();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-in fade-in duration-500">
      {/* Visual Identity */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-destructive/10 blur-3xl rounded-full" />
        <div className="relative bg-background border border-border p-6 rounded-3xl shadow-xl">
          <ShieldAlert className="size-14 text-destructive" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2 border-4 border-background shadow-lg">
          <LockKeyhole className="size-5 text-primary-foreground" />
        </div>
      </div>

      {/* Translated Content */}
      <Typography size="2xl" weight="bold" className="mb-3 tracking-tight">
        {t("unauthorized.title")}
      </Typography>
      
      <Typography size="md" color="muted" className="max-w-100 mb-10 leading-relaxed">
        {t("unauthorized.description")}
      </Typography>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm justify-center">
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => router.back()}
          className="gap-2 transition-all hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
          {t("unauthorized.go_back")}
        </Button>
        
        <Button 
          size="lg"
          onClick={() => router.push("/")}
          className="gap-2 px-8 shadow-md hover:shadow-lg transition-all"
        >
          <Home className="size-4" />
          {t("unauthorized.return_home")}
        </Button>
      </div>

      {/* Subtle Error ID for Support */}
      <div className="mt-16 pt-8 border-t border-border/50 w-full max-w-xs">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
          {t("unauthorized.error_code")}: 403_RESTRICTED_AREA
        </p>
      </div>
    </div>
  );
}
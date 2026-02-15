"use client";

import { ReactNode } from "react";
import { I18nProviderClient } from "@/locales/client";

type AppClientProviderProps ={
  locale: string;
  children: ReactNode;
}

export default function AppClientProvider({ locale, children }: AppClientProviderProps) {
  return (
    <I18nProviderClient locale={locale}>
      {children}
    </I18nProviderClient>
  );
}

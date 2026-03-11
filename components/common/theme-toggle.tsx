"use client";

import { Monitor, MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import AppButton from "./AppButton";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const getBtnClass = (mode: string) =>
    `p-2 rounded-md transition-all  ${
      theme === mode
        ? "bg-background text-muted bg-secondary shadow-sm border"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border w-fit">
      <AppButton
        variant="outline"
        onClick={() => setTheme("light")}
        className={getBtnClass("light")}
      >
        <Sun size={18} />
      </AppButton>
      <AppButton
        variant="outline"
        onClick={() => setTheme("dark")}
        className={getBtnClass("dark")}
      >
        <MoonStar size={18} />
      </AppButton>
      <AppButton
        variant="outline"
        onClick={() => setTheme("system")}
        className={getBtnClass("system")}
      >
        <Monitor size={18} />
      </AppButton>
    </div>
  );
}

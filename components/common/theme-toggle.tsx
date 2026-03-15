"use client";

import { Monitor, MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const getBtnClass = (mode: string) =>
    `p-2 rounded-full hover:cursor-pointer dark:text-foreground transition-all  ${
      theme === mode
        ? "bg-background text-muted bg-muted-foreground/50"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="flex items-center gap-1 w-fit">
      <button
        onClick={() => setTheme("light")}
        className={getBtnClass("light")}
      >
        <Sun size={18} />
      </button>
      <button onClick={() => setTheme("dark")} className={getBtnClass("dark")}>
        <MoonStar size={18} />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={getBtnClass("system")}
      >
        <Monitor size={18} />
      </button>
    </div>
  );
}

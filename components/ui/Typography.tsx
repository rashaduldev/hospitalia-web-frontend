"use client";
import { cn } from "@/lib/utils";
import { FC, ReactNode, ElementType } from "react";

type Size =
  | "4xl"
  | "3xl"
  | "2.5xl"
  | "2xl"
  | "xl"
  | "lg"
  | "md"
  | "sm"
  | "xs"
  | "custom";

export type TextProps = {
  as?: ElementType;
  size?: Size;
  color?: "primary" | "secondary" | "black" | "green" | "red" | "brand" | "destructive" | "muted" | "muted_foreground" | "foreground" | "ghost_foreground";
  weight?: "thin" | "normal" | "medium" | "semiBold" | "bold" | "black";
  align?: "center" | "left" | "right" | "justify" | "custom";
  fontFamily?: "body" | "heading"; 
  className?: string;
  onAction?: () => void;
  children: ReactNode;
};

export const Typography: FC<TextProps> = ({
  as: Component = "p", 
  size = "md",
  color = "primary",
  weight = "normal",
  align = "custom",
  fontFamily = "body",
  className = "",
  onAction,
  children,
}) => {
  const sizeClasses: Record<Size, string> = {
    "4xl": "text-[2rem]", //32px
    "3xl": "text-[1.875rem]", //30px
    "2.5xl": "text-[1.75rem]", //28px
    "2xl": "text-[1.5rem]", //24px
    xl: "text-[1.25rem]", //20px
    lg: "text-[1.125rem]", //18px
    md: "text-[1rem]", //16px
    sm: "text-[0.875rem]", //14px
    xs: "text-[0.75rem]", //12px
    custom: "",
  };

  const colorClasses = {
    primary: "text-primary dark:text-muted",
    secondary: "text-secondary dark:text-muted",
    destructive: "text-destructive",
    muted: "text-muted",
    muted_foreground: "text-muted-foreground",
    ghost_foreground: "text-ghost-foreground",
    foreground:"text-foreground",
    black: "text-card-foreground",
    green: "text-secondary",
    red: "text-destructive",
    brand: "text-ws-brand-500",
  };

  const weightClasses = {
    thin: "font-thin",
    normal: "font-normal",
    medium: "font-medium",
    semiBold: "font-semibold",
    bold: "font-bold",
    black: "font-black",
  };

  const alignClasses = {
    center: "text-center",
    left: "text-left",
    right: "text-right",
    justify: "text-justify",
    custom: "",
  };

  const fontFamilyClasses = {
    body: "font-inter",      
    heading: "font-plus-jakarta-sans", 
  };

  return (
    <Component
      className={cn(
        sizeClasses[size],
        colorClasses[color],
        weightClasses[weight],
        fontFamilyClasses[fontFamily],
        alignClasses[align],
        "leading-[100%] word-break",
        className
      )}
      onClick={onAction}
    >
      {children}
    </Component>
  );
};
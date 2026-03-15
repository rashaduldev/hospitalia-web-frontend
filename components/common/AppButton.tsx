"use client";

import { Loader2 } from "lucide-react";
import { Button, type buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";
import Link from "next/link";

type AppButtonProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
    loadingText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    href?: string;
  };

const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      href,
      ...props
    },
    ref,
  ) => {
    const content = (
      <>
        {isLoading && (
          <Loader2
            className={cn(
              "h-4 w-4 animate-spin",
              loadingText ? "relative" : "absolute inset-0 m-auto",
            )}
          />
        )}

        {isLoading ? (
          loadingText || <span className="opacity-0">{children}</span>
        ) : (
          <>
            {leftIcon && (
              <span className="inline-flex shrink-0 items-center justify-center">
                {leftIcon}
              </span>
            )}

            <span className="truncate">{children}</span>

            {rightIcon && (
              <span className="inline-flex shrink-0 items-center justify-center">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </>
    );

    if (href) {
      return (
        <Button
          asChild
          variant={variant}
          size={size}
          className={cn(
            "relative gap-2 transition-all active:scale-[0.97]",
            className,
          )}
        >
          <Link href={href}>{content}</Link>
        </Button>
      );
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={isLoading || disabled}
        className={cn(
          "relative gap-2 transition-all active:scale-[0.97]",
          className,
        )}
        {...props}
      >
        {content}
      </Button>
    );
  },
);

AppButton.displayName = "AppButton";

export default AppButton;

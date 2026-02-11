"use client";
import { FC } from "react";
import { Controller, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/Typography";

interface ControlledInputProps {
  name: string;
  label?: string;
  control: Control<any>;
  type?: string;
  placeholder?: string;
  className?: string;
}

export const ControlledInput: FC<ControlledInputProps> = ({
  name,
  label,
  control,
  type = "text",
  placeholder,
  className,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-1 relative w-full">
          {label && <Label>{label}</Label>}

          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            value={field.value || ""}
            className={className}
          />
          {fieldState.error && (
            <Typography size="xs" color="destructive">
              {fieldState.error.message}
            </Typography>
          )}
        </div>
      )}
    />
  );
};

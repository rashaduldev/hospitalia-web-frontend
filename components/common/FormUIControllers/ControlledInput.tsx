"use client";
import { FC } from "react";
import { Controller, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/Typography";

type ControlledInputProps = {
  name: string;
  requiredMark?: string;
  label?: string;
  control: Control<any>;
  type?: string;
  placeholder?: string;
  className?: string;
};

export const ControlledInput: FC<ControlledInputProps> = ({
  name,
  label,
  control,
  requiredMark,
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
          <div className="flex items-center gap-1 m-0 p-0 mb-1">
            {label && <Label>{label}</Label>}
            <Typography size="sm" color="destructive">
              {requiredMark && requiredMark}
            </Typography>
          </div>
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

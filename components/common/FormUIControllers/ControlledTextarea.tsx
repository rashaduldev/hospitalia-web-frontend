"use client";
import { FC } from "react";
import { Controller, Control } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/Typography";

interface ControlledTextareaProps {
  name: string;
  label: string;
  control: Control<any>;
  placeholder?: string;
}

export const ControlledTextarea: FC<ControlledTextareaProps> = ({
  name,
  label,
  control,
  placeholder,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-1">
          <Label>{label}</Label>
          <Textarea
            {...field}
            placeholder={placeholder}
            value={field.value || ""}
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

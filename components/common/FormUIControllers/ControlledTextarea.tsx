"use client";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/Typography";

type ControlledTextareaProps<T extends FieldValues = FieldValues> = {
  name: string;
  label: string;
  control: Control<T>;
  placeholder?: string;
}

export const ControlledTextarea = <T extends FieldValues = FieldValues>({
  name,
  label,
  control,
  placeholder,
}: ControlledTextareaProps<T>) => {
  return (
    <Controller
      name={name as Path<T>}
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

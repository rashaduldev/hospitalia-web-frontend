"use client";

import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/Typography";

interface ControlledDateInputProps {
  name: string;
  label: string;
  control: Control<any>;
  placeholder?: string;
  className?: string;
  error?: string;
}

export const ControlledDateInput: React.FC<ControlledDateInputProps> = ({
  name,
  label,
  control,
  placeholder = "Select date",
  className = "",
  error,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field className={className}>
          <FieldLabel>{label}</FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start font-normal w-full"
              >
                {field.value
                  ? new Date(field.value).toLocaleDateString()
                  : placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (!date) return;
                  const yyyy = date.getFullYear();
                  const mm = String(date.getMonth() + 1).padStart(2, "0");
                  const dd = String(date.getDate()).padStart(2, "0");
                  field.onChange(`${yyyy}-${mm}-${dd}`);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </Field>
      )}
    />
  );
};

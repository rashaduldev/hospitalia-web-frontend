import { FC, useState } from "react";
import { Controller, Control } from "react-hook-form";
import { FieldLabel, Field } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

export const ControlledDatePicker: FC<{
  name: string;
  label: string;
  control: Control<any>;
}> = ({ name, label, control }) => {
  const [open, setOpen] = useState(false);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className="w-full">
          <FieldLabel>{label}</FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start font-normal ${fieldState.error ? "border-destructive" : ""}`}
              >
                {field.value
                  ? new Date(field.value).toLocaleDateString()
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (!date) return;
                  const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                  field.onChange(formatted);
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

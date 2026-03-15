"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/Typography";
import {
  getCountryCallingCode,
  Country,
  parsePhoneNumber,
} from "react-phone-number-input";

interface ControlledPhoneInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  setValue: any;
  requiredMark: string;
  defaultCountry?: Country;
}

export const ControlledPhoneInput = <T extends FieldValues>({
  name,
  control,
  label,
  requiredMark,
  setValue,
  defaultCountry = "SN",
}: ControlledPhoneInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const handlePhoneChange = (newValue: string | undefined) => {
          const phoneNumberObj = parsePhoneNumber(field.value || "");
          const countryCode = phoneNumberObj
            ? `+${phoneNumberObj.countryCallingCode}`
            : "";
          if (newValue && countryCode && !newValue.startsWith(countryCode)) {
            field.onChange(countryCode);
          } else {
            field.onChange(newValue || "");
          }
        };

        return (
          <div className="space-y-1 w-full">
            <Label className="flex items-center gap-1">
              {label}
              <span className="text-destructive">
                {requiredMark && requiredMark}
              </span>
            </Label>
            <PhoneInput
              {...field}
              defaultCountry={defaultCountry}
              international
              value={field.value}
              onChange={handlePhoneChange}
              onCountryChange={(country: Country | undefined) => {
                if (country) {
                  const code = `+${getCountryCallingCode(country)}`;
                  setValue("countryCode", code);
                  setValue(name, code);
                }
              }}
              className={fieldState.error ? "border-destructive" : ""}
            />
            {fieldState.error && (
              <Typography size="xs" color="destructive">
                {fieldState.error.message}
              </Typography>
            )}
          </div>
        );
      }}
    />
  );
};

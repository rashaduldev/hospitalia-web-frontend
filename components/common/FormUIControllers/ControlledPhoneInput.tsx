"use client";

import {
  Controller,
  Control,
  FieldValues,
  Path,
  ControllerRenderProps,
  ControllerFieldState,
} from "react-hook-form";
import { PhoneInput, CountrySelect, CountryEntry } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/Typography";
import {
  getCountryCallingCode,
  getCountries,
  Country,
  parsePhoneNumber,
} from "react-phone-number-input";
import { useState, useEffect } from "react";

// Pre-computed outside component — 250+ countries, no need to recompute on each render
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const countryOptions: CountryEntry[] = getCountries().map((country) => ({
  value: country,
  label: regionNames.of(country) || country,
}));

interface ControlledPhoneInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  setValue: any;
  requiredMark: string;
  defaultCountry?: Country;
  readOnlyCountryCode?: boolean;
}

// ─── Split layout (read-only country code mode) ───────────────────────────────
// Extracted as its own component so it can use useState without violating
// the rules of hooks (no hooks inside Controller render callbacks).

interface SplitPhoneFieldProps {
  field: ControllerRenderProps<any, any>;
  fieldState: ControllerFieldState;
  defaultCountry: Country;
  setValue: any;
  label: string;
  requiredMark: string;
}

const SplitPhoneField = ({
  field,
  fieldState,
  defaultCountry,
  setValue,
  label,
  requiredMark,
}: SplitPhoneFieldProps) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);
  const [nationalNumber, setNationalNumber] = useState("");

  const countryCode = `+${getCountryCallingCode(selectedCountry)}`;

  // Initialise countryCode field on mount so schema validation doesn't fail
  // before the user interacts with the country selector.
  useEffect(() => {
    setValue("countryCode", countryCode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    const code = `+${getCountryCallingCode(country)}`;
    setValue("countryCode", code);
    field.onChange(nationalNumber ? `${code}${nationalNumber}` : code);
  };

  const handleNationalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setNationalNumber(digits);
    setValue("countryCode", countryCode);
    field.onChange(digits ? `${countryCode}${digits}` : countryCode);
  };

  return (
    <div className="space-y-1 w-full">
      <Label className="flex items-center gap-1">
        {label}
        <span className="text-destructive">{requiredMark}</span>
      </Label>

      <div className="flex">
        {/* Country selector — opens the searchable flag picker */}
        <CountrySelect
          value={selectedCountry}
          options={countryOptions}
          onChange={handleCountryChange}
        />

        {/* Read-only country code badge */}
        <span className="flex items-center px-3 text-sm font-medium bg-muted text-muted-foreground border border-input border-l-0 select-none whitespace-nowrap">
          {countryCode}
        </span>

        {/* National number input — digits only, no country code */}
        <Input
          type="tel"
          inputMode="numeric"
          value={nationalNumber}
          onChange={handleNationalChange}
          onBlur={field.onBlur}
          placeholder="Enter phone number"
          className={`rounded-s-none flex-1 border-l-0 ${
            fieldState.error ? "border-destructive" : ""
          }`}
        />
      </div>

      {fieldState.error && (
        <Typography size="xs" color="destructive">
          {fieldState.error.message}
        </Typography>
      )}
    </div>
  );
};

// ─── Main controller ──────────────────────────────────────────────────────────

export const ControlledPhoneInput = <T extends FieldValues>({
  name,
  control,
  label,
  requiredMark,
  setValue,
  defaultCountry = "SN",
  readOnlyCountryCode = false,
}: ControlledPhoneInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        if (readOnlyCountryCode) {
          return (
            <SplitPhoneField
              field={field}
              fieldState={fieldState}
              defaultCountry={defaultCountry}
              setValue={setValue}
              label={label}
              requiredMark={requiredMark}
            />
          );
        }

        // ── Original behavior (unchanged) ──────────────────────────────────
        const handlePhoneChange = (newValue: string | undefined) => {
          const phoneNumberObj = parsePhoneNumber(field.value || "");
          const existingCountryCode = phoneNumberObj
            ? `+${phoneNumberObj.countryCallingCode}`
            : "";
          if (
            newValue &&
            existingCountryCode &&
            !newValue.startsWith(existingCountryCode)
          ) {
            field.onChange(existingCountryCode);
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

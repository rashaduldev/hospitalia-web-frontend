"use client";

import Image from "next/image";
import { Label } from "@/components/ui/label";
import { PhoneInputProps } from "@/types/user.type";
import { useQuery } from "@tanstack/react-query";
import { ControlledSelect } from "./FormUIControllers/ControlledSelect";
import { ControlledInput } from "./FormUIControllers/ControlledInput";
import { Typography } from "../ui/Typography";

type Country = {
  name: string;
  isoCode: string;
  dialCode: string;
  flag: string;
};

async function fetchCountries(): Promise<Country[]> {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,idd,flags,cca2",
  );
  const data = await res.json();

  const list = data
    .map((c: any) => ({
      name: c.name.common,
      isoCode: c.cca2,
      dialCode:
        c.idd?.root && c.idd?.suffixes?.length
          ? c.idd.root + c.idd.suffixes[0]
          : null,
      flag: c.flags?.png || "",
    }))
    .filter((c: any) => c.dialCode)
    .sort((a: any, b: any) => a.name.localeCompare(b.name));

  return Array.from(
    new Map<string, Country>(
      list.map((i: Country) => [i.dialCode, i]),
    ).values(),
  );
}

export function CountryAndPhoneInput<T extends Record<string, any>>({
  control,
  countrycode,
  required,
  mobileNumber,
  label = "Phone Number",
}: PhoneInputProps<T>) {
  const { data: countries = [], isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 m-0 p-0 mb-1">
        {label && <Label>{label}</Label>}
        <Typography size="sm" color="destructive">
          {required && required}
        </Typography>
      </div>

      <div className="flex gap-0 relative">
        {/* Country Code */}
        <div className="z-20 w-28">
          <ControlledSelect
            className="rounded-r-none"
            name={countrycode}
            label=""
            control={control}
            placeholder={isLoading ? "..." : "Code"}
            options={countries.map((c) => ({
              label: c.dialCode,
              value: c.dialCode,
              flag: c.flag,
              name: c.name,
            }))}
            renderOption={(opt: any) => (
              <div className="flex items-center gap-2">
                <Image
                  width={18}
                  height={12}
                  src={opt.flag}
                  alt={opt.name}
                  className="rounded object-cover h-4.5 w-auto"
                  unoptimized
                />
                <span className="text-xs">{opt.label}</span>
              </div>
            )}
          />
        </div>

        {/* Phone Number */}
        <ControlledInput
          name={mobileNumber}
          control={control}
          placeholder="Enter your number"
          className="flex-1 rounded-l-none"
        />
      </div>
    </div>
  );
}

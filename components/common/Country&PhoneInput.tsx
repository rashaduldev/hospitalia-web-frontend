"use client";

import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Country, PhoneInputProps } from "@/types/user.type";

export function CountryAndPhoneInput({
  control,
  nameCode,
  mobileNumber,
  label = "Phone Number",
  error,
}: PhoneInputProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd,flags,cca2")
      .then((res) => res.json())
      .then((data) => {
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

        const uniqueByDialCode = Array.from(
          new Map(list.map((item: any) => [item.dialCode, item])).values()
        ) as Country[];

        setCountries(uniqueByDialCode);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2 relative">
        {/* Country Code */}
       <div className="z-20">
         <Controller
          name={nameCode}
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={(val) => field.onChange(val)}
              disabled={loading}
            >
              <SelectTrigger className="w-28 rounded-r-none">
                <SelectValue placeholder={loading ? "..." : "Code"} />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.isoCode} value={country.dialCode}>
                    <div className="flex items-center gap-2">
                      <Image
                        width={18}
                        height={12}
                        src={country.flag}
                        alt={country.name}
                        className="rounded object-cover h-4.5 w-auto"
                        unoptimized
                      />
                      <span className="text-xs">{country.dialCode}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
       </div>

        {/* Mobile Number */}
        <div className="absolute w-full z-10">
          <Controller
          name={mobileNumber}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Number"
              className="flex-1 pl-32"
            />
          )}
        />
        </div>
      </div>

      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  );
}

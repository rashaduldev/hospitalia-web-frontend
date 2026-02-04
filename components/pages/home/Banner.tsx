"use client";
import Link from "next/link";
import { useI18n } from "@/locales/client";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldLabel, FieldTitle } from "@/components/ui/field";

const Banner = () => {
  const t = useI18n();
  const params = useParams();
  const locale = params?.locale as string;

  return (
    <section
      className="relative w-full bg-cover bg-center h-130 sm:h-150 md:h-162.5 lg:h-161.25"
      style={{
        backgroundImage: 'url("/assets/banner.png")',
      }}
    >
      {/* Bottom text */}
      <div className="absolute bottom-0 w-full bg-primary/75 px-4 py-4 sm:px-8 sm:py-5 lg:px-14.5 lg:py-6.5">
        <h1 className="text-muted font-extrabold md:tracking-[-1.8px] text-xl leading-tight sm:text-4xl lg:text-[75px] lg:leading-16.25">
          {t("banner.titleMain")} <br />
          <span className="font-bold text-sm sm:text-2xl lg:text-[48px]">
            {t("banner.titleSub")}
          </span>
        </h1>
      </div>

      {/* Appointment Search Card */}
      <div className="absolute bg-background rounded-[10px] p-4 sm:p-6 w-[90%] sm:w-105 lg:w-121 left-1/2 -translate-x-1/2 top-4 lg:left-14 lg:translate-x-0 lg:top-11.25">
        <h2 className="text-xl">{t("banner.cardTitle")}</h2>
        <p className="mt-1 text-sm mb-4">
          {t("banner.cardSubtitle")}
        </p>
        {/* Implement letter this radio group */}
         <RadioGroup defaultValue="plus" className="flex mb-4">
      <FieldLabel htmlFor="plus-plan">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>{t("banner.doctor")}</FieldTitle>          </FieldContent>
          <RadioGroupItem value="plus" id="plus-plan" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="pro-plan">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>{t("banner.hospital")}</FieldTitle>
          </FieldContent>
          <RadioGroupItem value="pro" id="pro-plan" />
        </Field>
      </FieldLabel>
          </RadioGroup>

        {/* Select */}
        <div className="mb-4 w-full">
          <Label className="mb-2 flex items-center">
            {t("banner.selectCity")}{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("banner.selectCity")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="dhaka">Dhaka</SelectItem>
                <SelectItem value="chittagong">Chittagong</SelectItem>
                <SelectItem value="khulna">Khulna</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div>
          <Label className="mb-2 block">
            {t("banner.searchHere")}{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Input placeholder={t("banner.searchHere")} />
        </div>

        <hr className="my-4" />

        <div className="flex justify-center">
        <Link href={`/${locale}`}>
          <Button variant="secondary" className="w-fit">
            {t("banner.searchBtn")}
          </Button>
        </Link>
      </div>
      </div>
    </section>
  );
};

export default Banner;
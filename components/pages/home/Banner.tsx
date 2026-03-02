"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/locales/client";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Field, FieldContent, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Typography } from "@/components/ui/Typography";
import AppButton from "@/components/common/AppButton";

import { globalSearch } from "@/actions/global.search";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";

const schema = z.object({
  type: z.string(),
  city: z.string().min(1, "City is required"),
  searchKeyword: z.string().min(1, "Search keyword is required"),
});

type FormValues = {
  type: string;
  city: string;
  searchKeyword: string;
}

const CITY_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Dhaka", value: "dhaka" },
  { label: "Chittagong", value: "chittagong" },
  { label: "Khulna", value: "khulna" },
];

const Banner = () => {
  const t = useI18n();
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string;

  const { control, handleSubmit, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "",
      city: "",
      searchKeyword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    await globalSearch({
      lang: locale,
      searchKeyword: data.searchKeyword,
    });

    router.push(
      `/search?keyword=${data.searchKeyword}&city=${data.city}&type=${data.type}`
    );
  };

  return (
    <section
      className="relative w-full bg-cover bg-center h-130 sm:h-150 md:h-162.5 lg:h-161.25"
      style={{ backgroundImage: 'url("/assets/banner.png")' }}
    >
      {/* Bottom text */}
      <div className="absolute bottom-0 w-full bg-primary/75 px-4 py-4 sm:px-8 sm:py-5 lg:px-14.5 lg:py-6.5">
        <Typography
          as="h1"
          className="text-muted font-extrabold md:tracking-[-1.8px] text-xl leading-tight sm:text-4xl lg:text-[75px] lg:leading-16.25"
        >
          {t("banner.titleMain")} <br />
          <Typography
            as="span"
            className="font-bold text-sm sm:text-2xl lg:text-[48px]"
          >
            {t("banner.titleSub")}
          </Typography>
        </Typography>
      </div>

      {/* Card */}
      <div className="absolute bg-background rounded-[10px] p-4 sm:p-6 w-[90%] sm:w-105 lg:w-121 left-1/2 -translate-x-1/2 top-4 lg:left-14 lg:translate-x-0 lg:top-11.25">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography as="h2" className="text-xl">
            {t("banner.cardTitle")}
          </Typography>

          <Typography className="mt-1 text-sm mb-4">
            {t("banner.cardSubtitle")}
          </Typography>

          {/* Radio */}
          <RadioGroup
            defaultValue="plus"
            className="flex mb-4"
            onValueChange={(value) => setValue("type", value as any)}
          >
            <FieldLabel htmlFor="plus-plan">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{t("banner.doctor")}</FieldTitle>
                </FieldContent>
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

            <ControlledSelect
              name="city"
              control={control}
              options={CITY_OPTIONS}
              label={t("banner.selectCity")}
            />
          </div>

          {/* Input */}
          <div>
            <Label className="mb-2 block">
              {t("banner.searchHere")}{" "}
              <span className="text-destructive">*</span>
            </Label>

            <ControlledInput
              name="searchKeyword"
              control={control}
              placeholder={t("banner.searchHere")}
            />
          </div>

          <hr className="my-4" />

          <div className="flex justify-center">
            <AppButton type="submit" variant="secondary" className="w-fit">
              {t("banner.searchBtn")}
            </AppButton>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Banner;
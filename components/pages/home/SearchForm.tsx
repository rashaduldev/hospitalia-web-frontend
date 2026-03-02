/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import AppButton from "@/components/common/AppButton";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { DynamicHeading } from "@/components/common/DynamicHeading";

export const schema = z.object({
  type: z.string(),
  city: z.string().min(1, "City is required"),
  searchKeyword: z.string().min(1, "Search keyword is required"),
});

export type FormValues = z.infer<typeof schema>;

export type SearchFormProps = {
  formWidth?: string;
  headingTitle?: string;
  headingSubtitle?: string;
  cityOptions?: { label: string; value: string }[];
  lang: string;
  className: string;
  onSubmitPropAction?: (data: FormValues) => Promise<void>;
  initialValues?: Partial<FormValues>;
};

const CITY_OPTIONS_DEFAULT = [
  { label: "All", value: "all" },
  { label: "Dhaka", value: "dhaka" },
  { label: "Chittagong", value: "chittagong" },
];

export const SearchForm = ({
  formWidth = "w-[90%] sm:w-105 lg:w-121",
  headingTitle,
  headingSubtitle,
  className,
  cityOptions = CITY_OPTIONS_DEFAULT,
  onSubmitPropAction,
  initialValues,
}: SearchFormProps) => {
  const router = useRouter();

  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: initialValues?.type || "doctor",
      city: initialValues?.city || "all",
      searchKeyword: initialValues?.searchKeyword || "",
    },
  });

  const currentType = watch("type");

  const handleFormSubmit = async (data: FormValues) => {
    if (onSubmitPropAction) {
      onSubmitPropAction(data);
    } else {
      //   const query = new URLSearchParams({
      //     keyword: data.searchKeyword,
      //     city: data.city,
      //     type: data.type,
      //   }).toString();

      router.push(`/search`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`rounded-[10px] p-4 sm:p-6 ${formWidth} ${className}`}
    >
      {headingTitle && (
        <DynamicHeading
          title={headingTitle}
          description={headingSubtitle}
          titleProps={{ size: "xl", weight: "bold", color: "foreground" }}
          descriptionProps={{ size: "sm" }}
          className="mb-6"
        />
      )}

      <RadioGroup
        value={currentType}
        className="flex mb-4 gap-4"
        onValueChange={(val) => setValue("type", val)}
      >
        {["doctor", "hospital"].map((item) => (
          <FieldLabel
            key={item}
            htmlFor={`${item}-plan`}
            className="cursor-pointer"
          >
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle className="capitalize">{item}</FieldTitle>
              </FieldContent>
              <RadioGroupItem value={item} id={`${item}-plan`} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>

      <div className="mb-4 w-full">
        <ControlledSelect
          name="city"
          control={control}
          options={cityOptions}
          label="Select City"
        />
      </div>

      <div className="mb-4">
        <Label className="mb-2 block">
          Search <span className="text-destructive">*</span>
        </Label>
        <ControlledInput
          name="searchKeyword"
          control={control}
          placeholder="Search here..."
        />
      </div>

      <hr className="my-4" />

      <div className="flex justify-center">
        <AppButton
          type="submit"
          variant="secondary"
          className="w-full sm:w-fit text-white bg-primary"
        >
          Search Now
        </AppButton>
      </div>
    </form>
  );
};

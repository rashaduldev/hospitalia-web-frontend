/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { Searchschema } from "@/schema/search.schema";
import { SearchFormProps, SearchFormValues } from "@/types/search.type";

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
  onSubmitAction,
  initialValues,
}: SearchFormProps) => {
  const router = useRouter();

  const { control, handleSubmit, setValue, watch } = useForm<SearchFormValues>({
    resolver: zodResolver(Searchschema),
    defaultValues: {
      type: initialValues?.type || "doctor",
      city: initialValues?.city || "all",
      searchKeyword: initialValues?.searchKeyword || "",
    },
  });

  const currentType = watch("type");

  const handleFormSubmit = async (data: SearchFormValues) => {
    if (onSubmitAction) {
      onSubmitAction(data);
    } else {
      router.push(`/search`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`rounded-[10px] p-4 sm:p-6 ${formWidth} ${className || ""}`}
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

      {/* Type Selection */}
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
          required="*"
          control={control}
          options={cityOptions}
          label="Select City"
        />
      </div>

      <div className="mb-4">
        <Label className="mb-2 block">Search</Label>
        <ControlledInput
          name="searchKeyword"
          control={control}
          placeholder="Search Here"
        />
      </div>

      <hr className="my-4" />

      <div className="flex justify-center">
        <AppButton
          type="submit"
          variant="secondary"
          className="w-full sm:w-fit text-muted"
        >
          Search
        </AppButton>
      </div>
    </form>
  );
};

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
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { SearchFormProps, SearchFormValues } from "@/types/search.type";
import { searchSchema } from "@/schema/search.schema";

export const SearchForm = ({
  formWidth = "w-[90%] sm:w-105 lg:w-121",
  headingTitle,
  headingSubtitle,
  className,
  onSubmitAction,
  initialValues,
}: SearchFormProps) => {
  const router = useRouter();

  const { control, handleSubmit, setValue, watch } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      type: initialValues?.type || "doctor",
      searchKeyword: initialValues?.searchKeyword || "",
    },
  });

  const currentType = watch("type");

  const handleFormSubmit = async (data: SearchFormValues) => {
    if (onSubmitAction) {
      onSubmitAction(data);
    } else {
      // Build search params and navigate
      const params = new URLSearchParams();
      params.set("query", data.searchKeyword);
      params.set("type", data.type.toUpperCase()); // Matching your API expectation

      router.push(`/search?${params.toString()}`);
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
        className="flex mb-6 gap-4"
        onValueChange={(val) => setValue("type", val as "doctor" | "hospital")}
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

      <div className="mb-4">
        <Label className="mb-2 block">Search</Label>
        <ControlledInput
          name="searchKeyword"
          control={control}
          placeholder={`Search ${currentType} by name...`}
        />
      </div>

      <hr className="my-6" />

      <div className="flex justify-center">
        <AppButton
          type="submit"
          variant="secondary"
          className="w-full sm:w-fit text-muted px-10"
        >
          Search
        </AppButton>
      </div>
    </form>
  );
};

export default SearchForm;

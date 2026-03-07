"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
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
import { useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit, setValue } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchType: initialValues?.searchType || "DOCTOR",
      searchKeyword: initialValues?.searchKeyword || "",
    },
  });

  const currentType = useWatch({
    control,
    name: "searchType",
  });

  const handleFormSubmit = async (data: SearchFormValues) => {
    if (onSubmitAction) {
      onSubmitAction(data);
      return;
    }

    const params = new URLSearchParams();

    params.set("searchKeyword", data.searchKeyword);
    params.set("searchType", data.searchType);

    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
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

      {/* Search Type */}
      <RadioGroup
        value={currentType}
        className="flex mb-6 gap-4"
        onValueChange={(val) =>
          setValue("searchType", val as "DOCTOR" | "HOSPITAL")
        }
      >
        {["DOCTOR", "HOSPITAL"].map((item) => (
          <FieldLabel
            key={item}
            htmlFor={`${item}-plan`}
            className={`cursor-pointer rounded-lg border px-4 transition ${currentType === item ? "bg-border/40" : ""}`}
          >
            <Field orientation="horizontal" className="flex items-center gap-3">
              <RadioGroupItem
                value={item}
                id={`${item}-plan`}
                className="border border-border flex items-center justify-center data-[state=checked]:border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-foreground data-[state=checked]:size-2.5 data-[state=checked]:ring-4 data-[state=checked]:top-1 data-[state=checked]:ring-muted"
              />
              <FieldContent>
                <FieldTitle className="capitalize">
                  {item.toLowerCase()}
                </FieldTitle>
              </FieldContent>
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>

      {/* Search Input */}
      <div className="mb-4">
        <Label className="mb-2 block">Search</Label>

        <ControlledInput
          name="searchKeyword"
          control={control}
          placeholder={`Search ${currentType.toLowerCase()} by name...`}
        />
      </div>

      <hr className="my-6" />

      <div className="flex justify-center">
        <AppButton
          type="submit"
          variant="secondary"
          className="w-full sm:w-fit text-muted px-10"
          disabled={isPending}
        >
          {isPending ? "Searching..." : "Search"}
        </AppButton>
      </div>
    </form>
  );
};

export default SearchForm;

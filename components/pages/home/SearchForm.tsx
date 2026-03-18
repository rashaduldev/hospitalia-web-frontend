"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, MapPin, Stethoscope, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { SearchAutocomplete } from "./SearchAutocomplete";
import { useTransition } from "react";
import { SearchFormProps, SearchFormValues } from "@/types/search.type";
import { useI18n } from "@/locales/client";
import { SearchFormSchema } from "@/schema/search.schema";
import { cn } from "@/lib/utils";

const SENEGAL_REGIONS = [
  "ALL",
  "Dakar",
  "Thiès",
  "Saint-Louis",
  "Ziguinchor",
  "Kaolack",
  "Diourbel",
  "Tambacounda",
  "Louga",
  "Fatick",
  "Kolda",
  "Matam",
  "Kaffrine",
  "Kédougou",
  "Sédhiou",
];

const CITY_OPTIONS = SENEGAL_REGIONS.map((c) => ({
  label: c === "ALL" ? "All Regions" : c,
  value: c,
}));

const SEARCH_OPTIONS = [
  { value: "DOCTOR", labelKey: "banner.doctor", icon: Stethoscope },
  { value: "HOSPITAL", labelKey: "banner.hospital", icon: Building2 },
] as const;

export const SearchForm = ({
  formWidth = "w-full sm:w-105 lg:w-121",
  headingTitle,
  headingSubtitle,
  className,
  onSubmitAction,
  initialValues,
}: SearchFormProps) => {
  const router = useRouter();
  const t = useI18n();
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit, setValue } = useForm<SearchFormValues>({
    resolver: zodResolver(SearchFormSchema(t)),
    defaultValues: {
      searchType: initialValues?.searchType || "DOCTOR",
      city: initialValues?.city || "ALL",
      searchKeyword: initialValues?.searchKeyword || "",
    },
  });

  const currentType = useWatch({ control, name: "searchType" });
  const currentCity = useWatch({ control, name: "city" });

  const handleFormSubmit = async (data: SearchFormValues) => {
    if (onSubmitAction) {
      onSubmitAction(data);
      return;
    }

    const params = new URLSearchParams();
    params.set("searchKeyword", data.searchKeyword);
    params.set("searchType", data.searchType);
    if (data.city && data.city !== "ALL") params.set("city", data.city);

    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn(
        "rounded-xl p-5 sm:p-6 bg-white dark:bg-card shadow-lg border border-border/50",
        formWidth,
        className,
      )}
    >
      {headingTitle && (
        <DynamicHeading
          title={headingTitle}
          description={headingSubtitle}
          titleProps={{ size: "xl", weight: "bold", color: "foreground" }}
          descriptionProps={{ size: "sm" }}
          className="mb-5"
        />
      )}

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg mb-5">
        {SEARCH_OPTIONS.map(({ value, labelKey, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setValue("searchType", value)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-semibold transition-all duration-200",
              currentType === value
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="w-4 h-4" />
            {t(labelKey)}
          </button>
        ))}
      </div>

      <hr className="mb-5 border-border" />

      {/* City Select */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          {t("banner.selectCity")}
        </label>
        <ControlledSelect
          name="city"
          control={control}
          options={CITY_OPTIONS}
          placeholder="All Regions"
        />
      </div>

      {/* Search Input with Autocomplete */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5" />
          {t("banner.searchHere")}
        </label>
        <SearchAutocomplete
          name="searchKeyword"
          control={control}
          searchType={currentType}
          city={currentCity}
          placeholder={
            currentType === "DOCTOR"
              ? "Doctor name, specialty..."
              : "Hospital name, location..."
          }
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full font-semibold text-sm h-11"
      >
        <Search className="w-4 h-4 mr-2" />
        {isPending ? t("banner.searching") : t("banner.searchBtn")}
      </Button>
    </form>
  );
};

export default SearchForm;

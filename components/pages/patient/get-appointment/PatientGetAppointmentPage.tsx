"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { globalSearch } from "@/actions/global.search";
import { Typography } from "@/components/ui/Typography";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppButton from "@/components/common/AppButton";
import { SearchResultIteam } from "@/types/search.type";
import Pagination from "@/components/common/Pagination";
import { Loader2 } from "lucide-react";

const CITIES = ["All", "Dakar", "Saint-Louis", "Thiès", "Kaolack", "Ziguinchor"];

interface Props {
  lang: string;
  searchParams: Record<string, string>;
}

export default function PatientGetAppointmentPage({ lang, searchParams }: Props) {
  const router = useRouter();

  const [searchType, setSearchType] = useState<"DOCTOR" | "HOSPITAL">(
    (searchParams.type as "DOCTOR" | "HOSPITAL") || "DOCTOR"
  );
  const [city, setCity] = useState(searchParams.city || "All");
  const [keyword, setKeyword] = useState(searchParams.query || "");
  const [submitted, setSubmitted] = useState(!!searchParams.query);

  const { data: doctorData, isLoading: doctorLoading } = useQuery({
    queryKey: ["patientSearch", "DOCTOR", keyword, city, submitted],
    queryFn: () =>
      globalSearch({ lang, searchType: "DOCTOR", searchKeyword: keyword }),
    enabled: submitted,
  });

  const { data: hospitalData, isLoading: hospitalLoading } = useQuery({
    queryKey: ["patientSearch", "HOSPITAL", keyword, city, submitted],
    queryFn: () =>
      globalSearch({ lang, searchType: "HOSPITAL", searchKeyword: keyword }),
    enabled: submitted,
  });

  const doctors: SearchResultIteam[] = doctorData?.payload?.content ?? [];
  const hospitals: SearchResultIteam[] = hospitalData?.payload?.content ?? [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const isLoading = doctorLoading || hospitalLoading;

  return (
    <div className="p-6">
      {/* ── Search Form ───────────────────────────────────────────────────── */}
      <div className="mb-8">
        <Typography size="2xl" weight="bold" color="foreground" as="h1">
          Get Appointment
        </Typography>
        <Typography size="sm" color="muted" className="mt-1 mb-6">
          Nice to see you again!
        </Typography>

        <form onSubmit={handleSearch} className="space-y-4">
          {/* Doctor / Hospital toggle */}
          <div className="flex gap-0 rounded-lg overflow-hidden border w-fit">
            {(["DOCTOR", "HOSPITAL"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSearchType(type)}
                className={`px-6 py-2 text-sm font-medium transition-colors ${
                  searchType === type
                    ? "bg-primary text-white"
                    : "bg-background text-foreground hover:bg-accent"
                }`}
              >
                {type === "DOCTOR" ? "Doctor" : "Hospital"}
              </button>
            ))}
          </div>

          {/* City + Search row */}
          <div className="flex gap-4 items-end flex-wrap">
            <div className="w-48">
              <label className="text-sm font-medium mb-1 block">
                Select City
              </label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-52">
              <label className="text-sm font-medium mb-1 block">
                Search Here <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Search Here"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <AppButton
              type="submit"
              variant="secondary"
              className="text-white px-10"
              isLoading={isLoading && submitted}
              loadingText="Searching..."
            >
              Search
            </AppButton>
          </div>
        </form>
      </div>

      {/* ── Results ───────────────────────────────────────────────────────── */}
      {submitted && (
        <>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-10">
              {/* Doctors */}
              <ResultSection
                title={`${doctors.length} Doctors Found`}
                items={doctors}
                lang={lang}
                linkPrefix="/doctor"
              />

              {doctors.length > 0 && hospitals.length > 0 && (
                <p className="text-center text-2xl font-semibold text-foreground">
                  Or
                </p>
              )}

              {/* Hospitals */}
              {hospitals.length > 0 && (
                <ResultSection
                  title={`${hospitals.length} Hospitals Found`}
                  items={hospitals}
                  lang={lang}
                  linkPrefix="/doctor"
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ResultSection({
  title,
  items,
  lang,
  linkPrefix,
}: {
  title: string;
  items: SearchResultIteam[];
  lang: string;
  linkPrefix: string;
}) {
  return (
    <div>
      <Typography size="xl" weight="bold" color="foreground" as="h2" className="mb-4">
        {title}
      </Typography>
      <div className="bg-card rounded-lg border overflow-hidden">
        {items.map((item, idx) => (
          <a
            key={item.userId}
            href={`/${lang}${linkPrefix}/${item.userId}`}
            className={`flex flex-col px-6 py-4 hover:bg-accent/40 transition-colors cursor-pointer ${
              idx < items.length - 1 ? "border-b" : ""
            }`}
          >
            <Typography size="sm" weight="semiBold" color="foreground">
              {item.name}
            </Typography>
            <Typography size="xs" color="muted" className="mt-0.5">
              {[item.designation, item.locationName?.join(", ")]
                .filter(Boolean)
                .join(", ")}
            </Typography>
          </a>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2 px-1">
        Showing 1–{items.length} of {items.length} products
      </p>
    </div>
  );
}

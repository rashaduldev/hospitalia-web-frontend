"use client";

import { useRouter, usePathname } from "next/navigation";
import { SearchForm } from "@/components/pages/home/SearchForm";
import { SearchFormValues } from "@/types/search.type";

export default function SearchFormWrapper({
  initialValues,
}: {
  lang: string;
  initialValues: SearchFormValues;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (data: SearchFormValues) => {
    const params = new URLSearchParams();
    if (data.searchKeyword) params.set("query", data.searchKeyword);
    params.set("type", data.searchType);
    params.set("city", data.searchKeyword);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <SearchForm
      headingTitle="Get Appointment"
      headingSubtitle="Nice to see you again!"
      onSubmitAction={handleSearch}
      initialValues={initialValues}
      formWidth="w-full"
    />
  );
}

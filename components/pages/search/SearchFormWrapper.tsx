"use client";

import { useRouter, usePathname } from "next/navigation";
import { SearchForm } from "@/components/pages/home/SearchForm";
import { SearchFormValues } from "@/types/search.type";

export default function SearchFormWrapper({
  lang,
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
    params.set("type", data.type);
    params.set("city", data.city);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <SearchForm
      lang={lang}
      headingTitle="Get Appointment"
      headingSubtitle="Nice to see you again!"
      onSubmitAction={handleSearch}
      initialValues={initialValues}
      formWidth="w-full"
    />
  );
}

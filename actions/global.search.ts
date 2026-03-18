"use server";

import { apiClient } from "@/lib/api";

export async function globalSearch({
  lang,
  searchType,
  searchKeyword,
  city,
}: {
  lang: string;
  searchType: string;
  searchKeyword: string;
  city?: string;
}) {
  const params: Record<string, string> = { lang, searchType, searchKeyword };
  if (city && city !== "ALL") params.city = city;

  const res = await apiClient({
    endpoint: "/api/global-search/search",
    method: "GET",
    params,
  });

  return res;
}

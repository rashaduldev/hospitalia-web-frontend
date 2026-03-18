"use server";

import { apiClient } from "@/lib/api";

export async function globalSearch({
  lang,
  searchType,
  searchKeyword,
  city,
  page = 0,
}: {
  lang: string;
  searchType: string;
  searchKeyword: string;
  city?: string;
  page?: number;
}) {
  const params: Record<string, string> = { lang, searchType, searchKeyword, page: String(page) };
  if (city && city !== "ALL") params.city = city;

  const res = await apiClient({
    endpoint: "/api/global-search/search",
    method: "GET",
    params,
  });

  return res;
}

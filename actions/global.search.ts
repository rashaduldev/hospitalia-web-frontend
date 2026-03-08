"use server";

import { apiClient } from "@/lib/api";

export async function globalSearch({
  lang,
  searchType,
  searchKeyword,
}: {
  lang: string;
  searchType: string;
  searchKeyword: string;
}) {
  const res = await apiClient({
    endpoint: "/api/global-search/search",
    method: "GET",
    params: { lang, searchType, searchKeyword },
  });

  return res;
}

"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "./auth";

export async function globalSearch({ lang, searchKeyword }: { lang: string,searchKeyword: string }) {
  const token = await getAccessToken();

  if (!token) return null;

  const res = await apiClient({
    endpoint: `api/global-search/search?searchKeyword=${searchKeyword}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { lang },
  });

  return res.payload;
}

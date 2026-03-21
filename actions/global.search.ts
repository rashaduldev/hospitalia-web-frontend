"use server";

import { apiClient } from "@/lib/api";

export async function globalSearch({
  lang = "en",
  searchType,
  searchKeyword,
  city,
  pageNo = 0,
  pageSize = 10,
}: {
  lang?: string;
  searchType: "DOCTOR" | "HOSPITAL";
  searchKeyword: string;
  city?: string;
  pageNo?: number;
  pageSize?: number;
}) {
  const params: Record<string, string> = {
    lang,
    searchType,
    searchKeyword,
    pageNo: String(pageNo),
    pageSize: String(pageSize),
  };
  if (city && city !== "ALL") params.city = city;

  return apiClient({
    endpoint: "/api/global-search/search",
    method: "GET",
    params,
  });
}

export async function getDoctorCities(): Promise<string[]> {
  const res = await apiClient<string[]>({
    endpoint: "/api/global-search/cities/doctors",
    method: "GET",
  });
  return res?.payload ?? [];
}

export async function getHospitalCities(): Promise<string[]> {
  const res = await apiClient<string[]>({
    endpoint: "/api/global-search/cities/hospitals",
    method: "GET",
  });
  return res?.payload ?? [];
}
